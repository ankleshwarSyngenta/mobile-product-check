import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  ProductVerificationService,
  CodeDecoder,
  ProductDetails,
  VerificationStatus,
} from '@syngenta/mobile-product-check';

function ProgrammaticVerificationExample() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<ProductDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const service = new ProductVerificationService({
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key-here',
  });

  const verifyProductByCode = async (qrCodeText: string) => {
    setIsVerifying(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Decode and validate
      const decoded = CodeDecoder.decode(qrCodeText);
      
      if (!decoded.isValid) {
        setError('Invalid or non-Syngenta QR code');
        return;
      }

      console.log('Decoded:', decoded);

      // Step 2: Verify product
      const verification = await service.verifyProduct(qrCodeText);

      if (verification.status === VerificationStatus.SUCCESS && verification.data) {
        setResult(verification.data);
        
        if (verification.isCounterfeitWarning) {
          console.warn(
            `⚠️ Counterfeit warning! Scanned ${verification.scanCount} times`
          );
        }
      } else if (verification.error) {
        setError(verification.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Example: Verify a sample QR code on mount
  useEffect(() => {
    const sampleQRCode = 'https://attx.syngenta.com/product?id=SAMPLE123';
    // verifyProductByCode(sampleQRCode);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Programmatic Verification</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            verifyProductByCode('https://attx.syngenta.com/product?id=TEST123')
          }
          disabled={isVerifying}
        >
          <Text style={styles.buttonText}>
            {isVerifying ? 'Verifying...' : 'Verify Sample Product'}
          </Text>
        </TouchableOpacity>

        {isVerifying && <ActivityIndicator size="large" color="#007bff" />}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>✅ Verified Product</Text>
            <Text style={styles.resultText}>Name: {result.productName}</Text>
            <Text style={styles.resultText}>Serial: {result.serialNumber}</Text>
            <Text style={styles.resultText}>Batch: {result.batchNumber}</Text>
            <Text style={styles.resultText}>
              Produced: {result.producedDate}
            </Text>
            <Text style={styles.resultText}>Expires: {result.expiryDate}</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>❌ Verification Failed</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.codeExamples}>
          <Text style={styles.examplesTitle}>Code Decoder Examples:</Text>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => {
              const decoded = CodeDecoder.decode(
                'https://attx.syngenta.com/product?id=ABC123'
              );
              console.log('Decoded URL:', decoded);
            }}
          >
            <Text style={styles.exampleButtonText}>Decode URL Format</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => {
              const validation = CodeDecoder.validateCode('INVALID_CODE');
              console.log('Validation:', validation);
            }}
          >
            <Text style={styles.exampleButtonText}>Validate Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#155724',
    marginBottom: 8,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#721c24',
  },
  codeExamples: {
    marginTop: 32,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  exampleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  exampleButtonText: {
    fontSize: 14,
    color: '#007bff',
  },
});

export default ProgrammaticVerificationExample;
