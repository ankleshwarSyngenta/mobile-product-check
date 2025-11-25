import { VerificationResult } from '../types';

export interface ProductVerificationConfig {
  locale?: string;
  enableCounterfeitCheck?: boolean;
}

export interface ProductVerificationService {
  scan(code: string): Promise<VerificationResult>;
}

export function createProductVerificationService(
  _config: ProductVerificationConfig = {}
): ProductVerificationService {
  return {
    async scan(code: string) {
      if (code.startsWith('SYN-')) {
        return {
          status: 'success',
          message: 'This product is authentic and registered with Syngenta.',
          productDetails: {
            name: 'Demo Product',
            manufacturer: 'Syngenta',
            marketedBy: 'Syngenta',
            manufacturedOn: '2025-01-01',
            expiryDate: '2026-01-01',
            batchNumber: 'BATCH-123',
          },
        };
      }
      return { status: 'error', message: 'Non Syngenta product', errorCode: 6 };
    },
  };
}
