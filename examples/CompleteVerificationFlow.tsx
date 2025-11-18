/**
 * Complete Example: Product Verification with Camera and Result Screens
 *
 * This example demonstrates how to integrate the camera component with
 * all three result screens to create a complete product verification flow.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ProductScanFlow } from '@syngenta/product-verification-react-native';
import { BackendClient, useProductVerification } from '@syngenta/product-verification-core-sdk';

interface AppConfig {
  apiBaseUrl: string;
  authToken?: string;
  supportPhone?: string;
}

const config: AppConfig = {
  apiBaseUrl: 'https://api.syngenta.com/product-verification',
  authToken: 'your-api-token-here',
  supportPhone: '+84-77450-77450',
};

export const ProductVerificationApp: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);

  // Initialize backend client
  const client = new BackendClient({
    baseUrl: config.apiBaseUrl,
    authToken: config.authToken,
  });

  // Use the verification hook
  const { verifyCode } = useProductVerification({
    client,
    counterfeitThreshold: 10,
  });

  const handleVerifyCode = async (code: string) => {
    try {
      console.log('Verifying code:', code);
      const result = await verifyCode(code);
      return result;
    } catch (error) {
      console.error('Verification error:', error);
      return {
        status: 'error' as const,
        message: 'Failed to verify product. Please try again.',
      };
    }
  };

  const handleClose = () => {
    setIsScanning(false);
    Alert.alert('Scanner Closed', 'Product verification cancelled');
  };

  const handleStartScan = () => {
    setIsScanning(true);
  };

  if (!isScanning) {
    return (
      <View style={styles.container}>
        {/* Your home screen content */}
        <View style={styles.buttonContainer}>
          <Button title="Scan Product" onPress={handleStartScan} />
        </View>
      </View>
    );
  }

  return (
    <ProductScanFlow
      onClose={handleClose}
      onVerifyCode={handleVerifyCode}
      headerLabel="Product Check"
      scanCodeLabel="Scan code"
      enterCodeLabel="Enter code"
      supportPhone={config.supportPhone}
    />
  );
};

// Alternative: Using individual screens with custom logic
export const CustomProductVerificationFlow: React.FC = () => {
  const [screen, setScreen] = useState<'camera' | 'result'>('camera');
  const [result, setResult] = useState<any>(null);

  const client = new BackendClient({
    baseUrl: config.apiBaseUrl,
    authToken: config.authToken,
  });

  const { verifyCode } = useProductVerification({ client });

  const handleScanComplete = async (codes: any[]) => {
    if (codes.length === 0) return;

    const code = codes[0].value;
    const verificationResult = await verifyCode(code);

    setResult(verificationResult);
    setScreen('result');

    // Optional: Log analytics
    console.log('Product scanned:', {
      code,
      status: verificationResult.status,
      timestamp: new Date().toISOString(),
    });
  };

  const handleScanAnother = () => {
    setScreen('camera');
    setResult(null);
  };

  return (
    <View style={styles.fullScreen}>
      {screen === 'camera' && (
        <CameraUI
          headerLabel="Scan Product"
          scanCodeLabel="Scan barcode"
          enterCodeLabel="Enter manually"
          handleOnScanResult={handleScanComplete}
          isCameraReady={true}
          isFocused={true}
          testID="product-camera"
        />
      )}

      {screen === 'result' && result && (
        <>
          {result.status === 'success' && (
            <ProductVerifiedScreen
              result={result}
              onScanAnother={handleScanAnother}
              headerLabel="Verification Result"
            />
          )}

          {result.status === 'warning' && (
            <NonSyngentaProductScreen
              onScanAnother={handleScanAnother}
              headerLabel="Verification Result"
              supportPhone={config.supportPhone}
            />
          )}

          {result.status === 'error' && (
            <VerificationRequiredScreen
              onScanAnother={handleScanAnother}
              headerLabel="Verification Result"
              supportPhone={config.supportPhone}
            />
          )}
        </>
      )}
    </View>
  );
};

// Example with navigation (React Navigation)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const NavigationExample: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.center}>
      <Button title="Verify Product" onPress={() => navigation.navigate('Scanner')} />
    </View>
  );
};

const ScannerScreen = ({ navigation }: any) => {
  const client = new BackendClient({
    baseUrl: config.apiBaseUrl,
    authToken: config.authToken,
  });

  const { verifyCode } = useProductVerification({ client });

  const handleVerifyCode = async (code: string) => {
    const result = await verifyCode(code);
    navigation.navigate('Result', { result });
    return result;
  };

  return <ProductScanFlow onClose={() => navigation.goBack()} onVerifyCode={handleVerifyCode} />;
};

const ResultScreen = ({ route, navigation }: any) => {
  const { result } = route.params;

  const handleScanAnother = () => {
    navigation.navigate('Scanner');
  };

  if (result.status === 'success') {
    return <ProductVerifiedScreen result={result} onScanAnother={handleScanAnother} />;
  }

  if (result.status === 'warning') {
    return <NonSyngentaProductScreen onScanAnother={handleScanAnother} />;
  }

  return <VerificationRequiredScreen onScanAnother={handleScanAnother} />;
};

// Button component for example
const Button = ({ title, onPress }: { title: string; onPress: () => void }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreen: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00A3E0',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
