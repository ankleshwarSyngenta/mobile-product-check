import {
  ScannerConfig,
  VerificationResponse,
  VerificationStatus,
  ProductDetails,
  ErrorCode,
  ApiError,
} from '../types';
import { CodeDecoder } from '../utils/codeDecoder';
import { ERROR_MESSAGES, DEFAULT_COUNTERFEIT_THRESHOLD, DEFAULT_COUNTERFEIT_CHECK_PERIOD_DAYS } from '../constants';

/**
 * Product verification service for communicating with Syngenta backend
 */
export class ProductVerificationService {
  private config: ScannerConfig;
  private scanHistory: Map<string, number[]> = new Map();

  constructor(config: ScannerConfig) {
    this.config = config;
  }

  /**
   * Verify product authenticity
   */
  async verifyProduct(scannedCode: string): Promise<VerificationResponse> {
    try {
      // Step 1: Decode and validate the code
      const decoded = CodeDecoder.decode(scannedCode);
      
      if (!decoded.isValid || !decoded.trackingId) {
        return {
          status: VerificationStatus.NON_SYNGENTA,
          error: {
            errorCode: ErrorCode.INVALID_TRACKING_ID,
            message: ERROR_MESSAGES[ErrorCode.INVALID_TRACKING_ID],
          },
        };
      }

      // Step 2: Call Standard Scan API
      const apiResponse = await this.callStandardScanAPI(decoded.trackingId, decoded.url || scannedCode);

      // Step 3: Check for counterfeit (10+ scans by different users in 1 year)
      const scanCount = await this.checkCounterfeitRisk(decoded.trackingId);
      const isCounterfeitWarning = scanCount >= (this.config.counterfeitThreshold || DEFAULT_COUNTERFEIT_THRESHOLD);

      if (apiResponse.status === VerificationStatus.SUCCESS && apiResponse.data) {
        return {
          ...apiResponse,
          scanCount,
          isCounterfeitWarning,
        };
      }

      return apiResponse;
    } catch (error) {
      console.error('Product verification error:', error);
      return {
        status: VerificationStatus.ERROR,
        error: {
          errorCode: ErrorCode.AUTHENTICATION_FAILED,
          message: 'An error occurred during verification',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Call Syngenta Standard Scan API
   */
  private async callStandardScanAPI(trackingId: string, originalUrl: string): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          trackingId,
          url: originalUrl,
          timestamp: new Date().toISOString(),
          locale: this.config.locale,
        }),
      });

      const data = await response.json();

      // Handle error codes (0-12)
      if (data.errorCode !== undefined && data.errorCode >= 0 && data.errorCode <= 12) {
        return {
          status: VerificationStatus.NON_SYNGENTA,
          error: {
            errorCode: data.errorCode,
            message: ERROR_MESSAGES[data.errorCode] || 'Unknown error',
            details: data.message || data.details,
          },
        };
      }

      // Success response
      if (response.ok && data.product) {
        const productDetails: ProductDetails = {
          productName: data.product.productName || 'NA',
          serialNumber: data.product.serialNumber || 'NA',
          producedDate: data.product.producedDate || data.product.manufacturedOn || 'NA',
          expiryDate: data.product.expiryDate || 'NA',
          batchNumber: data.product.batchNumber || 'NA',
          rawMaterialBatchNumber: data.product.rawMaterialBatchNumber || 'NA',
          manufacturer: data.product.manufacturer,
          marketedBy: data.product.marketedBy,
        };

        return {
          status: VerificationStatus.SUCCESS,
          data: productDetails,
        };
      }

      // Unknown error
      return {
        status: VerificationStatus.NON_SYNGENTA,
        error: {
          errorCode: ErrorCode.AUTHENTICATION_FAILED,
          message: 'Unable to verify product',
          details: data.message,
        },
      };
    } catch (error) {
      throw new Error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check counterfeit risk based on scan history
   * Returns the number of unique scans in the specified period
   */
  private async checkCounterfeitRisk(trackingId: string): Promise<number> {
    const now = Date.now();
    const periodMs = (this.config.counterfeitCheckPeriodDays || DEFAULT_COUNTERFEIT_CHECK_PERIOD_DAYS) * 24 * 60 * 60 * 1000;

    // Get or initialize scan history for this tracking ID
    let scans = this.scanHistory.get(trackingId) || [];

    // Filter scans within the period
    scans = scans.filter((timestamp) => now - timestamp < periodMs);

    // Add current scan
    scans.push(now);

    // Update history
    this.scanHistory.set(trackingId, scans);

    // In a production environment, this should be persisted to backend
    // and checked against unique user IDs, not just scan count
    return scans.length;
  }

  /**
   * Record scan for counterfeit detection
   * In production, this should call a backend API to record unique user scans
   */
  async recordScan(trackingId: string, userId?: string): Promise<void> {
    try {
      await fetch(`${this.config.apiBaseUrl}/record-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          trackingId,
          userId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to record scan:', error);
    }
  }

  /**
   * Get scan count from backend
   */
  async getScanCount(trackingId: string): Promise<number> {
    try {
      const periodDays = this.config.counterfeitCheckPeriodDays || DEFAULT_COUNTERFEIT_CHECK_PERIOD_DAYS;
      
      const response = await fetch(
        `${this.config.apiBaseUrl}/scan-count?trackingId=${trackingId}&periodDays=${periodDays}`,
        {
          headers: {
            ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.scanCount || 0;
      }

      return 0;
    } catch (error) {
      console.error('Failed to get scan count:', error);
      return 0;
    }
  }
}
