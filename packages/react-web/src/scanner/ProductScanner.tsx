import React, { useEffect, useState } from 'react';
import {
  BackendClient,
  useProductVerification,
  VerificationThemeProvider,
  useVerificationTheme,
  VerificationResult,
} from '@syngenta/product-verification-core-sdk';

interface ProductScannerProps {
  onResult?: (result: VerificationResult) => void;
  className?: string;
  apiBaseUrl: string;
  authToken?: string;
  enableCounterfeitCheck?: boolean;
  themeOverride?: Parameters<typeof VerificationThemeProvider>[0]['theme'];
}

export const ProductScanner: React.FC<ProductScannerProps> = ({
  onResult,
  className,
  apiBaseUrl,
  authToken,
  enableCounterfeitCheck = true,
  themeOverride,
}) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'error' | 'warning'>(
    'idle'
  );
  const [result, setResult] = useState<VerificationResult | null>(null);
  const client = new BackendClient({ baseUrl: apiBaseUrl, authToken });
  const { verifyCode } = useProductVerification({
    client,
    counterfeitThreshold: enableCounterfeitCheck ? 10 : undefined,
  });
  const theme = useVerificationTheme();

  useEffect(() => {
    // Minimal approach: simulate scan; real implementation will use getUserMedia + BarcodeDetector or fallback.
    const t = setTimeout(async () => {
      if (status !== 'idle') return;
      setStatus('scanning');
      const mockCode = 'SYN-QR-DEMO-CODE-123';
      try {
        const result = await verifyCode(mockCode);
        setStatus(
          result.status === 'success'
            ? 'verified'
            : result.status === 'warning'
              ? 'warning'
              : 'error'
        );
        setResult(result);
        onResult?.(result);
      } catch (e) {
        setStatus('error');
        const fallback = { status: 'error', message: (e as Error).message } as VerificationResult;
        setResult(fallback);
        onResult?.(fallback);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [status, verifyCode, onResult]);

  const resetScan = () => {
    setStatus('idle');
    setResult(null);
  };

  const renderContent = () => {
    if (status === 'idle')
      return <span style={{ color: theme.colors.text }}>Waiting for camera… (demo)</span>;
    if (status === 'scanning') return <span style={{ color: theme.colors.accent }}>Scanning…</span>;
    if (status === 'verified' && result?.productDetails)
      return (
        <div style={{ color: theme.colors.success }}>
          <div>{theme.icons.success} Product Verified</div>
          <ul style={{ paddingLeft: 16, marginTop: 8 }}>
            <li>Name: {result.productDetails.name}</li>
            <li>Serial Number: {result.productDetails.serialNumber}</li>
            <li>Produced: {result.productDetails.manufacturedOn}</li>
            <li>Expiry: {result.productDetails.expiryDate}</li>
            <li>Batch: {result.productDetails.batchNumber}</li>
            <li>Raw Material Batch: {result.productDetails.rawMaterialBatchNumber}</li>
          </ul>
        </div>
      );
    if (status === 'warning')
      return (
        <div style={{ color: theme.colors.warning }}>
          <div>
            {theme.icons.warning} {result?.message || 'Potential counterfeit detected.'}
          </div>
        </div>
      );
    if (status === 'error')
      return (
        <div style={{ color: theme.colors.error }}>
          <div>
            {theme.icons.error} {result?.message || 'Verification Failed'}
          </div>
        </div>
      );
    return null;
  };
  return (
    <VerificationThemeProvider theme={themeOverride}>
      <div className={className} style={{ padding: 16, background: theme.colors.background }}>
        {renderContent()}
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            onClick={resetScan}
            style={{
              padding: '8px 12px',
              background: theme.colors.accent,
              color: '#FFF',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              opacity: status === 'scanning' ? 0.6 : 1,
            }}
            disabled={status === 'scanning'}
          >
            Scan Another Product
          </button>
        </div>
      </div>
    </VerificationThemeProvider>
  );
};
