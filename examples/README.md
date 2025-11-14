# Examples

This directory contains usage examples for the @syngenta/mobile-product-check package.

## Available Examples

### 1. BasicUsage.tsx
Simple implementation showing the minimal setup required to use the scanner.

**Features:**
- Direct scanner integration
- Basic configuration
- Callback handlers

**Best for:** Quick integration, testing, proof of concept

---

### 2. WithHomeScreen.tsx
Complete app example with a home screen and navigation to the scanner.

**Features:**
- Home screen with instructions
- Conditional rendering
- User-friendly interface
- "How it works" guide

**Best for:** Production apps, user-facing applications

---

### 3. AdvancedUsage.tsx
Advanced implementation with additional features.

**Features:**
- Language selector (6 languages)
- Scan history
- Product list display
- Persistent data
- Enhanced UI

**Best for:** Enterprise applications, complex workflows

---

### 4. ProgrammaticVerification.tsx
Using the API programmatically without the UI component.

**Features:**
- Direct API usage
- ProductVerificationService
- CodeDecoder utilities
- Custom UI integration

**Best for:** Custom UI implementations, backend integration

## Running Examples

### Copy Example to Your Project

```bash
# Copy desired example
cp examples/BasicUsage.tsx YourApp.tsx

# Install dependencies
npm install
```

### Modify Configuration

Update the API configuration in each example:

```typescript
const config = {
  apiBaseUrl: 'YOUR_API_URL',
  apiKey: 'YOUR_API_KEY',
  // ...
};
```

### Run Your App

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## Customization Tips

### Styling
Each example uses StyleSheet for styling. Modify the `styles` object to match your brand.

### Callbacks
Customize the callback handlers to fit your app's flow:

```typescript
onSuccess: (data) => {
  // Your custom success logic
  navigation.navigate('ProductDetails', { product: data });
},
```

### Localization
Change the default language or add custom translations:

```typescript
config={{
  locale: 'es', // Spanish
  // ...
}}
```

## Integration Patterns

### With React Navigation

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

const config = {
  // ...
  onSuccess: (data) => {
    navigation.navigate('Details', { product: data });
  },
};
```

### With Redux

```typescript
import { useDispatch } from 'react-redux';
import { setProduct } from './store/productSlice';

const dispatch = useDispatch();

const config = {
  // ...
  onSuccess: (data) => {
    dispatch(setProduct(data));
  },
};
```

### With Context API

```typescript
import { useContext } from 'react';
import { ProductContext } from './context/ProductContext';

const { setCurrentProduct } = useContext(ProductContext);

const config = {
  // ...
  onSuccess: (data) => {
    setCurrentProduct(data);
  },
};
```

## Common Scenarios

### Scenario: Add to Existing App
Use `WithHomeScreen.tsx` as a starting point and integrate into your navigation.

### Scenario: Custom Branding
Start with `BasicUsage.tsx` and customize the UI styling.

### Scenario: Multi-language App
Use `AdvancedUsage.tsx` and implement language switching.

### Scenario: Backend Integration Only
Use `ProgrammaticVerification.tsx` for API-only usage.

## Troubleshooting

### Example Not Working
- Ensure all dependencies are installed
- Check API configuration
- Verify camera permissions

### Import Errors
```bash
npm install @syngenta/mobile-product-check react-native-vision-camera
```

### TypeScript Errors
```bash
npm install --save-dev @types/react @types/react-native
```

## Need Help?

- Check the main [README.md](../README.md)
- Review [API Documentation](../API.md)
- See [Setup Guide](../SETUP.md)
- Open an issue on GitHub

## Contributing Examples

Have a useful example? Contribute it!

1. Create your example file
2. Add documentation
3. Test thoroughly
4. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
