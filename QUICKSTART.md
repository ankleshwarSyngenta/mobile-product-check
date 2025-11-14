# 🚀 Quick Start Guide

Get started with @syngenta/mobile-product-check in 5 minutes!

## Step 1: Install (2 minutes)

```bash
# Install the package
npm install @syngenta/mobile-product-check react-native-vision-camera

# iOS only - install pods
cd ios && pod install && cd ..
```

## Step 2: Configure Permissions (1 minute)

### iOS - Add to `ios/YourApp/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Scan product QR codes</string>
```

### Android - Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## Step 3: Add Scanner (2 minutes)

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { ProductScanner } from '@syngenta/mobile-product-check';

export default function App() {
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
          config={{
            apiBaseUrl: 'https://api.syngenta.com',
            apiKey: 'your-api-key',
            locale: 'en',
            onSuccess: (data) => {
              console.log('Product:', data);
              setShowScanner(false);
            },
            onError: (error) => {
              console.error('Error:', error);
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

## Step 4: Run

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## That's it! 🎉

Your product scanner is ready to use!

## Next Steps

- 📖 Read the [Full Documentation](./README.md)
- 🔧 Check [Setup Guide](./SETUP.md) for advanced configuration
- 💡 Browse [Examples](./examples/) for more use cases
- 📚 Review [API Documentation](./API.md)

## Common Issues

### Camera not working?
- iOS: Check Info.plist permissions
- Android: Check AndroidManifest.xml permissions
- Both: Restart app after adding permissions

### Build errors?
```bash
# Clean build
cd android && ./gradlew clean && cd ..
cd ios && rm -rf Pods && pod install && cd ..
```

### Import errors?
```bash
npm install --save-dev @types/react @types/react-native
```

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report an Issue](https://github.com/syngenta/mobile-product-check/issues)
- 📧 Email: support@syngenta.com

---

**Ready to scan? Start now! 📱✨**
