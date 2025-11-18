import React from 'react';
import { View, Pressable, Linking, Text } from 'react-native';
import { styles } from './styles';

interface VerificationResult {
  status: 'success' | 'error' | 'warning';
  message: string;
}

interface VerificationRequiredScreenProps {
  result?: VerificationResult;
  onScanAnother: () => void;
  headerLabel?: string;
  supportPhone?: string;
}

export const VerificationRequiredScreen: React.FC<VerificationRequiredScreenProps> = ({
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
          {/* Error Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.errorIcon}>✕</Text>
          </View>

          {/* Title */}
          <Text style={styles.errorTitle}>Verification Required</Text>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              It looks like we need to verify this product further. Please call our support team at{' '}
              <Text style={styles.linkText} onPress={handleCallSupport}>
                {supportPhone}
              </Text>{' '}
              for assistance.
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
