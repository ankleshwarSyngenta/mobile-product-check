import { useCallback } from 'react';
import { BackendClient } from '../api/BackendClient';
import { useVerificationTheme } from '../theme/ThemeProvider';
import { VerificationResult } from '../types';
import { LocalizationPort, DefaultLocalization } from '../ports/LocalizationPort';
import { AnalyticsPort, NoOpAnalytics } from '../ports/AnalyticsPort';

export interface UseProductVerificationOptions {
  client: BackendClient;
  counterfeitThreshold?: number;
  localization?: LocalizationPort;
  analytics?: AnalyticsPort;
  retailerId?: string;
}

export function useProductVerification(options: UseProductVerificationOptions) {
  const theme = useVerificationTheme();
  const { client, counterfeitThreshold = 10, retailerId } = options;
  const localization = options.localization || new DefaultLocalization();
  const analytics = options.analytics || new NoOpAnalytics();

  const verifyCode = useCallback(
    async (
      code: string,
      codeType?: 'QR' | 'DataMatrix' | 'EAN' | 'UPC'
    ): Promise<VerificationResult> => {
      analytics.track({
        name: 'scan_start',
        properties: { code, ...(codeType && { codeType }) },
      });

      try {
        const dto = await client.verify(code, codeType);

        if (dto.status === 'success' && dto.product) {
          const na = localization.t('verification.na');
          const productDetails = {
            name: dto.product.name ?? na,
            manufacturer: dto.product.manufacturer ?? na,
            marketedBy: dto.product.marketedBy ?? na,
            manufacturedOn: dto.product.manufacturedOn ?? na,
            expiryDate: dto.product.expiryDate ?? na,
            batchNumber: dto.product.batchNumber ?? na,
            serialNumber: dto.product.serialNumber ?? na,
            rawMaterialBatchNumber: dto.product.rawMaterialBatchNumber ?? na,
            trackingId: dto.product.trackingId ?? na,
          };

          const counterfeitSuspected = (dto.uniqueRetailersLastYear ?? 0) > counterfeitThreshold;

          const result: VerificationResult = {
            status: counterfeitSuspected ? 'warning' : 'success',
            message: counterfeitSuspected
              ? localization.t('verification.warning')
              : localization.t('verification.success'),
            productDetails,
            code,
            scanCountLastYear: dto.scanCountLastYear,
            uniqueRetailersLastYear: dto.uniqueRetailersLastYear,
            counterfeitSuspected,
          };

          analytics.track({
            name: counterfeitSuspected ? 'scan_counterfeit_warning' : 'scan_success',
            properties: {
              code,
              ...(retailerId && { retailerId }),
              ...(dto.uniqueRetailersLastYear !== undefined && {
                uniqueRetailersLastYear: dto.uniqueRetailersLastYear,
              }),
            },
          });

          return result;
        }

        if (dto.status === 'warning') {
          const result: VerificationResult = {
            status: 'warning',
            message: dto.message || localization.t('verification.warning'),
            code,
            errorCode: dto.errorCode,
            counterfeitSuspected: true,
            scanCountLastYear: dto.scanCountLastYear,
            uniqueRetailersLastYear: dto.uniqueRetailersLastYear,
          };

          analytics.track({
            name: 'scan_warning',
            properties: {
              code,
              ...(dto.errorCode !== undefined && { errorCode: dto.errorCode }),
            },
          });

          return result;
        }

        // Error case
        const errorMessage =
          dto.errorCode !== undefined
            ? localization.t(`error.code.${dto.errorCode}`)
            : dto.message || localization.t('verification.error');

        const result: VerificationResult = {
          status: 'error',
          message: errorMessage,
          code,
          errorCode: dto.errorCode,
        };

        analytics.track({
          name: 'scan_error',
          properties: {
            code,
            ...(dto.errorCode !== undefined && { errorCode: dto.errorCode }),
          },
        });

        return result;
      } catch (error) {
        analytics.track({
          name: 'scan_exception',
          properties: { code, error: error instanceof Error ? error.message : 'Unknown' },
        });

        return {
          status: 'error',
          message: localization.t('verification.error'),
          code,
        };
      }
    },
    [client, theme.messages, counterfeitThreshold, localization, analytics, retailerId]
  );

  return { verifyCode };
}
