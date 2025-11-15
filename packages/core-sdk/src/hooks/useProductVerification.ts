import { useCallback } from 'react';
import { BackendClient } from '../api/BackendClient';
import { useVerificationTheme } from '../theme/ThemeProvider';
import { VerificationResult, ProductDetails } from '../types';
import { mapErrorCodeToMessage } from '../verification/errorCodes';

export interface UseProductVerificationOptions {
  client: BackendClient;
  counterfeitThreshold?: number;
}

export function useProductVerification(options: UseProductVerificationOptions) {
  const theme = useVerificationTheme();
  const { client } = options;

  const verifyCode = useCallback(
    async (code: string): Promise<VerificationResult> => {
      const dto = await client.verify(code);
      if (dto.status === 'success' && dto.product) {
        const details: ProductDetails = {
          name: dto.product.name ?? 'NA',
          manufacturer: dto.product.manufacturer ?? 'NA',
          marketedBy: dto.product.marketedBy ?? 'NA',
          manufacturedOn: dto.product.manufacturedOn ?? 'NA',
          expiryDate: dto.product.expiryDate ?? 'NA',
          batchNumber: dto.product.batchNumber ?? 'NA',
          serialNumber: dto.product.serialNumber ?? 'NA',
          rawMaterialBatchNumber: dto.product.rawMaterialBatchNumber ?? 'NA',
        };
        return {
          status: 'success',
          message: theme.messages.success,
          productDetails: details,
          code,
          scanCountLastYear: dto.scanCountLastYear,
          uniqueRetailersLastYear: dto.uniqueRetailersLastYear,
          counterfeitSuspected:
            (dto.uniqueRetailersLastYear ?? 0) >
            (options.counterfeitThreshold ?? Number.MAX_SAFE_INTEGER),
        };
      }
      if (dto.status === 'warning') {
        return {
          status: 'warning',
          message: theme.messages.warning,
          code,
          errorCode: dto.errorCode,
          counterfeitSuspected: true,
          scanCountLastYear: dto.scanCountLastYear,
          uniqueRetailersLastYear: dto.uniqueRetailersLastYear,
        };
      }
      const fallbackMsg =
        dto.errorCode !== undefined
          ? (mapErrorCodeToMessage(dto.errorCode) ?? theme.messages.error)
          : theme.messages.error;
      return { status: 'error', message: fallbackMsg, code, errorCode: dto.errorCode };
    },
    [client, theme.messages]
  );

  return { verifyCode };
}
