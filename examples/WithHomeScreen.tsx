import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ProductScanner } from '@syngenta/mobile-product-check';

function App() {
  const [showScanner, setShowScanner] = useState(false);

  const config = {
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key-here',
    locale: 'en',
    onSuccess: (data) => {
      setShowScanner(false);
      Alert.alert(
        '✅ Product Verified',
        `Product: ${data.productName}\nSerial: ${data.serialNumber}`,
        [{ text: 'OK' }]
      );
    },
    onError: (error) => {
      setShowScanner(false);
      Alert.alert('❌ Verification Failed', error.message, [{ text: 'OK' }]);
    },
    onCounterfeitWarning: (data, scanCount) => {
      Alert.alert(
        '⚠️ Warning',
        `This product has been scanned ${scanCount} times. Please verify with Syngenta.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Contact Syngenta',
            onPress: () => {
              // Handle contact action
            },
          },
        ]
      );
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      {!showScanner ? (
        <View style={styles.homeContainer}>
          <Text style={styles.title}>Syngenta Product Check</Text>
          <Text style={styles.subtitle}>
            Verify product authenticity by scanning the QR code
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}
          >
            <Text style={styles.scanButtonText}>📷 Scan Product</Text>
          </TouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <Text style={styles.infoText}>1. Tap "Scan Product"</Text>
            <Text style={styles.infoText}>
              2. Point camera at product QR code
            </Text>
            <Text style={styles.infoText}>3. View product verification results</Text>
          </View>
        </View>
      ) : (
        <ProductScanner config={config} onClose={() => setShowScanner(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  homeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },
  scanButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 60,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 12,
  },
});

export default App;
