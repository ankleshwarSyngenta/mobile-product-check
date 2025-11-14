# @syngenta/mobile-product-check

A comprehensive React Native module for scanning and verifying Syngenta products using 2D matrix codes (QR codes) with camera integration via react-native-vision-camera.

## Features

✅ **Camera Integration** - Uses react-native-vision-camera for efficient QR code scanning  
✅ **Product Verification** - Securely communicates with Syngenta's backend services  
✅ **Multi-Language Support** - Built-in i18n support (English, Spanish, Portuguese, French, German, Chinese)  
✅ **Counterfeit Detection** - Warns users when products are scanned suspiciously frequently  
✅ **Comprehensive Error Handling** - Handles all 13 error codes from Standard Scan API  
✅ **TypeScript** - Fully typed for better developer experience  
✅ **Customizable** - Flexible configuration and callbacks

## Installation

```bash
npm install @syngenta/mobile-product-check
# or
yarn add @syngenta/mobile-product-check
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-native react-native-vision-camera
# or
yarn add react react-native react-native-vision-camera
```

### Additional Setup for react-native-vision-camera

#### iOS

Add the following to your `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan product QR codes</string>
```

Run:
```bash
cd ios && pod install
```

#### Android

Add to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

Add to your `android/build.gradle`:

```gradle
buildscript {
    ext {
        minSdkVersion = 21
    }
}
```

