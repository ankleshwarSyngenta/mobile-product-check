import { useCallback } from 'react';
import { VerificationResult } from '../types';

interface UseVerificationOpts {
  locale: string;
  enableCounterfeitCheck: boolean;
}

// Minimal placeholder verification: returns success for demo codes; real implementation will call BackendPort.
export function useVerificationService(opts: UseVerificationOpts) {
  const verifyCode = useCallback(
    async (code: string): Promise<VerificationResult> => {
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
    [opts.locale, opts.enableCounterfeitCheck]
  );

  return { verifyCode };
}
