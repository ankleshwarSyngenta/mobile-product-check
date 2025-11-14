import { DecodedResult } from '../types';
import { SYNGENTA_QR_PATTERNS } from '../constants';

/**
 * Code decoder utility for validating and extracting data from QR codes
 */
export class CodeDecoder {
  /**
   * Decode and validate a scanned code
   */
  static decode(codeText: string): DecodedResult {
    if (!codeText || codeText.trim() === '') {
      return {
        text: codeText,
        isValid: false,
      };
    }

    const trimmedCode = codeText.trim();

    // Check if it's a Syngenta QR code
    const isSyngentaCode = this.isSyngentaCode(trimmedCode);

    if (!isSyngentaCode) {
      return {
        text: trimmedCode,
        isValid: false,
      };
    }

    // Extract tracking ID from URL or code
    const trackingId = this.extractTrackingId(trimmedCode);

    return {
      text: trimmedCode,
      format: this.detectFormat(trimmedCode),
      isValid: true,
      trackingId,
      url: this.isUrl(trimmedCode) ? trimmedCode : undefined,
    };
  }

  /**
   * Check if the code is a Syngenta product code
   */
  static isSyngentaCode(code: string): boolean {
    // Check against known Syngenta patterns
    return SYNGENTA_QR_PATTERNS.some((pattern) => pattern.test(code));
  }

  /**
   * Extract tracking ID from the code
   */
  static extractTrackingId(code: string): string | undefined {
    // If it's a URL, extract tracking ID from query parameters or path
    if (this.isUrl(code)) {
      try {
        const url = new URL(code);
        
        // Check common parameter names
        const paramNames = ['id', 'trackingId', 'tracking_id', 'code', 'productId'];
        for (const param of paramNames) {
          const value = url.searchParams.get(param);
          if (value) {
            return value;
          }
        }

        // Try to extract from path
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          return pathParts[pathParts.length - 1];
        }
      } catch {
        // Not a valid URL, treat as direct tracking ID
        return code;
      }
    }

    // If not a URL, assume the entire code is the tracking ID
    return code;
  }

  /**
   * Detect the format of the code
   */
  static detectFormat(code: string): string {
    if (this.isUrl(code)) {
      return 'URL';
    }
    if (/^\d+$/.test(code)) {
      return 'NUMERIC';
    }
    if (/^[A-Z0-9]+$/.test(code)) {
      return 'ALPHANUMERIC';
    }
    return 'UNKNOWN';
  }

  /**
   * Check if the code is a URL
   */
  static isUrl(code: string): boolean {
    try {
      const url = new URL(code);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validate code format and integrity
   */
  static validateCode(code: string): { isValid: boolean; error?: string } {
    if (!code || code.trim() === '') {
      return {
        isValid: false,
        error: 'Code is empty',
      };
    }

    const decoded = this.decode(code);
    if (!decoded.isValid) {
      return {
        isValid: false,
        error: 'Not a valid Syngenta product code',
      };
    }

    if (!decoded.trackingId) {
      return {
        isValid: false,
        error: 'Unable to extract tracking ID from code',
      };
    }

    return { isValid: true };
  }
}
