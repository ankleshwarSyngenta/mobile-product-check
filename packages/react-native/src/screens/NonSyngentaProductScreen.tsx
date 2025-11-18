import React from 'react';
import { View, Pressable, Linking, Text } from 'react-native';
import { styles } from './styles';

interface VerificationResult {
  status: 'success' | 'error' | 'warning';
  message: string;
}

interface NonSyngentaProductScreenProps {
  result?: VerificationResult;
  onScanAnother: () => void;
  headerLabel?: string;
  supportPhone?: string;
}

export const NonSyngentaProductScreen: React.FC<NonSyngentaProductScreenProps> = ({
  onScanAnother,
  headerLabel = 'Product Check',
  supportPhone = '+84-77450-77450',
}) => {
  const handleCallSupport = () => {
    const phoneUrl = `tel:${supportPhone.replace(/[^0-9+]/g, '')}`;
    Linking.openURL(phoneUrl);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onScanAnother}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.headerText}>
          {headerLabel}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.centerContent}>
          {/* Warning Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
          </View>

          {/* Title */}
          <Text style={styles.warningTitle}>Non-syngenta Product</Text>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Syngenta is always happy to assist you. Please contact service desk at{' '}
              <Text style={styles.linkText} onPress={handleCallSupport}>
                {supportPhone}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.scanButton} onPress={onScanAnother}>
          <Text style={styles.scanButtonText}>Scan another product</Text>
        </Pressable>
      </View>
    </View>
  );
};
