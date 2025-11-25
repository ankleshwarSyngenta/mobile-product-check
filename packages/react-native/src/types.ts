import type { ProductMetadata, VerificationResponse } from './ports/BackendPort';

export interface ProductDetails {
  name: string;
  manufacturer?: string;
  marketedBy?: string;
  manufacturedOn?: string;
  expiryDate?: string;
  batchNumber?: string;
  serialNumber?: string;
  rawMaterialBatchNumber?: string;
  trackingId?: string;
}

export type VerificationStatus = 'success' | 'error' | 'warning';

export interface VerificationResult {
  status: VerificationStatus;
  message: string;
  productDetails?: ProductDetails;
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

export type { DecodedCodeData } from './utils/codeDecoder';
export type { ProductMetadata, VerificationResponse };
