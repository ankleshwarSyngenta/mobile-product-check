# API Documentation

## Table of Contents

- [Components](#components)
- [Services](#services)
- [Utilities](#utilities)
- [Types](#types)
- [Hooks](#hooks)

## Components

### ProductScanner

Main component for scanning and verifying products.

#### Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| config | ScannerConfig | Yes | Configuration object |
| onClose | () => void | No | Callback when scanner is closed |

#### Example

```tsx
import { ProductScanner } from '@syngenta/mobile-product-check';

<ProductScanner
  config={{
    apiBaseUrl: 'https://api.syngenta.com',
    locale: 'en',
    onSuccess: (data) => console.log(data),
  }}
  onClose={() => setShowScanner(false)}
/>
```

## Services

### ProductVerificationService

Service for product verification operations.

#### Constructor

```typescript
constructor(config: ScannerConfig)
```

#### Methods

##### verifyProduct

Verify product authenticity.

```typescript
async verifyProduct(scannedCode: string): Promise<VerificationResponse>
```

**Parameters:**
- `scannedCode: string` - The scanned QR code text

**Returns:** Promise<VerificationResponse>

**Example:**

```typescript
const service = new ProductVerificationService(config);
const result = await service.verifyProduct(qrCode);
```

##### recordScan

Record a scan for counterfeit detection.

```typescript
async recordScan(trackingId: string, userId?: string): Promise<void>
```

##### getScanCount

Get scan count for a tracking ID.

```typescript
async getScanCount(trackingId: string): Promise<number>
```

## Utilities

### CodeDecoder

Utility for decoding and validating QR codes.

#### Static Methods

##### decode

Decode a scanned code.

```typescript
static decode(codeText: string): DecodedResult
```

**Example:**

```typescript
const decoded = CodeDecoder.decode(qrCodeText);
console.log(decoded.isValid, decoded.trackingId);
```

##### validateCode

Validate code format and integrity.

```typescript
static validateCode(code: string): { isValid: boolean; error?: string }
```

##### isSyngentaCode

Check if code is a Syngenta product code.

```typescript
static isSyngentaCode(code: string): boolean
```

##### extractTrackingId

Extract tracking ID from code.

```typescript
static extractTrackingId(code: string): string | undefined
```

## Types

### ScannerConfig

Configuration for the scanner.

```typescript
interface ScannerConfig {
  apiBaseUrl: string;
  apiKey?: string;
  locale?: string;
  counterfeitThreshold?: number;
  counterfeitCheckPeriodDays?: number;
  onSuccess?: (data: ProductDetails) => void;
  onError?: (error: ApiError) => void;
  onCounterfeitWarning?: (data: ProductDetails, scanCount: number) => void;
}
```

### ProductDetails

Product information.

```typescript
interface ProductDetails {
  productName: string;
  serialNumber: string;
  producedDate: string;
  expiryDate: string;
  batchNumber: string;
  rawMaterialBatchNumber: string;
  manufacturer?: string;
  marketedBy?: string;
}
```

### VerificationResponse

Response from verification.

```typescript
interface VerificationResponse {
  status: VerificationStatus;
  data?: ProductDetails;
  error?: ApiError;
  scanCount?: number;
  isCounterfeitWarning?: boolean;
}
```

### VerificationStatus

Status enum.

```typescript
enum VerificationStatus {
  SUCCESS = 'SUCCESS',
  NON_SYNGENTA = 'NON_SYNGENTA',
  COUNTERFEIT_WARNING = 'COUNTERFEIT_WARNING',
  ERROR = 'ERROR',
}
```

### ErrorCode

API error codes (0-12).

```typescript
enum ErrorCode {
  TRACKING_ID_NOT_AVAILABLE = 0,
  CODE_SCANNED_MULTIPLE_TIMES = 1,
  // ... (see full list in types documentation)
}
```

## Hooks

### useLocalization

Hook for localization management.

```typescript
const { t, currentLocale, changeLanguage } = useLocalization(locale);
```

**Returns:**

- `t: (key: string) => string` - Translation function
- `currentLocale: string` - Current locale code
- `changeLanguage: (locale: string) => void` - Change language function

**Example:**

```typescript
const { t } = useLocalization('en');
console.log(t('scanPrompt')); // "Point camera at product QR code to scan"
```

## Constants

### Error Messages

```typescript
const ERROR_MESSAGES: Record<number, string>
```

### Syngenta QR Patterns

```typescript
const SYNGENTA_QR_PATTERNS: RegExp[]
```

### Default Values

```typescript
const DEFAULT_COUNTERFEIT_THRESHOLD = 10;
const DEFAULT_COUNTERFEIT_CHECK_PERIOD_DAYS = 365;
const DEFAULT_LOCALE = 'en';
```
