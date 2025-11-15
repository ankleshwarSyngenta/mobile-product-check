
```typescript
const { verifyCode } = useProductVerification({
  client,
  counterfeitThreshold: 10,
  localization: new DefaultLocalization(), // Optional
  analytics: new NoOpAnalytics(), // Optional
  retailerId: 'RETAILER-123', // Optional
});

// verifyCode now accepts codeType
const result = await verifyCode(code, 'QR');
```

### 4. Import Changes

**Before:**

```typescript
import { BackendClient, VerificationResult } from '@syngenta/product-check-core';
```

**After (Same, but more available):**

```typescript
import {
  BackendClient,
  VerificationResult,
  // New exports
  HttpBackendAdapter,
  BackendPort,
  AnalyticsPort,
  LocalizationPort,
  LoggerPort,
  decodeCode,
  validateCodeFormat,
} from '@syngenta/product-check-core';
```

## Migration Steps

### Step 1: Update Dependencies

```bash
# Remove turbo (not needed for 2 packages)
yarn remove turbo

# Add tsup for building
yarn add -D tsup

# Install dependencies
yarn install
```

### Step 2: Update Your Code

#### If you're using ProductScanner component:

**No changes needed!** The component API remains the same:

```tsx
<ProductScanner
  apiBaseUrl="https://api.example.com"
  authToken="token"
  enableCounterfeitCheck={true}
  onResult={(result) => console.log(result)}
/>
```

#### If you're using BackendClient directly:

```typescript
// Old
const client = new BackendClient({ baseUrl: '...', authToken: '...' });
const result = await client.verify(code);

// New - same code works, but you can add options
const client = new BackendClient({
  baseUrl: '...',
  authToken: '...',
  timeout: 30000, // 30 seconds
  retryAttempts: 3, // Retry 3 times on failure
});
const result = await client.verify(code, 'QR');
```

#### If you're using useProductVerification hook:

```typescript
// Old
const { verifyCode } = useProductVerification({ client });
const result = await verifyCode(code);

// New - add optional features
import { DefaultLocalization, NoOpAnalytics } from '@syngenta/product-check-core';

const { verifyCode } = useProductVerification({
  client,
  counterfeitThreshold: 10,
  localization: new DefaultLocalization(),
  analytics: new NoOpAnalytics(),
  retailerId: 'RETAILER-123',
});
const result = await verifyCode(code, 'QR');
```

### Step 3: Update Backend Integration

Your backend must now return proper JSON responses (no more mock data):

```typescript
// The SDK will call POST /api/verify with:
{
  code: "SYN-TRACKING-123",
  codeType: "QR",
  retailerId: "optional"
}

// Backend must return:
{
  status: "success" | "error" | "warning",
  message: "...",
  product: { ... },
  errorCode: 6,  // If error
  scanCountLastYear: 5,
  uniqueRetailersLastYear: 3
}
```

### Step 4: Test Your Integration

```bash
# Build packages
yarn build

# Run tests
yarn test

# Check types
yarn typecheck
```

## New Features You Can Use

### 1. Code Decoding

```typescript
import { decodeCode } from '@syngenta/product-check-core';

const result = decodeCode('SYN-TRACKING-123');
console.log(result.trackingId); // 'TRACKING-123'
console.log(result.codeType); // 'QR'
console.log(result.isValid); // true
```

### 2. Custom Analytics

```typescript
import { AnalyticsPort, AnalyticsEvent } from '@syngenta/product-check-core';

class MyAnalytics implements AnalyticsPort {
  track(event: AnalyticsEvent): void {
    // Send to your analytics service
    myService.track(event.name, event.properties);
  }
}

const { verifyCode } = useProductVerification({
  client,
  analytics: new MyAnalytics(),
});
```

### 3. Custom Localization

```typescript
import { LocalizationPort } from '@syngenta/product-check-core';

class MyLocalization implements LocalizationPort {
  private locale = 'en';

  t(key: string, params?: Record<string, string | number>): string {
    // Load from your translation system
    return myTranslations[this.locale][key] || key;
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }
}

const { verifyCode } = useProductVerification({
  client,
  localization: new MyLocalization(),
});
```

### 4. Custom Logging

```typescript
import { HttpBackendAdapter, ConsoleLogger } from '@syngenta/product-check-core';

const logger = new ConsoleLogger('debug'); // Log everything

const adapter = new HttpBackendAdapter({ baseUrl: '...', authToken: '...' }, logger);
```

### 5. Direct Adapter Usage

For advanced control, bypass BackendClient:

```typescript
import { HttpBackendAdapter } from '@syngenta/product-check-core';

const adapter = new HttpBackendAdapter({
  baseUrl: 'https://api.example.com',
  authToken: 'token',
  timeout: 30000,
  retryAttempts: 5,
  retryDelay: 2000,
});

const result = await adapter.verify({
  code: 'SYN-123',
  codeType: 'QR',
  retailerId: 'RETAILER-456',
});
```

## Compatibility

### Backward Compatibility

✅ **ProductScanner component** - Fully compatible, no changes needed

✅ **BackendClient basic usage** - Compatible with previous signature

⚠️ **useProductVerification** - Compatible but accepts new optional parameters

⚠️ **Config object** - `timeoutMs` renamed to `timeout`

### Forward Compatibility

All new ports (BackendPort, AnalyticsPort, etc.) are designed to be stable interfaces. You can implement them without breaking existing code.

## Troubleshooting

### Issue: Import errors after update

**Solution:** Rebuild packages

```bash
yarn build
```

### Issue: TypeScript errors about missing properties

**Solution:** Update your BackendClientConfig:

```typescript
// Change timeoutMs to timeout
{ baseUrl: '...', timeout: 5000 }
```

### Issue: Backend returns 404

**Solution:** Ensure your backend implements `/api/verify` endpoint

### Issue: Verification always returns error

**Solution:** Check your backend response format matches the expected schema

## Support

For questions or issues:

1. Check the [Architecture Design Doc](../../doc/ARCHITECTURE_DESIGN.md)
2. Review [examples](../../examples/)
3. Open an issue on GitHub

## Next Steps

- [ ] Update your backend to match new API contract
- [ ] Test with real API calls (no more mock data)
- [ ] Consider adding custom analytics
- [ ] Implement multi-language support with LocalizationPort
- [ ] Add logging for debugging
