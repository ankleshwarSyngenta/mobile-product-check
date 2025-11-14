# Setup Guide

This guide will walk you through setting up the Syngenta Mobile Product Check module in your React Native application.

## Prerequisites

- Node.js 14.x or later
- React Native 0.64.x or later
- iOS 11+ or Android SDK 21+
- Xcode 12+ (for iOS development)
- Android Studio (for Android development)

## Step 1: Installation

Install the package and its peer dependencies:

```bash
npm install @syngenta/mobile-product-check react-native-vision-camera
# or
yarn add @syngenta/mobile-product-check react-native-vision-camera
```

## Step 2: iOS Setup

### 2.1 Install CocoaPods

```bash
cd ios
pod install
cd ..
```

### 2.2 Configure Info.plist

Add camera permission to `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan product QR codes for verification</string>
```

### 2.3 Update Minimum Deployment Target

Ensure minimum iOS deployment target is 11.0 or higher in `ios/Podfile`:

```ruby
platform :ios, '11.0'
```

## Step 3: Android Setup

### 3.1 Update AndroidManifest.xml

Add camera permission to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application>
        <!-- ... -->
    </application>
</manifest>
```

### 3.2 Update build.gradle

Ensure minimum SDK version is 21 or higher in `android/build.gradle`:

```gradle
buildscript {
    ext {
        minSdkVersion = 21
        compileSdkVersion = 33
        targetSdkVersion = 33
    }
}
```

### 3.3 Enable Java 8 (if not already enabled)

In `android/app/build.gradle`:

```gradle
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

## Step 4: Configuration

Create a configuration file for your scanner:

```typescript
// config/scannerConfig.ts
import { ScannerConfig } from '@syngenta/mobile-product-check';

export const scannerConfig: ScannerConfig = {
  apiBaseUrl: 'https://api.syngenta.com', // Your API base URL
  apiKey: process.env.SYNGENTA_API_KEY,   // Your API key (use environment variables)
  locale: 'en',                             // Default language
  counterfeitThreshold: 10,                 // Scans before counterfeit warning
  counterfeitCheckPeriodDays: 365,          // Check period (1 year)
  
  // Callback handlers
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
```

## Step 5: Basic Implementation

### 5.1 Create Scanner Screen

```typescript
// screens/ProductScannerScreen.tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { ProductScanner } from '@syngenta/mobile-product-check';
import { scannerConfig } from '../config/scannerConfig';

export default function ProductScannerScreen() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {!showScanner ? (
        <Button 
          title="Scan Product" 
          onPress={() => setShowScanner(true)} 
        />
      ) : (
        <ProductScanner
          config={scannerConfig}
          onClose={() => setShowScanner(false)}
        />
      )}
    </View>
  );
}
```

### 5.2 Add to Navigation

If using React Navigation:

```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductScannerScreen from './screens/ProductScannerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Scanner" 
          component={ProductScannerScreen}
          options={{ title: 'Product Check' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Step 6: Request Camera Permissions

### iOS

Permissions are requested automatically when the camera is accessed.

### Android

Request permissions at runtime:

```typescript
import { PermissionsAndroid, Platform } from 'react-native';

async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs camera access to scan product QR codes',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}
```

## Step 7: Environment Variables

Create `.env` file for sensitive configuration:

```bash
# .env
SYNGENTA_API_KEY=your-api-key-here
SYNGENTA_API_BASE_URL=https://api.syngenta.com
```

Install `react-native-config`:

```bash
npm install react-native-config
```

Update config to use environment variables:

```typescript
import Config from 'react-native-config';

export const scannerConfig = {
  apiBaseUrl: Config.SYNGENTA_API_BASE_URL,
  apiKey: Config.SYNGENTA_API_KEY,
  // ...
};
```

## Step 8: Testing

### Run on iOS

```bash
npx react-native run-ios
```

### Run on Android

```bash
npx react-native run-android
```

## Step 9: Build for Production

### iOS

1. Open `ios/YourApp.xcworkspace` in Xcode
2. Select your team and provisioning profile
3. Archive and upload to App Store Connect

### Android

```bash
cd android
./gradlew assembleRelease
```

The APK will be at `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

### Camera not working on iOS

- Check that `NSCameraUsageDescription` is in Info.plist
- Verify camera permissions in device Settings > Your App
- Restart the app after adding permissions

### Camera not working on Android

- Check that `CAMERA` permission is in AndroidManifest.xml
- Request runtime permissions explicitly
- Check device Settings > Apps > Your App > Permissions

### Build errors

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android

# For iOS
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

### Metro bundler issues

```bash
# Reset Metro cache
npx react-native start --reset-cache
```

## Advanced Configuration

### Custom Styling

Wrap the component with custom styling:

```typescript
<View style={{ flex: 1, backgroundColor: '#custom' }}>
  <ProductScanner config={config} />
</View>
```

### Multi-language Support

```typescript
const [language, setLanguage] = useState('en');

const config = {
  ...scannerConfig,
  locale: language,
};

// Change language
<Button title="Español" onPress={() => setLanguage('es')} />
```

### Offline Mode

Implement offline caching with AsyncStorage:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheVerification = async (trackingId: string, data: ProductDetails) => {
  await AsyncStorage.setItem(`product_${trackingId}`, JSON.stringify(data));
};

const getCachedVerification = async (trackingId: string) => {
  const cached = await AsyncStorage.getItem(`product_${trackingId}`);
  return cached ? JSON.parse(cached) : null;
};
```

## Support

For issues and questions:
- GitHub: https://github.com/syngenta/mobile-product-check
- Email: support@syngenta.com

## Next Steps

- Review [API Documentation](./API.md)
- Check [Examples](./examples/)
- Read [Contributing Guidelines](./CONTRIBUTING.md)
