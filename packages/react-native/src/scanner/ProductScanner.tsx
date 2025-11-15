import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BackendClient,
  useProductVerification,
  VerificationThemeProvider,
  useVerificationTheme,
  VerificationResult,
} from '@syngenta/product-verification-core-sdk';

interface ProductScannerProps {
  onResult?: (result: VerificationResult) => void;
  locale?: string;
  style?: Record<string, unknown>;
  enableCounterfeitCheck?: boolean;
  themeOverride?: Parameters<typeof VerificationThemeProvider>[0]['theme'];
  apiBaseUrl: string;
  authToken?: string;
}

export const ProductScanner: React.FC<ProductScannerProps> = ({
  onResult,
  style,
  enableCounterfeitCheck = true,
  themeOverride,
  apiBaseUrl,
  authToken,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
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
    (async () => {
      // We do not import camera APIs directly to keep minimal; user ensures permissions outside or via vision-camera API.
      try {
        // Placeholder: In real implementation request camera permission using vision-camera.
        setHasPermission(true);
      } catch (e) {
        setHasPermission(false);
      }
    })();
  }, []);

  const onMockFrame = useCallback(async () => {
    if (status === 'scanning') return;
    setStatus('scanning');
    // Placeholder: In real implementation decode frame to code string
    const mockCode = 'SYN-QR-DEMO-CODE-123';
    try {
      const result = await verifyCode(mockCode);
      setStatus(
        result.status === 'success' ? 'verified' : result.status === 'warning' ? 'warning' : 'error'
      );
      setResult(result);
      onResult?.(result);
    } catch (e) {
      setStatus('error');
      const fallback = { status: 'error', message: (e as Error).message } as VerificationResult;
      setResult(fallback);
      onResult?.(fallback);
    }
  }, [status, verifyCode, onResult]);

  useEffect(() => {
    if (hasPermission) {
      // Simulate a scan after mount for demo.
      const timer = setTimeout(onMockFrame, 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [hasPermission, onMockFrame]);

  const resetScan = () => {
    setStatus('idle');
    setResult(null);
  };

  const renderContent = () => {
    if (hasPermission === false)
      return <Text style={{ color: theme.colors.error }}>No camera permission</Text>;
    if (status === 'idle')
      return <Text style={{ color: theme.colors.text }}>Waiting for camera…</Text>;
    if (status === 'scanning') return <Text style={{ color: theme.colors.accent }}>Scanning…</Text>;
    if (status === 'verified' && result?.productDetails) {
      return (
        <View>
          <Text style={{ color: theme.colors.success }}>
            {theme.icons.success} Product Verified
          </Text>
          <View style={{ marginTop: 8 }}>
            <Text>Name: {result.productDetails.name}</Text>
            <Text>Serial: {result.productDetails.serialNumber}</Text>
            <Text>Produced: {result.productDetails.manufacturedOn}</Text>
            <Text>Expiry: {result.productDetails.expiryDate}</Text>
            <Text>Batch: {result.productDetails.batchNumber}</Text>
            <Text>Raw Material Batch: {result.productDetails.rawMaterialBatchNumber}</Text>
          </View>
        </View>
      );
    }
    if (status === 'warning') {
      return (
        <Text style={{ color: theme.colors.warning }}>
          {theme.icons.warning} {result?.message || 'Potential counterfeit detected.'}
        </Text>
      );
    }
    if (status === 'error')
      return (
        <Text style={{ color: theme.colors.error }}>
          {theme.icons.error} {result?.message || 'Verification Failed'}
        </Text>
      );
    return null;
  };

  return (
    <VerificationThemeProvider theme={themeOverride}>
      <View style={[styles.center, style, { backgroundColor: theme.colors.background }]}>
        {renderContent()}
        <View style={{ marginTop: 12 }}>
          <Text
            onPress={resetScan}
            style={{
              padding: 8,
              backgroundColor: theme.colors.accent,
              color: '#FFF',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            Scan Another Product
          </Text>
        </View>
      </View>
    </VerificationThemeProvider>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 16, width: '100%' },
});
