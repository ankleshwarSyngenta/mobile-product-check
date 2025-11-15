# @syngenta/product-check

[![npm version](https://badge.fury.io/js/%40syngenta%2Fproduct-check.svg)](https://www.npmjs.com/package/@syngenta/product-check)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, enterprise-grade product authentication SDK for scanning and verifying Syngenta products using 2D matrix codes, QR codes, and barcodes. Built with **Hexagonal Architecture** for maximum flexibility, testability, and maintainability across React Native (mobile) and React Web platforms.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Setup Guide](#setup-guide)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Packages](#packages)
- [API Reference](#api-reference)
- [Code Types Supported](#code-types-supported)
- [Verification Scenarios](#verification-scenarios)
- [Backend API Integration](#backend-api-integration)
- [Localization](#localization)
- [Theming](#theming)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features

✅ **Multi-Platform Support** - React Native (iOS/Android) and React Web  
✅ **Camera Integration** - Uses react-native-vision-camera for efficient scanning  
✅ **Multiple Code Types** - QR, DataMatrix, EAN-13, UPC-A support  
✅ **Product Verification** - Secure backend communication with Syngenta APIs  
✅ **Multi-Language Support** - Built-in i18n support (6 languages: EN, ES, PT, FR, DE, ZH)  
✅ **Counterfeit Detection** - Configurable threshold-based warning system  
✅ **Error Handling** - Comprehensive handling of 13 backend error codes  
✅ **TypeScript** - Fully typed for enhanced developer experience  
✅ **Customizable** - Flexible configuration, callbacks, and theming  
✅ **Hexagonal Architecture** - Clean separation of concerns using Ports & Adapters  
✅ **Retry Logic** - Built-in exponential backoff retry mechanism  
✅ **Analytics Ready** - Pluggable analytics port for custom tracking  
✅ **Production Ready** - Enterprise-grade with comprehensive test coverage

---

## Architecture

This monorepo follows **Hexagonal Architecture (Ports & Adapters)** for clean code organization, testability, and extensibility.

### Monorepo Structure

```text
mobile-product-check/
├── packages/
│   ├── core-sdk/              # Shared business logic & infrastructure
│   │   ├── src/
│   │   │   ├── ports/         # Interface contracts
│   │   │   ├── infrastructure/ # HTTP client, adapters
│   │   │   ├── api/           # Backend client
│   │   │   ├── utils/         # Code decoder
│   │   │   ├── hooks/         # React hooks
│   │   │   ├── theme/         # Theming system
│   │   │   └── verification/  # Error codes
│   │   └── package.json
│   ├── react-native/          # React Native scanner
│   │   └── src/
│   │       ├── scanner/       # ProductScanner component
│   │       └── service/       # Verification service
│   └── react-web/             # React Web scanner
│       └── src/
│           ├── scanner/       # ProductScanner component
│           └── service/       # Verification service
├── examples/                  # Usage examples
├── __tests__/                 # Unit tests
├── doc/                       # Documentation
└── README.md                  # This file
```

### Component Flow

```text
User Scans Code
      ↓
ProductScanner (Camera)
      ↓
CodeDecoder (Validate & Extract)
      ↓
BackendClient → BackendPort → HttpBackendAdapter
      ↓
Backend API Verification
      ↓
Analytics Tracking (Optional)
      ↓
Display Result (Success/Warning/Error)
```

### Why Hexagonal Architecture?

- **Testability**: Easy to mock dependencies and write unit tests
- **Flexibility**: Swap implementations without changing business logic
- **Maintainability**: Clear boundaries between layers
- **Scalability**: Add new adapters (e.g., GraphQL) without modifying core
- **Platform Independence**: Core logic shared across React Native & Web

---

## Installation

This is a monorepo containing three packages. Install only what you need:

### For React Native Apps

```bash
npm install @syngenta/product-check-react-native react-native-vision-camera
# or
yarn add @syngenta/product-check-react-native react-native-vision-camera
```

**iOS:** Install pods

```bash
cd ios && pod install && cd ..
```

### For React Web Apps

```bash
npm install @syngenta/product-check-react-web
# or
yarn add @syngenta/product-check-react-web
```

### Core SDK (for custom integrations)

```bash
npm install @syngenta/product-check-core
# or
yarn add @syngenta/product-check-core
```

**Note:** The React Native and React Web packages automatically include the core SDK as a dependency.

---

## Quick Start

### React Native - Minimal Example

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { ProductScanner } from '@syngenta/product-check-react-native';

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

### React Web - Minimal Example

```tsx
import React, { useState } from 'react';
import { ProductScanner } from '@syngenta/product-check-react-web';

export default function App() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div style={{ height: '100vh' }}>
      {!showScanner ? (
        <button onClick={() => setShowScanner(true)}>Scan Product</button>
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
    </div>
  );
}
```

---

## Setup Guide

### iOS Setup (React Native)

#### 1. Add Camera Permission

Edit `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan product QR codes</string>
```

#### 2. Minimum iOS Version

Ensure minimum iOS deployment target is 11.0+ in `ios/Podfile`:

```ruby
platform :ios, '11.0'
```

#### 3. Install Pods

```bash
cd ios
pod install
cd ..
```

#### 4. Build and Run

```bash
npx react-native run-ios
```

### Android Setup (React Native)

#### 1. Add Permissions

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

#### 2. Update Minimum SDK

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

#### 3. Enable Java 8

Edit `android/app/build.gradle`:

```gradle
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

#### 4. Build and Run

```bash
npx react-native run-android
```

---

## Configuration

### ScannerConfig

| Property               | Type     | Required | Default | Description                                    |
| ---------------------- | -------- | -------- | ------- | ---------------------------------------------- |
| `apiBaseUrl`           | string   | Yes      | -       | Base URL for Syngenta's backend API            |
| `apiKey`               | string   | No       | -       | API key for authentication                     |
| `authToken`            | string   | No       | -       | JWT authentication token                       |
| `locale`               | string   | No       | 'en'    | Language code (en, es, pt, fr, de, zh)         |
| `counterfeitThreshold` | number   | No       | 10      | Number of unique retailers before warning      |
| `timeout`              | number   | No       | 30000   | Request timeout in milliseconds                |
| `retryAttempts`        | number   | No       | 3       | Number of retry attempts for failed requests   |
| `onSuccess`            | function | No       | -       | Callback when product is verified successfully |
| `onError`              | function | No       | -       | Callback when verification fails               |
| `onCounterfeitWarning` | function | No       | -       | Callback when counterfeit warning triggers     |

### Example Configuration

```tsx
const config = {
  apiBaseUrl: 'https://api.syngenta.com',
  authToken: 'your-jwt-token',
  locale: 'es',
  counterfeitThreshold: 15,
  timeout: 60000,
  retryAttempts: 5,
  onSuccess: (data) => {
    console.log('Product verified:', data);
  },
  onError: (error) => {
    console.error('Verification failed:', error);
  },
  onCounterfeitWarning: (data, scanCount) => {
    console.warn(`Warning: ${scanCount} scans detected`);
  },
};
```

---

## Usage Examples

### Basic Usage

Simplest implementation with just the scanner component:

```tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ProductScanner } from '@syngenta/product-check-react-native';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ProductScanner
        config={{
          apiBaseUrl: 'https://api.syngenta.com',
          apiKey: 'your-api-key',
          locale: 'en',
          onSuccess: (data) => console.log('✅ Verified:', data),
          onError: (error) => console.error('❌ Error:', error),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
});

export default App;
```

### With Home Screen

Toggle between a home screen and the scanner:

```tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { ProductScanner } from '@syngenta/product-check-react-native';

function App() {
  const [showScanner, setShowScanner] = useState(false);

  const config = {
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key',
    locale: 'en',
    onSuccess: (data) => {
      setShowScanner(false);
      Alert.alert(
        '✅ Product Verified',
        `Product: ${data.productName}\nSerial: ${data.serialNumber}`
      );
    },
    onError: (error) => {
      setShowScanner(false);
      Alert.alert('❌ Verification Failed', error.message);
    },
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!showScanner ? (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>
            Syngenta Product Check
          </Text>
          <Text style={{ fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginVertical: 20 }}>
            Verify product authenticity by scanning the QR code
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#007bff', borderRadius: 12, padding: 20 }}
            onPress={() => setShowScanner(true)}
          >
            <Text style={{ color: '#ffffff', fontSize: 20, textAlign: 'center' }}>
              📷 Scan Product
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ProductScanner config={config} onClose={() => setShowScanner(false)} />
      )}
    </SafeAreaView>
  );
}

export default App;
```

### Advanced Usage

With language selector and scan history:

```tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ProductScanner, ProductDetails } from '@syngenta/product-check-react-native';

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
    apiKey: 'your-api-key',
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
          <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                style={{
                  padding: 10,
                  backgroundColor: selectedLanguage === lang.code ? '#007bff' : '#e0e0e0',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: selectedLanguage === lang.code ? '#fff' : '#000' }}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={{ backgroundColor: '#007bff', padding: 18, marginTop: 20, borderRadius: 8 }}
            onPress={() => setShowScanner(true)}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}>
              Scan New Product
            </Text>
          </TouchableOpacity>

          {/* Scan History */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30 }}>Scan History</Text>
          <FlatList
            data={scanHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{ padding: 16, backgroundColor: '#fff', marginTop: 12, borderRadius: 8 }}
              >
                <Text style={{ fontWeight: 'bold' }}>{item.productName}</Text>
                <Text>Serial: {item.serialNumber}</Text>
                <Text style={{ color: '#7f8c8d', fontSize: 12 }}>
                  {item.timestamp.toLocaleString()}
                </Text>
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
} from '@syngenta/product-check-core';

function ProgrammaticExample() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<ProductDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const service = new ProductVerificationService({
    apiBaseUrl: 'https://api.syngenta.com',
    apiKey: 'your-api-key',
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
        style={{ backgroundColor: '#007bff', padding: 16, borderRadius: 8 }}
        onPress={() => verifyProductByCode('https://attx.syngenta.com/product?id=TEST123')}
        disabled={isVerifying}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {isVerifying ? 'Verifying...' : 'Verify Sample Product'}
        </Text>
      </TouchableOpacity>

      {isVerifying && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}

      {result && (
        <View style={{ marginTop: 20, padding: 16, backgroundColor: '#d4edda', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>✅ Verified Product</Text>
          <Text>Name: {result.productName}</Text>
          <Text>Serial: {result.serialNumber}</Text>
        </View>
      )}

      {error && (
        <View style={{ marginTop: 20, padding: 16, backgroundColor: '#f8d7da', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>❌ {error}</Text>
        </View>
      )}
    </View>
  );
}

export default ProgrammaticExample;
```

---

## Packages

### @syngenta/product-check-core

The core SDK containing shared business logic, ports, and infrastructure.

**Key Exports:**

- `BackendClient` - HTTP client for API communication
- `useProductVerification` - React hook for verification
- `CodeDecoder` - Multi-format code decoder
- `ThemeProvider` - Theming system
- Ports: `BackendPort`, `AnalyticsPort`, `LocalizationPort`, `LoggerPort`

**Installation:**

```bash
npm install @syngenta/product-check-core
```

### @syngenta/product-check-react-native

React Native scanner component with camera integration.

**Key Exports:**

- `ProductScanner` - Camera-based scanner component
- `ProductVerificationService` - Service layer
- `useVerificationService` - Custom hook

**Installation:**

```bash
npm install @syngenta/product-check-react-native react-native-vision-camera
```

### @syngenta/product-check-react-web

React Web scanner component with web camera support.

**Key Exports:**

- `ProductScanner` - Web camera-based scanner component
- `ProductVerificationService` - Service layer
- `useVerificationService` - Custom hook

**Installation:**

```bash
npm install @syngenta/product-check-react-web
```

---

## API Reference

### Components

#### ProductScanner

Main component for scanning and verifying products.

```tsx
import { ProductScanner } from '@syngenta/product-check-react-native';

<ProductScanner config={scannerConfig} onClose={() => {}} />;
```

**Props:**

- `config: ScannerConfig` - Configuration object (required)
- `onClose?: () => void` - Callback when scanner is closed (optional)

### Services

#### ProductVerificationService

Service for programmatic product verification.

```tsx
import { ProductVerificationService } from '@syngenta/product-check-core';

const service = new ProductVerificationService({
  apiBaseUrl: 'https://api.syngenta.com',
  apiKey: 'your-api-key',
});

const result = await service.verifyProduct(scannedCode);
```

**Methods:**

- `verifyProduct(code: string): Promise<VerificationResponse>`
- `getScanCount(trackingId: string): Promise<number>`

### Utilities

#### CodeDecoder

Utility for decoding and validating various code formats.

```tsx
import { CodeDecoder } from '@syngenta/product-check-core';

const decoded = CodeDecoder.decode(codeText);
const validation = CodeDecoder.validateCode(codeText);
```

**Methods:**

- `decode(codeText: string): DecodedResult` - Decode and extract data from code
- `validateCode(code: string): { isValid: boolean; error?: string }` - Validate code format
- `isSyngentaCode(code: string): boolean` - Check if code is from Syngenta
- `extractTrackingId(code: string): string | undefined` - Extract tracking ID

### Hooks

#### useProductVerification

React hook for product verification with built-in analytics.

```tsx
import { useProductVerification } from '@syngenta/product-check-core';

const { verifyCode, isLoading, error } = useProductVerification({
  client: backendClient,
  counterfeitThreshold: 10,
  localization: localizationPort,
  analytics: analyticsPort,
});

const result = await verifyCode(code, 'QR');
```

### TypeScript Types

```tsx
import type {
  ProductDetails,
  VerificationStatus,
  VerificationResponse,
  ScannerConfig,
  ErrorCode,
  DecodedResult,
  CodeType,
} from '@syngenta/product-check-core';
```

**Key Types:**

```typescript
interface ProductDetails {
  productName?: string;
  serialNumber?: string;
  producedDate?: string;
  expiryDate?: string;
  batchNumber?: string;
  rawMaterialBatchNumber?: string;
  manufacturer?: string;
  marketedBy?: string;
  trackingId?: string;
}

interface VerificationResponse {
  status: VerificationStatus;
  data?: ProductDetails;
  error?: { code: ErrorCode; message: string };
  scanCount?: number;
  isCounterfeitWarning?: boolean;
}

enum VerificationStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

type CodeType = 'QR' | 'DataMatrix' | 'EAN' | 'UPC';
```

---

## Code Types Supported

The SDK automatically detects and decodes multiple code formats:

### QR Codes

- **Syngenta Custom Format**: `https://attx.syngenta.com/product?id=TRACKING-ID`
- **Generic QR**: Any text-based QR code

**Example:**

```typescript
const decoded = CodeDecoder.decode('https://attx.syngenta.com/product?id=ABC123');
// { isValid: true, trackingId: 'ABC123', codeType: 'QR' }
```

### DataMatrix (GS1 Format)

Decodes GS1 DataMatrix codes with Application Identifiers (AI):

- `(01)` GTIN
- `(21)` Serial Number
- `(10)` Batch/Lot Number
- `(17)` Expiry Date (YYMMDD)

**Example:**

```typescript
const decoded = CodeDecoder.decode('(01)12345678901234(21)SN-123(10)BATCH-001(17)251231');
// {
//   isValid: true,
//   gtin: '12345678901234',
//   serialNumber: 'SN-123',
//   batchNumber: 'BATCH-001',
//   expiryDate: '2025-12-31',
//   codeType: 'DataMatrix'
// }
```

### EAN-13

13-digit barcode with checksum validation.

**Example:**

```typescript
const decoded = CodeDecoder.decode('1234567890128');
// { isValid: true, ean: '1234567890128', codeType: 'EAN' }
```

### UPC-A

12-digit barcode automatically converted to GTIN-13.

**Example:**

```typescript
const decoded = CodeDecoder.decode('012345678905');
// { isValid: true, upc: '012345678905', gtin: '0012345678905', codeType: 'UPC' }
```

---

## Verification Scenarios

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

When a product has been scanned by 10+ unique retailers within 1 year:

- **Display**: Success screen with product details
- **Warning Banner**: ⚠️ Yellow warning at top
- **Message**: "This product has been scanned multiple times. Please verify with Syngenta if you have concerns about authenticity."
- **Action**: User can still see product details but should contact Syngenta

---

## Backend API Integration

Your backend should implement the following API contract. For complete specifications, see [doc/API_CONTRACT.md](doc/API_CONTRACT.md).

### Endpoint: POST /api/verify

**Request:**

```json
{
  "code": "SYN-TRACKING-ID-123",
  "codeType": "QR",
  "retailerId": "optional-retailer-id"
}
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "This product is authentic and registered with Syngenta.",
  "product": {
    "name": "Product Name",
    "manufacturer": "Syngenta",
    "marketedBy": "Syngenta",
    "manufacturedOn": "2025-01-15",
    "expiryDate": "2026-01-15",
    "batchNumber": "BATCH-123",
    "serialNumber": "SN-555-XYZ",
    "rawMaterialBatchNumber": "RAW-888",
    "trackingId": "TRACKING-ID-123"
  },
  "scanCountLastYear": 5,
  "uniqueRetailersLastYear": 3
}
```

**Error Response (400/404):**

```json
{
  "status": "error",
  "message": "Invalid Tracking ID.",
  "errorCode": 6
}
```

**Warning Response (Counterfeit Suspected):**

```json
{
  "status": "warning",
  "message": "Potential counterfeit detected. Please escalate.",
  "scanCountLastYear": 50,
  "uniqueRetailersLastYear": 15,
  "errorCode": 1
}
```

### Client Features

- **Exponential Backoff Retry**: Automatic retry with increasing delays
- **Timeout Management**: Configurable request timeouts (default: 30s)
- **JWT Authentication**: Bearer token support
- **Error Handling**: Automatic parsing of error codes 0-12

---

## Localization

The SDK supports 6 languages out of the box:

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

### Available Translation Keys

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
import i18n from '@syngenta/product-check-core';

i18n.addResourceBundle('it', 'translation', {
  scanPrompt: 'Puntare la fotocamera sul codice QR del prodotto per scansionare',
  scanSuccess: 'Scansione riuscita',
  productVerified: 'Prodotto verificato con successo',
  // ... other translations
});
```

---

## Theming

The SDK includes a customizable theming system.

### Default Theme

```tsx
const defaultTheme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    accent: '#007bff',
  },
  icons: {
    success: '✓',
    error: '✗',
    warning: '⚠',
  },
  messages: {
    success: 'Product verified successfully',
    error: 'Verification failed',
    warning: 'Potential counterfeit',
  },
};
```

### Custom Theme

```tsx
import { ThemeProvider } from '@syngenta/product-check-core';

const customTheme = {
  colors: {
    background: '#f5f5f5',
    text: '#333333',
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffaa00',
    accent: '#0066cc',
  },
  icons: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  },
  messages: {
    success: 'Producto verificado',
    error: 'Error de verificación',
    warning: 'Posible falsificación',
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ProductScanner config={config} />
    </ThemeProvider>
  );
}
```

---

## Testing

The SDK includes comprehensive unit tests using Jest.

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

```text
__tests__/
└── codeDecoder.test.ts    # Tests for code decoder
```

### Writing Tests

Example test for the CodeDecoder:

```tsx
import { CodeDecoder } from '@syngenta/product-check-core';

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

---

## Troubleshooting

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
- **Distance**: Hold device 6-12 inches (15-30 cm) from code
- **Focus**: Keep device steady and wait for autofocus
- **Code Quality**: Ensure code is not damaged or distorted
- **Non-Syngenta Code**: SDK only recognizes supported code types

**Debugging:**

```tsx
import { CodeDecoder } from '@syngenta/product-check-core';

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
- Check API endpoint is reachable: `curl https://api.syngenta.com/api/verify`
- Review API key/token authentication

**Timeout Errors:**

```tsx
const config = {
  apiBaseUrl: 'https://api.syngenta.com',
  timeout: 60000, // Increase timeout to 60 seconds
  retryAttempts: 5, // Increase retry attempts
  // ...
};
```

### TypeScript Errors

**Missing Type Definitions:**

```bash
# Reinstall with TypeScript types
npm install @syngenta/product-check-core --save
```

**Type Import Errors:**

```tsx
// Use `import type` for type-only imports
import type { ProductDetails, ScannerConfig } from '@syngenta/product-check-core';

// Or import normally
import { ProductDetails, ScannerConfig } from '@syngenta/product-check-core';
```

---

## Development

### Monorepo Development

This project uses Yarn Workspaces for monorepo management.

#### Install Dependencies

```bash
yarn install
```

#### Build All Packages

```bash
yarn build
```

#### Run in Development Mode

```bash
yarn dev
```

#### Run Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test:coverage
```

#### Lint and Format

```bash
# Lint all packages
yarn lint

# Fix lint issues
yarn lint:fix

# Format code
yarn format

# Check formatting
yarn format:check
```

#### Type Checking

```bash
yarn typecheck
```

### Adding a New Package

1. Create directory in `packages/`
2. Add `package.json` with workspace dependency references
3. Add `tsconfig.json` extending root config
4. Implement using ports from `core-sdk`
5. Add build script using `tsup`

### Publishing

This project uses Changesets for version management.

#### Create a Changeset

```bash
yarn changeset
```

#### Version Packages

```bash
yarn version-packages
```

#### Publish to NPM

```bash
yarn publish-packages
```

---

## Contributing

Contributions are welcome! Please follow these guidelines:

### Steps to Contribute

1. **Fork the repository**

   ```bash
   git clone https://github.com/syngenta/product-check.git
   cd product-check
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
   yarn test
   yarn lint
   yarn typecheck
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

## License

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

## Support

For questions, issues, or feature requests:

- **GitHub Issues**: [syngenta/product-check/issues](https://github.com/syngenta/product-check/issues)
- **Email**: support@syngenta.com
- **Documentation**: See [doc/](doc/) directory for detailed guides

---

## Additional Resources

- [API Contract](doc/API_CONTRACT.md) - Backend API specification
- [Migration Guide](doc/MIGRATION_GUIDE.md) - Upgrading from previous versions
- [Restructure Summary](doc/RESTRUCTURE_SUMMARY.md) - Architecture decisions
- [Examples](examples/) - Usage examples

---

Made with ❤️ by Syngenta Digital Team
