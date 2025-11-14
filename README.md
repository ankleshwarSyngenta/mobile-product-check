# @syngenta/mobile-product-check

[![npm version](https://badge.fury.io/js/%40syngenta%2Fmobile-product-check.svg)](https://www.npmjs.com/package/@syngenta/mobile-product-check)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive React Native module for scanning and verifying Syngenta products using QR codes with camera integration.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Setup Guide](#setup-guide)
  - [iOS Setup](#ios-setup)
  - [Android Setup](#android-setup)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
  - [Basic Usage](#basic-usage)
  - [With Home Screen](#with-home-screen)
  - [Advanced Usage](#advanced-usage)
  - [Programmatic Verification](#programmatic-verification)
- [Verification Scenarios](#verification-scenarios)
- [API Reference](#api-reference)
  - [Components](#components)
  - [Services](#services)
  - [Utilities](#utilities)
  - [Types](#types)
  - [Hooks](#hooks)
- [Localization](#localization)
- [Testing](#testing)
- [Publishing](#publishing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

✅ **Camera Integration** - Uses react-native-vision-camera for efficient QR code scanning  
✅ **Product Verification** - Securely communicates with Syngenta's backend services  
✅ **Multi-Language Support** - Built-in i18n support (6 languages)  
✅ **Counterfeit Detection** - Warns users when products are scanned 10+ times  
✅ **Error Handling** - Handles all 13 error codes from Standard Scan API  
✅ **TypeScript** - Fully typed for better developer experience  
✅ **Customizable** - Flexible configuration and callbacks

---

## 🏗️ Architecture

### Project Structure

```
mobile-product-check/
├── src/
│   ├── components/
│   │   └── ProductScanner.tsx         # Main scanner component
│   ├── services/
│   │   └── ProductVerificationService.ts  # API integration
│   ├── utils/
│   │   └── codeDecoder.ts             # QR code decoder
│   ├── hooks/
│   │   └── useLocalization.ts         # i18n hook
│   ├── types/
│   │   └── index.ts                   # TypeScript definitions
│   ├── constants/
│   │   └── index.ts                   # Constants
│   └── index.ts                       # Main export
├── examples/                          # Usage examples
├── __tests__/                         # Unit tests
└── package.json
```

### Component Flow

```
User Scans QR Code
        ↓
ProductScanner (Camera)
        ↓
CodeDecoder (Validate)
        ↓
ProductVerificationService (API Call)
        ↓
Backend Verification
        ↓
Display Result (Success/Error/Warning)
```

---

## 📦 Installation

**Step 1: Install the package**

```bash
npm install @syngenta/mobile-product-check react-native-vision-camera
# or
yarn add @syngenta/mobile-product-check react-native-vision-camera
```

**Step 2: Install pods (iOS only)**

```bash
cd ios && pod install && cd ..
```

That's it! Now proceed to setup.

---

## 🔧 Setup Guide

### iOS Setup

**1. Add Camera Permission**

Edit `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan product QR codes</string>
```

**2. Minimum iOS Version**

Ensure minimum iOS deployment target is 11.0+ in `ios/Podfile`:

```ruby
platform :ios, '11.0'
```

**3. Install Pods**

```bash
cd ios
pod install
cd ..
```

### Android Setup

**1. Add Permissions**

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application>
        <!-- ... -->
    </application>
</manifest>
```

**2. Update Minimum SDK**

Edit `android/build.gradle`:

```gradle
buildscript {
    ext {
        minSdkVersion = 21
        compileSdkVersion = 33
        targetSdkVersion = 33
    }
}
```

**3. Enable Java 8**

Edit `android/app/build.gradle`:

```gradle
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

---

## 🚀 Quick Start

**Minimal Example:**

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { ProductScanner } from '@syngenta/mobile-product-check';

export default function App() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {!showScanner ? (
        <Button title="Scan Product" onPress={() => setShowScanner(true)} />
      ) : (
        <ProductScanner
          config={{
            apiBaseUrl: 'https://api.syngenta.com',
            apiKey: 'your-api-key',
            locale: 'en',
            onSuccess: (data) => {
              console.log('✅ Product verified:', data);
              setShowScanner(false);
            },
            onError: (error) => {
              console.error('❌ Error:', error.message);
              setShowScanner(false);
            },
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </View>
  );
}
```

**Run the app:**

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## ⚙️ Configuration

### ScannerConfig

| Property                     | Type     | Required | Default | Description                                    |
| ---------------------------- | -------- | -------- | ------- | ---------------------------------------------- |
| `apiBaseUrl`                 | string   | Yes      | -       | Base URL for Syngenta's backend API            |
| `apiKey`                     | string   | No       | -       | API key for authentication                     |
| `locale`                     | string   | No       | 'en'    | Language code (en, es, pt, fr, de, zh)         |
| `counterfeitThreshold`       | number   | No       | 10      | Number of scans before counterfeit warning     |
| `counterfeitCheckPeriodDays` | number   | No       | 365     | Period in days for counterfeit check           |
| `onSuccess`                  | function | No       | -       | Callback when product is verified successfully |
| `onError`                    | function | No       | -       | Callback when verification fails               |
| `onCounterfeitWarning`       | function | No       | -       | Callback when counterfeit warning triggers     |

---

## 📖 Usage Examples

### Basic Usage

Simplest implementation with just the scanner component:

```tsx
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
```

### With Home Screen

Toggle between a home screen and the scanner:

```tsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {!showScanner ? (
        <View style={styles.homeContainer}>
          <Text style={styles.title}>Syngenta Product Check</Text>
          <Text style={styles.subtitle}>Verify product authenticity by scanning the QR code</Text>
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
            <Text style={styles.scanButtonText}>📷 Scan Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ProductScanner config={config} onClose={() => setShowScanner(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  homeContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 40 },
  scanButton: { backgroundColor: '#007bff', borderRadius: 12, padding: 20, alignItems: 'center' },
  scanButtonText: { color: '#ffffff', fontSize: 20, fontWeight: '600' },
});

export default App;
```

### Advanced Usage

With language selector and scan history:

```tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
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
  ];

  const config = {
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key-here',
    locale: selectedLanguage,
    onSuccess: (data) => {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!showScanner ? (
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Product Verification</Text>

          {/* Language Selector */}
          <View style={{ marginTop: 20 }}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                style={{
                  padding: 10,
                  backgroundColor: selectedLanguage === lang.code ? '#007bff' : '#fff',
                }}
              >
                <Text style={{ color: selectedLanguage === lang.code ? '#fff' : '#000' }}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={{ backgroundColor: '#007bff', padding: 18, marginTop: 20 }}
            onPress={() => setShowScanner(true)}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Scan New Product</Text>
          </TouchableOpacity>

          {/* Scan History */}
          <FlatList
            data={scanHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ padding: 16, backgroundColor: '#fff', marginTop: 12 }}>
                <Text>{item.productName}</Text>
                <Text>Serial: {item.serialNumber}</Text>
                <Text>{item.timestamp.toLocaleString()}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <ProductScanner config={config} onClose={() => setShowScanner(false)} />
      )}
    </SafeAreaView>
  );
}

export default App;
```

### Programmatic Verification

Use the service directly without the UI component:

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  ProductVerificationService,
  CodeDecoder,
  ProductDetails,
  VerificationStatus,
} from '@syngenta/mobile-product-check';

function ProgrammaticExample() {
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

      // Step 2: Verify product
      const verification = await service.verifyProduct(qrCodeText);

      if (verification.status === VerificationStatus.SUCCESS && verification.data) {
        setResult(verification.data);

        if (verification.isCounterfeitWarning) {
          console.warn(`⚠️ Counterfeit warning! Scanned ${verification.scanCount} times`);
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity
        style={{ backgroundColor: '#007bff', padding: 16 }}
        onPress={() => verifyProductByCode('https://attx.syngenta.com/product?id=TEST123')}
        disabled={isVerifying}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {isVerifying ? 'Verifying...' : 'Verify Sample Product'}
        </Text>
      </TouchableOpacity>

      {isVerifying && <ActivityIndicator size="large" color="#007bff" />}

      {result && (
        <View style={{ marginTop: 20, padding: 16, backgroundColor: '#d4edda' }}>
          <Text>✅ Verified Product</Text>
          <Text>Name: {result.productName}</Text>
          <Text>Serial: {result.serialNumber}</Text>
        </View>
      )}

      {error && (
        <View style={{ marginTop: 20, padding: 16, backgroundColor: '#f8d7da' }}>
          <Text>❌ {error}</Text>
        </View>
      )}
    </View>
  );
}

export default ProgrammaticExample;
```

---

## 🎯 Verification Scenarios

### Scenario 1: Successful Verification ✅

When a valid Syngenta product is scanned:

- **Icon**: ✅ Green checkmark
- **Message**: "This product is authentic and registered with Syngenta."
- **Product Details Shown**:
  - Product Name
  - Serial Number
  - Produced Date
  - Expiry Date
  - Batch Number
  - Raw Material Batch Number
  - Manufacturer (if available)
  - Marketed By (if available)

_Note: Fields with no data display as "NA"_

### Scenario 2: Non-Syngenta Product ❌

When an invalid or non-Syngenta QR code is scanned:

- **Icon**: ❌ Red error icon
- **Message**: "Non Syngenta product"
- **Error Details**: Based on error code (0-12)

**Error Codes:**

| Code | Message                                        |
| ---- | ---------------------------------------------- |
| 0    | Tracking id is not available.                  |
| 1    | Code scanned multiple times. Contact Syngenta. |
| 2    | Tracking id is not available.                  |
| 3    | Tracking ID is not active.                     |
| 4    | Invalid mandatory input values.                |
| 5    | Missing mandatory input values.                |
| 6    | Invalid Tracking ID.                           |
| 7    | Tracking ID is blacklisted.                    |
| 8    | Authentication for code has failed.            |
| 9    | ID is a Turkey product with valid format.      |
| 10   | GTIN does not exist.                           |
| 11   | SN does not exist.                             |
| 12   | Tracking ID is stolen.                         |

### Scenario 3: Counterfeit Warning ⚠️

When a product has been scanned 10+ times by unique users within 1 year:

- **Display**: Success screen with product details
- **Warning Banner**: ⚠️ Yellow warning at top
- **Message**: "This product has been scanned multiple times. Please verify with Syngenta if you have concerns about authenticity."
- **Action**: User can still see product details but should contact Syngenta

---

## 📚 API Reference

### Components

#### ProductScanner

Main component for scanning and verifying products.

```tsx
<ProductScanner config={scannerConfig} onClose={() => {}} />
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

| Code | Message                                        |
| ---- | ---------------------------------------------- |
| 0    | Tracking id is not available.                  |
| 1    | Code scanned multiple times. Contact Syngenta. |
| 2    | Tracking id is not available.                  |
| 3    | Tracking ID is not active.                     |
| 4    | Invalid mandatory input values.                |
| 5    | Missing mandatory input values.                |
| 6    | Invalid Tracking ID.                           |
| 7    | Tracking ID is blacklisted.                    |
| 8    | Authentication for code has failed.            |
| 9    | ID is a Turkey product with valid format.      |
| 10   | GTIN does not exist.                           |
| 11   | SN does not exist.                             |
| 12   | Tracking ID is stolen.                         |

### Scenario 3: Counterfeit Warning

When a product has been scanned by 10+ unique users within 1 year:

- ⚠️ Warning banner
- Success screen with product details
- Warning message: "This product has been scanned multiple times. Please verify with Syngenta if you have concerns about authenticity."

## 🌍 Localization

The module supports 6 languages out of the box:

- **English** (en)
- **Spanish** (es)
- **Portuguese** (pt)
- **French** (fr)
- **German** (de)
- **Chinese** (zh)

### Using Different Languages

```tsx
const config = {
  apiBaseUrl: 'https://api.syngenta.com',
  locale: 'es', // Spanish
  // ... other config
};
```

### Available Translations

The following keys are translated:

- `scanPrompt` - "Point camera at product QR code to scan"
- `scanSuccess` - "Scan successful"
- `productVerified` - "Product verified successfully"
- `productDetails` - "Product Details"
- `errorTitle` - "Verification Failed"
- `nonSyngentaProduct` - "Non Syngenta product"
- `counterfeitWarning` - "Counterfeit Warning"
- And more...

### Adding Custom Translations

```tsx
import i18n from '@syngenta/mobile-product-check';

i18n.addResourceBundle('it', 'translation', {
  scanPrompt: 'Puntare la fotocamera sul codice QR del prodotto per scansionare',
  scanSuccess: 'Scansione riuscita',
  productVerified: 'Prodotto verificato con successo',
  // ... other translations
});
```

### TypeScript Support

The module is fully written in TypeScript with complete type definitions:

```tsx
import type {
  ProductDetails,
  VerificationStatus,
  VerificationResponse,
  ScannerConfig,
  ErrorCode,
  DecodedResult,
} from '@syngenta/mobile-product-check';
```

---

## 🧪 Testing

The module includes comprehensive unit tests using Jest.

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Structure

```
__tests__/
└── codeDecoder.test.ts    # Tests for QR code decoder
```

### Writing Tests

Example test for the CodeDecoder:

```tsx
import { CodeDecoder } from '@syngenta/mobile-product-check';

describe('CodeDecoder', () => {
  it('should decode valid Syngenta URL', () => {
    const result = CodeDecoder.decode('https://attx.syngenta.com/product?id=ABC123');
    expect(result.isValid).toBe(true);
    expect(result.trackingId).toBe('ABC123');
  });

  it('should reject non-Syngenta codes', () => {
    const result = CodeDecoder.decode('https://example.com/product');
    expect(result.isValid).toBe(false);
  });
});
```

### Test Coverage

The module maintains high test coverage for:

- ✅ Code decoding and validation
- ✅ QR code pattern matching
- ✅ Tracking ID extraction
- ✅ Error handling

---

## 📦 Publishing

### Publishing to NPM

**Prerequisites:**

- NPM account with access to `@syngenta` organization
- Proper versioning in `package.json`
- All tests passing

**Steps:**

1. **Update version:**

   ```bash
   npm version patch  # or minor, major
   ```

2. **Build the package:**

   ```bash
   npm run build
   ```

3. **Login to NPM:**

   ```bash
   npm login
   ```

4. **Publish:**
   ```bash
   npm publish --access public
   ```

### GitHub Release Process

The module uses GitHub Actions for automated publishing:

1. **Create a tag:**

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions will:**
   - Run tests
   - Build the package
   - Publish to NPM (if tests pass)
   - Create a GitHub release

### Version Strategy

Follow semantic versioning (SemVer):

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Patch** (1.0.0 → 1.0.1): Bug fixes

---

---

## 🔌 Backend API Requirements

Your backend should implement the Standard Scan API with the following specifications:

### Endpoint: POST /scan

**Request Body:**

```json
{
  "trackingId": "string",
  "url": "string",
  "timestamp": "ISO8601 date-time",
  "locale": "string"
}
```

**Success Response (200):**

```json
{
  "product": {
    "productName": "Product Name",
    "serialNumber": "SN123456",
    "producedDate": "2024-01-15",
    "expiryDate": "2026-01-15",
    "batchNumber": "BATCH001",
    "rawMaterialBatchNumber": "RAW001",
    "manufacturer": "Factory Name",
    "marketedBy": "Syngenta"
  }
}
```

**Error Response (400/404/500):**

```json
{
  "errorCode": 6,
  "message": "Invalid Tracking ID",
  "details": "The provided tracking ID does not match our records"
}
```

**Error Codes (0-12):**

| Code | Meaning                               |
| ---- | ------------------------------------- |
| 0    | Tracking ID not available             |
| 1    | Code scanned multiple times           |
| 2    | Tracking ID not available (duplicate) |
| 3    | Tracking ID not active                |
| 4    | Invalid mandatory input values        |
| 5    | Missing mandatory input values        |
| 6    | Invalid Tracking ID                   |
| 7    | Tracking ID blacklisted               |
| 8    | Authentication failed                 |
| 9    | Turkey product (valid format)         |
| 10   | GTIN does not exist                   |
| 11   | SN does not exist                     |
| 12   | Tracking ID stolen                    |

### Endpoint: POST /record-scan (Optional)

For counterfeit detection tracking:

**Request:**

```json
{
  "trackingId": "string",
  "userId": "string",
  "timestamp": "ISO8601 date-time"
}
```

**Response:**

```json
{
  "success": true,
  "scanCount": 15
}
```

### Endpoint: GET /scan-count/:trackingId (Optional)

Retrieve scan count for counterfeit detection:

**Response:**

```json
{
  "trackingId": "ABC123",
  "scanCount": 15,
  "uniqueUsers": 12,
  "lastScanned": "2024-03-15T10:30:00Z"
}
```

---

## 🛠️ Troubleshooting

---

## 🛠️ Troubleshooting

### Camera Permission Issues

**iOS:**

- Ensure `NSCameraUsageDescription` is added to `Info.plist`
- Check device Settings → Privacy → Camera → Your App is enabled
- Try reinstalling pods: `cd ios && pod install && cd ..`
- Clean build: `npx react-native run-ios --reset-cache`

**Android:**

- Ensure `CAMERA` permission is in `AndroidManifest.xml`
- Check device Settings → Apps → Your App → Permissions → Camera is enabled
- Try rebuilding: `cd android && ./gradlew clean && cd ..`
- Run: `npx react-native run-android --reset-cache`

### QR Code Not Scanning

**Common Issues:**

- **Poor Lighting**: Ensure adequate lighting for the camera
- **Distance**: Hold device 6-12 inches (15-30 cm) from QR code
- **Focus**: Keep device steady and wait for autofocus
- **Code Quality**: Ensure QR code is not damaged or distorted
- **Non-Syngenta Code**: Module only recognizes Syngenta QR codes

**Debugging:**

```tsx
const decoded = CodeDecoder.decode(scannedText);
console.log('Decoded result:', decoded);
console.log('Is Syngenta code:', CodeDecoder.isSyngentaCode(scannedText));
```

### Build Errors

**iOS Build Failures:**

```bash
# Clean and rebuild
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

**Android Build Failures:**

```bash
# Clean Gradle cache
cd android
./gradlew clean
./gradlew --stop
cd ..

# Clear metro bundler cache
npx react-native start --reset-cache
```

**Metro Bundler Issues:**

```bash
# Clear watchman cache
watchman watch-del-all

# Clear metro cache
rm -rf $TMPDIR/metro-*

# Clear npm cache
npm cache clean --force

# Restart metro
npx react-native start --reset-cache
```

### API Connection Issues

**Network Errors:**

- Check `apiBaseUrl` is correct
- Verify device has internet connection
- Check API endpoint is reachable: `curl https://api.syngenta.com/scan`
- Review API key authentication if required

**CORS Errors (Web):**

- This module is for React Native (mobile), not React (web)
- Use `@syngenta/web-product-check` for web applications

**Timeout Errors:**

```tsx
// Implement custom timeout logic
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Request timeout')), 10000)
);

const verification = await Promise.race([service.verifyProduct(code), timeout]);
```

### TypeScript Errors

**Missing Type Definitions:**

```bash
# Reinstall with TypeScript types
npm install @syngenta/mobile-product-check --save
```

**Type Import Errors:**

```tsx
// Use `import type` for type-only imports
import type { ProductDetails, ScannerConfig } from '@syngenta/mobile-product-check';

// Or import normally
import { ProductDetails, ScannerConfig } from '@syngenta/mobile-product-check';
```

### Performance Issues

**Slow Camera Performance:**

- Reduce camera quality in vision-camera settings
- Ensure device is not overheating
- Close other apps consuming resources

**Memory Issues:**

- Check for memory leaks with React DevTools
- Ensure scanner component is properly unmounted
- Use `onClose` callback to clean up state

### Common Error Messages

| Error                      | Solution                                        |
| -------------------------- | ----------------------------------------------- |
| "Camera permission denied" | Grant camera permission in device settings      |
| "Invalid tracking ID"      | Ensure QR code is a valid Syngenta product code |
| "Network request failed"   | Check internet connection and API URL           |
| "API key missing"          | Provide valid API key in config                 |
| "Module not found"         | Run `npm install` and rebuild                   |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Steps to Contribute

1. **Fork the repository**

   ```bash
   git clone https://github.com/syngenta-digital/npm-product-check.git
   cd npm-product-check
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, well-documented code
   - Follow existing code style
   - Add tests for new features

4. **Run tests**

   ```bash
   npm test
   npm run lint
   ```

5. **Commit your changes**

   ```bash
   git commit -m "feat: add new feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding tests
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules configured in the project
- Write meaningful comments for complex logic
- Keep functions small and focused

### Pull Request Guidelines

- Provide clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

---

## 📄 License

MIT License

Copyright (c) 2024 Syngenta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues**: [syngenta-digital/npm-product-check/issues](https://github.com/syngenta-digital/npm-product-check/issues)
- **Email**: support@syngenta.com
- **Documentation**: [README.md](README.md)

---

## 📝 Changelog

### Version 1.0.0 (Initial Release)

**Features:**

- ✅ React Native support with react-native-vision-camera
- ✅ QR code scanning for Syngenta products
- ✅ Multi-language support (EN, ES, PT, FR, DE, ZH)
- ✅ Counterfeit detection (10+ scans warning)
- ✅ Comprehensive error handling (13 error codes)
- ✅ TypeScript support with full type definitions
- ✅ Programmatic API for custom integrations
- ✅ Localization with i18next

**Documentation:**

- Complete README with examples
- API reference documentation
- Setup guides for iOS and Android
- Troubleshooting guide
- Contributing guidelines

**Testing:**

- Unit tests for code decoder
- Jest configuration
- CI/CD with GitHub Actions

---

Made with ❤️ by Syngenta Digital Team