For detailed setup instructions, see [react-native-vision-camera documentation](https://react-native-vision-camera.com/docs/guides).

## Quick Start

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { ProductScanner } from '@syngenta/mobile-product-check';

function App() {
  const [showScanner, setShowScanner] = useState(false);

  const config = {
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key',
    locale: 'en',
    onSuccess: (data) => {
      console.log('Product verified:', data);
    },
    onError: (error) => {
      console.error('Verification failed:', error);
    },
    onCounterfeitWarning: (data, scanCount) => {
      console.warn(`Potential counterfeit! Scanned ${scanCount} times`);
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Scan Product" onPress={() => setShowScanner(true)} />
      
      {showScanner && (
        <ProductScanner 
          config={config} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </View>
  );
}

export default App;
```

## Configuration

### ScannerConfig

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `apiBaseUrl` | string | Yes | - | Base URL for Syngenta's backend API |
| `apiKey` | string | No | - | API key for authentication |
| `locale` | string | No | 'en' | Language code (en, es, pt, fr, de, zh) |
| `counterfeitThreshold` | number | No | 10 | Number of scans before counterfeit warning |
| `counterfeitCheckPeriodDays` | number | No | 365 | Period in days for counterfeit check |
| `onSuccess` | function | No | - | Callback when product is verified successfully |
| `onError` | function | No | - | Callback when verification fails |
| `onCounterfeitWarning` | function | No | - | Callback when counterfeit warning triggers |

## API Reference

### Components

#### ProductScanner

Main component for scanning and verifying products.

```tsx
<ProductScanner 
  config={scannerConfig} 
  onClose={() => {}} 
/>
```

**Props:**
- `config: ScannerConfig` - Configuration object (required)
- `onClose?: () => void` - Callback when scanner is closed (optional)

### Services

#### ProductVerificationService

Service for programmatic product verification.

```tsx
import { ProductVerificationService } from '@syngenta/mobile-product-check';

const service = new ProductVerificationService(config);
const result = await service.verifyProduct(scannedCode);
```

**Methods:**
- `verifyProduct(scannedCode: string): Promise<VerificationResponse>`
- `recordScan(trackingId: string, userId?: string): Promise<void>`
- `getScanCount(trackingId: string): Promise<number>`

### Utilities

#### CodeDecoder

Utility for decoding and validating QR codes.

```tsx
import { CodeDecoder } from '@syngenta/mobile-product-check';

const decoded = CodeDecoder.decode(codeText);
const validation = CodeDecoder.validateCode(codeText);
```

**Methods:**
- `decode(codeText: string): DecodedResult`
- `validateCode(code: string): { isValid: boolean; error?: string }`
- `isSyngentaCode(code: string): boolean`
- `extractTrackingId(code: string): string | undefined`

### Hooks

#### useLocalization

Hook for managing localization.

```tsx
import { useLocalization } from '@syngenta/mobile-product-check';

const { t, currentLocale, changeLanguage } = useLocalization('en');
```

## Verification Scenarios

### Scenario 1: Successful Verification

When a valid Syngenta product is scanned, the user sees:

- ✅ Check mark
- Message: "This product is authentic and registered with Syngenta."
- Product details:
  - Product Name
  - Serial Number
  - Produced Date
  - Expiry Date
  - Batch Number
  - Raw Material Batch Number
  - Manufacturer (if available)
  - Marketed By (if available)

Fields with no data are displayed as "NA".

### Scenario 2: Non-Syngenta Product

When an invalid product or non-Syngenta QR code is scanned:

- ❌ Error icon
- Message: "Non Syngenta product"
- Error details based on error code (0-12)

**Error Codes:**

| Code | Message |
|------|---------|
| 0 | Tracking id is not available. |
| 1 | Code scanned multiple times. Contact Syngenta. |
| 2 | Tracking id is not available. |
| 3 | Tracking ID is not active. |
| 4 | Invalid mandatory input values. |
| 5 | Missing mandatory input values. |
| 6 | Invalid Tracking ID. |
| 7 | Tracking ID is blacklisted. |
| 8 | Authentication for code has failed. |
| 9 | ID is a Turkey product with valid format. |
| 10 | GTIN does not exist. |
| 11 | SN does not exist. |
| 12 | Tracking ID is stolen. |

### Scenario 3: Counterfeit Warning

When a product has been scanned by 10+ unique users within 1 year:

- ⚠️ Warning banner
- Success screen with product details
- Warning message: "This product has been scanned multiple times. Please verify with Syngenta if you have concerns about authenticity."

## Localization

The module supports multiple languages out of the box:

- English (en)
- Spanish (es)
- Portuguese (pt)
- French (fr)
- German (de)
- Chinese (zh)

### Adding Custom Translations

```tsx
import i18n from '@syngenta/mobile-product-check';

i18n.addResourceBundle('it', 'translation', {
  scanPrompt: 'Puntare la fotocamera sul codice QR del prodotto per scansionare',
  // ... other translations
});
```

## Advanced Usage

### Custom Styling

The component uses React Native StyleSheet. You can't directly override styles, but you can wrap the component and apply custom container styles.

### Programmatic Verification

```tsx
import { ProductVerificationService, CodeDecoder } from '@syngenta/mobile-product-check';

const service = new ProductVerificationService({
  apiBaseUrl: 'https://api.syngenta.com',
  apiKey: 'your-api-key',
});

// Decode QR code
const decoded = CodeDecoder.decode(scannedQRCode);

if (decoded.isValid) {
  // Verify product
  const result = await service.verifyProduct(scannedQRCode);
  
  if (result.status === 'SUCCESS') {
    console.log('Product:', result.data);
  }
}
```

### Handling Counterfeit Detection

```tsx
const config = {
  apiBaseUrl: 'https://api.syngenta.com',
  counterfeitThreshold: 15, // Custom threshold
  counterfeitCheckPeriodDays: 180, // 6 months instead of 1 year
  onCounterfeitWarning: (data, scanCount) => {
    // Custom handling
    Alert.alert(
      'Warning',
      `This product has been scanned ${scanCount} times. Please contact Syngenta.`
    );
  },
};
```

## TypeScript Support

This module is written in TypeScript and includes type definitions.

```tsx
import {
  ProductDetails,
  VerificationStatus,
  VerificationResponse,
  ScannerConfig,
  ErrorCode,
} from '@syngenta/mobile-product-check';
```

## Backend API Requirements

Your backend should implement the following endpoints:

### POST /scan

Request:
```json
{
  "trackingId": "string",
  "url": "string",
  "timestamp": "ISO8601",
  "locale": "string"
}
```

Response (Success):
```json
{
  "product": {
    "productName": "string",
    "serialNumber": "string",
    "producedDate": "string",
    "expiryDate": "string",
    "batchNumber": "string",
    "rawMaterialBatchNumber": "string",
    "manufacturer": "string",
    "marketedBy": "string"
  }
}
```

Response (Error):
```json
{
  "errorCode": 0-12,
  "message": "string",
  "details": "string"
}
```

### POST /record-scan (Optional)

For counterfeit detection tracking.

### GET /scan-count (Optional)

For retrieving scan count for counterfeit detection.

## Troubleshooting

### Camera Permission Issues

**iOS:**
- Ensure `NSCameraUsageDescription` is in Info.plist
- Check device settings for app camera permission

**Android:**
- Ensure `CAMERA` permission is in AndroidManifest.xml
- Check device settings for app camera permission

### QR Code Not Scanning

- Ensure good lighting conditions
- Hold device steady
- Try different distances from the QR code
- Verify QR code is a valid Syngenta code

### Build Issues

If you encounter build issues:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/syngenta/mobile-product-check/issues
- Email: support@syngenta.com

## Changelog

### 1.0.0 (Initial Release)
- React Native support with vision-camera
- Multi-language support (6 languages)
- Counterfeit detection
- Comprehensive error handling
- TypeScript support
