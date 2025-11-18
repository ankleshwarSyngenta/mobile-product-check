import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraUI } from '../camera';
import { ProductVerifiedScreen } from './ProductVerifiedScreen';
import { NonSyngentaProductScreen } from './NonSyngentaProductScreen';
import { VerificationRequiredScreen } from './VerificationRequiredScreen';
import type { Code } from 'react-native-vision-camera';

interface VerificationResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  productDetails?: {
    name: string;
    manufacturer?: string;
    marketedBy?: string;
    manufacturedOn: string;
    expiryDate: string;
    batchNumber: string;
    serialNumber?: string;
    rawMaterialBatchNumber?: string;
    trackingId?: string;
  };
  code?: string;
  errorCode?: number;
}

interface ProductScanFlowProps {
  onClose?: () => void;
  onVerifyCode: (code: string) => Promise<VerificationResult>;
  headerLabel?: string;
  scanCodeLabel?: string;
  enterCodeLabel?: string;
  supportPhone?: string;
}

type ScreenState = 'camera' | 'verified' | 'non-syngenta' | 'verification-required';

export const ProductScanFlow: React.FC<ProductScanFlowProps> = ({
  onClose,
  onVerifyCode,
  headerLabel = 'Product Check',
  scanCodeLabel = 'Scan code',
  enterCodeLabel = 'Enter code',
  supportPhone = '+84-77450-77450',
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('camera');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  const handleScanResult = useCallback(
    async (codes: Code[]) => {
      if (codes.length === 0) return;

      const scannedCode = codes[0].value;
      if (!scannedCode) return;

      try {
        const result = await onVerifyCode(scannedCode);
        setVerificationResult(result);

        // Determine which screen to show based on the result
        if (result.status === 'success') {
          setCurrentScreen('verified');
        } else if (result.status === 'warning') {
          setCurrentScreen('non-syngenta');
        } else {
          setCurrentScreen('verification-required');
        }
      } catch (error) {
        // Handle error - show verification required screen
        setVerificationResult({
          status: 'error',
          message: 'Failed to verify product',
        });
        setCurrentScreen('verification-required');
      }
    },
    [onVerifyCode]
  );

  const handleScanAnother = useCallback(() => {
    setCurrentScreen('camera');
    setVerificationResult(null);
    setIsFocused(true);
  }, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleBottomViewClick = useCallback((type: string) => {
    // Handle scan type change (scan code vs enter code manually)
    console.log('Scan type changed:', type);
  }, []);

  return (
    <View style={styles.container}>
      {currentScreen === 'camera' && (
        <CameraUI
          headerLabel={headerLabel}
          scanCodeLabel={scanCodeLabel}
          enterCodeLabel={enterCodeLabel}
          isCameraReady={true}
          isFocused={isFocused}
          handleOnCloseClick={handleClose}
          handleOnBottomViewClick={handleBottomViewClick}
          handleOnScanResult={handleScanResult}
          testID="product-scan-camera"
        />
      )}

      {currentScreen === 'verified' && verificationResult && (
        <ProductVerifiedScreen
          result={verificationResult}
          onScanAnother={handleScanAnother}
          headerLabel={headerLabel}
        />
      )}

      {currentScreen === 'non-syngenta' && verificationResult && (
        <NonSyngentaProductScreen
          onScanAnother={handleScanAnother}
          headerLabel={headerLabel}
          supportPhone={supportPhone}
        />
      )}

      {currentScreen === 'verification-required' && verificationResult && (
        <VerificationRequiredScreen
          onScanAnother={handleScanAnother}
          headerLabel={headerLabel}
          supportPhone={supportPhone}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
