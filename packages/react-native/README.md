# @syngenta/product-check-react-native

React Native product verification scanner SDK for Syngenta products.

## Installation

```bash
npm install @syngenta/product-check-react-native react-native-vision-camera
# or
yarn add @syngenta/product-check-react-native react-native-vision-camera
```

## Usage

```tsx
import { ProductScanner } from '@syngenta/product-check-react-native';

<ProductScanner onResult={(r) => console.log(r)} />;
```

## Dependencies

This package requires:

- `react-native-vision-camera` for camera functionality
- `@syngenta/product-check-core` for shared verification logic

## API

- `ProductScanner` component: Triggers camera-based QR code scanning
- `createProductVerificationService(config)` returns service with `scan(code)` method

## Notes

For React Web applications, use `@syngenta/product-check-react-web` instead.
