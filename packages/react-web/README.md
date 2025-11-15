# @syngenta/product-check-react-web

React Web product verification scanner SDK for Syngenta products.

## Installation

```bash
npm install @syngenta/product-check-react-web
# or
yarn add @syngenta/product-check-react-web
```

## Usage

```tsx
import { ProductScanner } from '@syngenta/product-check-react-web';

<ProductScanner onResult={(r) => console.log(r)} />;
```

## Dependencies

This package requires:

- `@syngenta/product-check-core` for shared verification logic

## API

- `ProductScanner` component: Triggers web camera-based QR code scanning
- `createProductVerificationService(config)` returns service with `scan(code)` method

## Notes

For React Native applications, use `@syngenta/product-check-react-native` instead.
