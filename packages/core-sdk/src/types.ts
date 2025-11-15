// Re-export port types for convenience
export type { ProductMetadata as ProductDetails } from './ports/BackendPort';
export type { VerificationResponse } from './ports/BackendPort';

export type VerificationStatus = 'success' | 'error' | 'warning';

export interface VerificationResult {
  status: VerificationStatus;
  message: string;
  productDetails?: {
    name: string;
    manufacturer: string;
    marketedBy: string;
    manufacturedOn: string;
    expiryDate: string;
    batchNumber: string;
    serialNumber?: string;
    rawMaterialBatchNumber?: string;
    trackingId?: string;
  };
  code?: string;
  errorCode?: number;
  scanCountLastYear?: number;
  uniqueRetailersLastYear?: number;
  counterfeitSuspected?: boolean;
}

export interface CounterfeitStats {
  scanCountLastYear: number;
  uniqueRetailersLastYear: number;
}

export interface ScannerConfig {
  apiBaseUrl: string;
  authToken?: string;
  locale?: string;
  counterfeitThreshold?: number;
  retailerId?: string;
  timeout?: number;
  retryAttempts?: number;
  enableAnalytics?: boolean;
}

// Re-export from utils to avoid duplication
export type { DecodedCodeData } from './utils/codeDecoder';
