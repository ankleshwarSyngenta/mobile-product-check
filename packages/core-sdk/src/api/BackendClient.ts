export interface BackendClientConfig {
  baseUrl: string;
  authToken?: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
}

export interface ProductMetadataDTO {
  name?: string;
  manufacturer?: string;
  marketedBy?: string;
  manufacturedOn?: string;
  expiryDate?: string;
  batchNumber?: string;
  serialNumber?: string;
  rawMaterialBatchNumber?: string;
}

export interface VerificationResponseDTO {
  status: 'success' | 'error' | 'warning';
  message: string;
  product?: ProductMetadataDTO;
  errorCode?: number;
  scanCountLastYear?: number;
  uniqueRetailersLastYear?: number;
}

export class BackendClient {
  constructor(private readonly cfg: BackendClientConfig) {}

  async verify(code: string): Promise<VerificationResponseDTO> {
    // Placeholder: real implementation will call the verification endpoint.
    if (!this.cfg.baseUrl) {
      return { status: 'error', message: 'Missing backend baseUrl configuration' };
    }
    // Simulate network fetch with minimal headers & fallback.
    // Retain config reference for future real fetch.
    /* future: use this.config.baseUrl in fetch call */
    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
      // Very naive stub branching to simulate error codes.
      if (!code) return { status: 'error', message: 'Empty code', errorCode: 4 };
      if (code.includes('BLACKLIST'))
        return { status: 'error', message: 'Blacklisted', errorCode: 7 };
      if (code.startsWith('SYN-')) {
        // Simulate counterfeit stats
        const uniqueRetailersLastYear = code.includes('COUNTERFEIT') ? 12 : 3;
        return {
          status: uniqueRetailersLastYear > 10 ? 'warning' : 'success',
          message:
            uniqueRetailersLastYear > 10
              ? 'Potential counterfeit detected. Please escalate.'
              : 'This product is authentic and registered with Syngenta.',
          product: {
            name: 'Demo Product',
            manufacturer: 'Syngenta',
            marketedBy: 'Syngenta',
            manufacturedOn: '2025-01-01',
            expiryDate: '2026-01-01',
            batchNumber: 'BATCH-123',
            serialNumber: 'SN-555-XYZ',
            rawMaterialBatchNumber: 'RAW-888',
          },
          scanCountLastYear: 15,
          uniqueRetailersLastYear,
        };
      }
      // Non Syngenta fallback error code 6 - Invalid Tracking ID
      return { status: 'error', message: 'Non Syngenta product', errorCode: 6 };
    } catch (e) {
      return { status: 'error', message: (e as Error).message };
    }
  }
}
