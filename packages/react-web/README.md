# @syngenta/product-check-react-web

React Web product verification scanner for Syngenta using real camera QR scanning.

## Installation

```bash
npm install @syngenta/product-check-react-web
# or
yarn add @syngenta/product-check-react-web
```

## Features

- ✅ Real camera QR code scanning using [@yudiel/react-qr-scanner](https://www.npmjs.com/package/@yudiel/react-qr-scanner)
- ✅ Product verification with backend API
- ✅ Counterfeit detection support
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Easy integration

## Usage

### Basic Example

```tsx
import React, { useState } from 'react';
import { ProductScanner } from '@syngenta/product-check-react-web';

function App() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div>
      {!showScanner ? (
        <button onClick={() => setShowScanner(true)}>Scan Product</button>
      ) : (
        <ProductScanner
          apiBaseUrl="https://api.syngenta.com"
          authToken="your-jwt-token"
          onResult={(result) => {
            console.log('Scan result:', result);
            if (result.status === 'success') {
              alert('Product verified!');
            }
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
```

### With State Management

```tsx
import React, { useState } from 'react';
import { ProductScanner, VerificationResult } from '@syngenta/product-check-react-web';

function App() {
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleScanResult = (scanResult: VerificationResult) => {
    setResult(scanResult);
    setShowScanner(false);
  };

  return (
    <div>
      <h1>Product Verification</h1>

      {!showScanner ? (
        <>
          <button onClick={() => setShowScanner(true)}>Scan Product</button>

          {result && (
            <div>
              <h2>Last Scan Result</h2>
              <p>Status: {result.status}</p>
              <p>Message: {result.message}</p>
              {result.productDetails && (
                <ul>
                  <li>Name: {result.productDetails.name}</li>
                  <li>Manufacturer: {result.productDetails.manufacturer}</li>
                  <li>Batch: {result.productDetails.batchNumber}</li>
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <ProductScanner
          apiBaseUrl="https://api.syngenta.com"
          authToken="your-jwt-token"
          enableCounterfeitCheck={true}
          onResult={handleScanResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
```

## Props

| Prop                     | Type                                   | Required | Default | Description                  |
| ------------------------ | -------------------------------------- | -------- | ------- | ---------------------------- |
| `apiBaseUrl`             | `string`                               | Yes      | -       | Backend API base URL         |
| `authToken`              | `string`                               | No       | -       | JWT authentication token     |
| `onResult`               | `(result: VerificationResult) => void` | No       | -       | Callback when scan completes |
| `onClose`                | `() => void`                           | No       | -       | Callback for close button    |
| `className`              | `string`                               | No       | -       | Custom CSS class             |
| `enableCounterfeitCheck` | `boolean`                              | No       | `true`  | Enable counterfeit warning   |

## Types

```typescript
interface VerificationResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  productDetails?: ProductDetails;
  code?: string;
  errorCode?: number;
}

interface ProductDetails {
  name: string;
  manufacturer: string;
  marketedBy: string;
  manufacturedOn: string;
  expiryDate: string;
  batchNumber: string;
}
```

## Camera Permissions

The scanner will automatically request camera permissions when opened. Make sure your app is served over HTTPS (required for camera access in modern browsers).

### Development with HTTP

For local development with HTTP, you can:

1. Use `localhost` (camera API works on localhost)
2. Or use a tool like [ngrok](https://ngrok.com/) to create HTTPS tunnel

## Browser Compatibility

| Browser | Support                     |
| ------- | --------------------------- |
| Chrome  | ✅ Full support             |
| Firefox | ✅ Full support             |
| Safari  | ✅ Full support (iOS 14.3+) |
| Edge    | ✅ Full support             |

## Styling

The component uses inline styles by default. You can customize appearance by:

1. Using the `className` prop
2. Wrapping in a styled container
3. Overriding inline styles with CSS specificity

```tsx
<ProductScanner
  className="my-custom-scanner"
  apiBaseUrl="https://api.syngenta.com"
  // ...
/>
```

```css
.my-custom-scanner {
  max-width: 600px;
  margin: 0 auto;
  border: 2px solid #007bff;
  border-radius: 8px;
}
```

## Error Handling

The scanner handles various error scenarios:

- **Network errors**: Shows error message if API is unreachable
- **Invalid QR codes**: Shows error for non-Syngenta codes
- **Camera errors**: Logs to console, check browser permissions
- **Counterfeit warnings**: Shows warning status when threshold exceeded

## License

MIT © Syngenta
