import React, { useState, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { VerificationResult } from '../types';

// TODO: Import from core-sdk once proper package linking is set up
// For now, we'll need to implement basic verification inline

interface ProductScannerProps {
  onResult?: (result: VerificationResult) => void;
  onClose?: () => void;
  className?: string;
  apiBaseUrl: string;
  authToken?: string;
  enableCounterfeitCheck?: boolean;
}

export const ProductScanner: React.FC<ProductScannerProps> = ({
  onResult,
  onClose,
  className,
  apiBaseUrl,
  authToken,
  enableCounterfeitCheck = true,
}) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'error' | 'warning'>(
    'scanning'
  );
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const verifyCode = async (code: string): Promise<VerificationResult> => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ code, codeType: 'QR' }),
      });

      if (!response.ok) {
        return {
          status: 'error',
          message: 'Verification service unavailable',
        };
      }

      const data = await response.json();

      if (data.status === 'success' && data.product) {
        const counterfeitSuspected =
          enableCounterfeitCheck && (data.uniqueRetailersLastYear ?? 0) > 10;

        return {
          status: counterfeitSuspected ? 'warning' : 'success',
          message: counterfeitSuspected
            ? 'Product verified but has been scanned multiple times'
            : 'Product verified successfully',
          productDetails: {
            name: data.product.name ?? 'N/A',
            manufacturer: data.product.manufacturer ?? 'N/A',
            marketedBy: data.product.marketedBy ?? 'N/A',
            manufacturedOn: data.product.manufacturedOn ?? 'N/A',
            expiryDate: data.product.expiryDate ?? 'N/A',
            batchNumber: data.product.batchNumber ?? 'N/A',
          },
          code,
        };
      }

      return {
        status: 'error',
        message: data.message || 'Verification failed',
        errorCode: data.errorCode,
        code,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
        code,
      };
    }
  };

  const handleScan = useCallback(
    async (detectedCodes: any[]) => {
      if (isProcessing || !detectedCodes || detectedCodes.length === 0) return;

      const code = detectedCodes[0]?.rawValue;
      if (!code) return;

      setIsProcessing(true);
      setStatus('scanning');

      try {
        const verificationResult = await verifyCode(code);
        setStatus(
          verificationResult.status === 'success'
            ? 'verified'
            : verificationResult.status === 'warning'
              ? 'warning'
              : 'error'
        );
        setResult(verificationResult);
        onResult?.(verificationResult);
      } catch (e) {
        setStatus('error');
        const fallback: VerificationResult = {
          status: 'error',
          message: (e as Error).message,
          code,
        };
        setResult(fallback);
        onResult?.(fallback);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, apiBaseUrl, authToken, enableCounterfeitCheck, onResult]
  );

  const resetScan = () => {
    setStatus('scanning');
    setResult(null);
    setIsProcessing(false);
  };

  const renderContent = () => {
    if (status === 'scanning' && !result) {
      return (
        <div style={{ position: 'relative' }}>
          <Scanner
            onScan={handleScan}
            onError={(error) => console.error('Scanner error:', error)}
            styles={{
              container: { width: '100%', maxWidth: '500px' },
            }}
          />
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              color: '#007bff',
            }}
          >
            Point camera at QR code to scan
          </div>
        </div>
      );
    }
    if (status === 'verified' && result?.productDetails)
      return (
        <div style={{ color: '#28a745' }}>
          <div>✓ Product Verified</div>
          <ul style={{ paddingLeft: 16, marginTop: 8 }}>
            <li>Name: {result.productDetails.name}</li>
            <li>Manufacturer: {result.productDetails.manufacturer}</li>
            <li>Marketed By: {result.productDetails.marketedBy}</li>
            <li>Produced: {result.productDetails.manufacturedOn}</li>
            <li>Expiry: {result.productDetails.expiryDate}</li>
            <li>Batch: {result.productDetails.batchNumber}</li>
          </ul>
        </div>
      );
    if (status === 'warning')
      return (
        <div style={{ color: '#ffc107' }}>
          <div>⚠ {result?.message || 'Potential counterfeit detected.'}</div>
          {result?.productDetails && (
            <ul style={{ paddingLeft: 16, marginTop: 8 }}>
              <li>Name: {result.productDetails.name}</li>
              <li>Manufacturer: {result.productDetails.manufacturer}</li>
            </ul>
          )}
        </div>
      );
    if (status === 'error')
      return (
        <div style={{ color: '#dc3545' }}>
          <div>✗ {result?.message || 'Verification Failed'}</div>
          {result?.errorCode !== undefined && (
            <div style={{ fontSize: '0.9em', marginTop: 4 }}>Error Code: {result.errorCode}</div>
          )}
        </div>
      );
    return null;
  };

  return (
    <div
      className={className}
      style={{
        padding: 16,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {renderContent()}
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        {result && (
          <button
            type="button"
            onClick={resetScan}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: '#FFF',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Scan Another Product
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: '#FFF',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
