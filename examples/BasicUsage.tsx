import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { ProductScanner } from '@syngenta/mobile-product-check';

function App() {
  const config = {
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key-here',
    locale: 'en',
    counterfeitThreshold: 10,
    counterfeitCheckPeriodDays: 365,
    onSuccess: (data) => {
      console.log('✅ Product verified successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Verification failed:', error);
    },
    onCounterfeitWarning: (data, scanCount) => {
      console.warn(`⚠️ Potential counterfeit! Product scanned ${scanCount} times`);
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ProductScanner config={config} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
