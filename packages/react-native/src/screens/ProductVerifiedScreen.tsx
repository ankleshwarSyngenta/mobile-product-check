import React from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';
import { styles } from './styles';

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

interface ProductVerifiedScreenProps {
  result: VerificationResult;
  onScanAnother: () => void;
  headerLabel?: string;
}

export const ProductVerifiedScreen: React.FC<ProductVerifiedScreenProps> = ({
  result,
  onScanAnother,
  headerLabel = 'Product Check',
}) => {
  const { productDetails } = result;

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
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Success Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.successBadge}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Product Verified</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Scanned product is authentic and registered with Syngenta
        </Text>

        {/* Product Details Card */}
        {productDetails && (
          <View style={styles.detailsCard}>
            {/* Header Row */}
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsHeaderText}>Parameter</Text>
              <Text style={styles.detailsHeaderText}>Value</Text>
            </View>

            {/* Detail Rows */}
            {productDetails.name && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Product name</Text>
                <Text style={styles.detailValue}>{productDetails.name}</Text>
              </View>
            )}

            {productDetails.serialNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Serial number</Text>
                <Text style={styles.detailValue}>{productDetails.serialNumber}</Text>
              </View>
            )}

            {productDetails.manufacturedOn && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Produced date</Text>
                <Text style={styles.detailValue}>{productDetails.manufacturedOn}</Text>
              </View>
            )}

            {productDetails.expiryDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expiry date</Text>
                <Text style={styles.detailValue}>{productDetails.expiryDate}</Text>
              </View>
            )}

            {productDetails.batchNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Batch number</Text>
                <Text style={styles.detailValue}>{productDetails.batchNumber}</Text>
              </View>
            )}

            {productDetails.rawMaterialBatchNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Raw material batch number</Text>
                <Text style={styles.detailValue}>
                  {productDetails.rawMaterialBatchNumber || 'NA'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.scanButton} onPress={onScanAnother}>
          <Text style={styles.scanButtonText}>Scan another product</Text>
        </Pressable>
      </View>
    </View>
  );
};
