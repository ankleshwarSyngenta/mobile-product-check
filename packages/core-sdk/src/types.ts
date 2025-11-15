export interface ProductDetails {
  name: string;
  manufacturer: string;
  marketedBy: string;
  manufacturedOn: string;
  expiryDate: string;
  batchNumber: string;
  serialNumber?: string; // Scenario 1 extra field
  rawMaterialBatchNumber?: string; // Scenario 1 extra field
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

export interface DecodedCodeData {
  trackingId?: string;
  gtin?: string;
  serialNumber?: string;
  raw?: string;
}
