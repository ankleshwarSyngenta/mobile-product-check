/**
 * Product Check Example App
 * Demonstrates the use of @syngenta/product-check-react-native
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProductScanFlow } from '@syngenta/product-check';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const handleVerifyCode = async (code: string) => {
    console.log('Scanned code:', code);

    // Simulate API verification
    // In a real app, you would call your backend API here
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response - replace with actual API call
    if (code.startsWith('SYN')) {
      return {
        status: 'success' as const,
        message: 'Product verified successfully',
        productDetails: {
          name: 'Syngenta Product',
          manufacturer: 'Syngenta',
          marketedBy: 'Syngenta India Ltd.',
          manufacturedOn: '2024-01-15',
          expiryDate: '2026-01-15',
          batchNumber: 'BATCH123',
          serialNumber: code,
          trackingId: 'TRK' + code,
        },
      };
    } else {
      return {
        status: 'warning' as const,
        message: 'This is not a Syngenta product',
        code,
      };
    }
  };

  const handleClose = () => {
    Alert.alert('Close', 'Scanner closed');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <ProductScanFlow
          onVerifyCode={handleVerifyCode}
          onClose={handleClose}
          headerLabel="Product Check"
          scanCodeLabel="Scan Code"
          enterCodeLabel="Enter Code"
          supportPhone="+84-77450-77450"
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
