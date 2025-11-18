export interface ProductDetails {
  name: string;
  manufacturer: string;
  marketedBy: string;
  manufacturedOn: string;
  expiryDate: string;
  batchNumber: string;
}

export interface VerificationResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  productDetails?: ProductDetails;
  code?: string;
  errorCode?: number;
}
