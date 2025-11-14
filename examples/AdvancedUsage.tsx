import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { ProductScanner, ProductDetails } from '@syngenta/mobile-product-check';

interface ScanHistoryItem extends ProductDetails {
  timestamp: Date;
  id: string;
}

function App() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: '中文' },
  ];

  const config = {
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key-here',
    locale: selectedLanguage,
    onSuccess: (data) => {
      // Add to history
      const historyItem: ScanHistoryItem = {
        ...data,
        timestamp: new Date(),
        id: Date.now().toString(),
      };
      setScanHistory([historyItem, ...scanHistory]);
      setShowScanner(false);
    },
    onError: (error) => {
      console.error('Verification failed:', error);
      setShowScanner(false);
    },
  };

  const renderHistoryItem = ({ item }: { item: ScanHistoryItem }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyProductName}>{item.productName}</Text>
      <Text style={styles.historyDetail}>Serial: {item.serialNumber}</Text>
      <Text style={styles.historyDetail}>Batch: {item.batchNumber}</Text>
      <Text style={styles.historyTimestamp}>
        {item.timestamp.toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!showScanner ? (
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Product Verification</Text>

          {/* Language Selector */}
          <View style={styles.languageContainer}>
            <Text style={styles.sectionTitle}>Language:</Text>
            <View style={styles.languageButtons}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    selectedLanguage === lang.code && styles.languageButtonActive,
                  ]}
                  onPress={() => setSelectedLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      selectedLanguage === lang.code &&
                        styles.languageButtonTextActive,
                    ]}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Scan Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}
          >
            <Text style={styles.scanButtonText}>📷 Scan New Product</Text>
          </TouchableOpacity>

          {/* Scan History */}
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>
              Scan History ({scanHistory.length})
            </Text>
            {scanHistory.length === 0 ? (
              <Text style={styles.emptyText}>No scans yet</Text>
            ) : (
              <FlatList
                data={scanHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.id}
                style={styles.historyList}
              />
            )}
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
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  languageContainer: {
    marginBottom: 24,
  },
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  languageButtonText: {
    color: '#2c3e50',
    fontSize: 14,
  },
  languageButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  historyProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  historyDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: 16,
    marginTop: 20,
  },
});

export default App;
