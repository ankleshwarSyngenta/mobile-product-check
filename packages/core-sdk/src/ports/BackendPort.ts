/**
 * Port interface for backend verification services
 * Allows swapping implementations without changing business logic
 */
export interface VerificationRequest {
  code: string;
  codeType?: 'QR' | 'DataMatrix' | 'EAN' | 'UPC';
  retailerId?: string;
}

export interface ProductMetadata {
  name?: string;
  manufacturer?: string;
  marketedBy?: string;
  manufacturedOn?: string;
  expiryDate?: string;
  batchNumber?: string;
  serialNumber?: string;
  rawMaterialBatchNumber?: string;
  trackingId?: string;
}

export interface VerificationResponse {
  status: 'success' | 'error' | 'warning';
  message: string;
  product?: ProductMetadata;
  errorCode?: number;
  scanCountLastYear?: number;
  uniqueRetailersLastYear?: number;
}

export interface BackendPort {
  /**
   * Verify product authenticity by code
   */
  verify(request: VerificationRequest): Promise<VerificationResponse>;

  /**
   * Fetch additional product metadata (optional)
   */
  fetchMetadata?(productId: string): Promise<ProductMetadata>;
}
