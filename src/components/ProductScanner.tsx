import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { ScannerConfig, VerificationStatus, ProductDetails, ApiError } from '../types';
import { ProductVerificationService } from '../services/ProductVerificationService';
import { useLocalization } from '../hooks/useLocalization';

interface ProductScannerProps {
  config: ScannerConfig;
  onClose?: () => void;
}

export const ProductScanner: React.FC<ProductScannerProps> = ({ config, onClose }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: VerificationStatus;
    data?: ProductDetails;
    error?: ApiError;
    scanCount?: number;
  } | null>(null);
  
  const device = useCameraDevice('back');
  const { t } = useLocalization(config.locale);
  const verificationService = new ProductVerificationService(config);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === 'granted');
  };

  const handleScanAgain = useCallback(() => {
    setVerificationResult(null);
    setIsScanning(false);
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'data-matrix'],
    onCodeScanned: async (codes) => {
      if (isScanning || !codes.length) return;
      
      setIsScanning(true);
      const code = codes[0];
      
      try {
        const result = await verificationService.verifyProduct(code.value || '');
        setVerificationResult(result);

        // Call appropriate callbacks
        if (result.status === VerificationStatus.SUCCESS && result.data) {
          if (result.isCounterfeitWarning && config.onCounterfeitWarning) {
            config.onCounterfeitWarning(result.data, result.scanCount || 0);
          } else if (config.onSuccess) {
            config.onSuccess(result.data);
          }
        } else if (result.error && config.onError) {
          config.onError(result.error);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setIsScanning(false);
      }
    },
  });

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('cameraAccessDenied')}</Text>
        {onClose && (
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{t('close')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('cameraNotAvailable')}</Text>
        {onClose && (
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{t('close')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (verificationResult) {
    return (
      <View style={styles.container}>
        {verificationResult.status === VerificationStatus.SUCCESS && verificationResult.data && (
          <SuccessScreen
            data={verificationResult.data}
            isCounterfeitWarning={verificationResult.isCounterfeitWarning}
            scanCount={verificationResult.scanCount}
            onScanAgain={handleScanAgain}
            onClose={onClose}
            t={t}
          />
        )}
        {verificationResult.status === VerificationStatus.NON_SYNGENTA && (
          <ErrorScreen
            error={verificationResult.error}
            onScanAgain={handleScanAgain}
            onClose={onClose}
            t={t}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isScanning}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.scanText}>
          {isScanning ? t('scanningInProgress') : t('scanPrompt')}
        </Text>
        {isScanning && <ActivityIndicator size="large" color="#ffffff" />}
      </View>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface SuccessScreenProps {
  data: ProductDetails;
  isCounterfeitWarning?: boolean;
  scanCount?: number;
  onScanAgain: () => void;
  onClose?: () => void;
  t: (key: string) => string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  data,
  isCounterfeitWarning,
  scanCount,
  onScanAgain,
  onClose,
  t,
}) => {
  return (
    <View style={styles.resultContainer}>
      {isCounterfeitWarning && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            {t('counterfeitWarningMessage')} {scanCount} {t('scanningInProgress')}
          </Text>
        </View>
      )}
      
      <View style={styles.successHeader}>
        <Text style={styles.checkMark}>✅</Text>
        <Text style={styles.successTitle}>{t('productAuthentic')}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <DetailRow label={t('productName')} value={data.productName || t('notAvailable')} />
        <DetailRow label={t('serialNumber')} value={data.serialNumber || t('notAvailable')} />
        <DetailRow label={t('producedDate')} value={data.producedDate || t('notAvailable')} />
        <DetailRow label={t('expiryDate')} value={data.expiryDate || t('notAvailable')} />
        <DetailRow label={t('batchNumber')} value={data.batchNumber || t('notAvailable')} />
        <DetailRow
          label={t('rawMaterialBatchNumber')}
          value={data.rawMaterialBatchNumber || t('notAvailable')}
        />
        {data.manufacturer && (
          <DetailRow label={t('manufacturer')} value={data.manufacturer} />
        )}
        {data.marketedBy && <DetailRow label={t('marketedBy')} value={data.marketedBy} />}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onScanAgain}>
          <Text style={styles.primaryButtonText}>{t('scanAnother')}</Text>
        </TouchableOpacity>
        {onClose && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>{t('close')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface ErrorScreenProps {
  error?: ApiError;
  onScanAgain: () => void;
  onClose?: () => void;
  t: (key: string) => string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onScanAgain, onClose, t }) => {
  return (
    <View style={styles.resultContainer}>
      <View style={styles.errorHeader}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>{t('nonSyngentaProduct')}</Text>
      </View>

      {error && (
        <View style={styles.errorDetails}>
          <Text style={styles.errorMessage}>{error.message}</Text>
          {error.details && <Text style={styles.errorDetailText}>{error.details}</Text>}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onScanAgain}>
          <Text style={styles.primaryButtonText}>{t('scanAnother')}</Text>
        </TouchableOpacity>
        {onClose && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>{t('close')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkMark: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
  },
  errorHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
    textAlign: 'right',
  },
  errorDetails: {
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  errorMessage: {
    fontSize: 16,
    color: '#721c24',
    fontWeight: '600',
    marginBottom: 8,
  },
  errorDetailText: {
    fontSize: 14,
    color: '#721c24',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
