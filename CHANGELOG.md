# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-14

### Added
- Initial release of @syngenta/mobile-product-check
- React Native camera integration using react-native-vision-camera
- QR code and 2D matrix code scanning support
- Product verification with Syngenta Standard Scan API
- Support for all 13 error codes from API
- Counterfeit detection with configurable threshold (default 10 scans)
- Multi-language support (English, Spanish, Portuguese, French, German, Chinese)
- i18n localization framework
- TypeScript support with full type definitions
- Product details display:
  - Product Name
  - Serial Number
  - Produced Date
  - Expiry Date
  - Batch Number
  - Raw Material Batch Number
  - Manufacturer
  - Marketed By
- Success, error, and counterfeit warning screens
- Callback handlers (onSuccess, onError, onCounterfeitWarning)
- Code decoder utility
- Product verification service
- Comprehensive documentation
- API reference documentation
- Setup guide
- Usage examples (basic, with home screen, advanced, programmatic)
- Jest test setup
- ESLint and Prettier configuration
- MIT License

### Features
- ✅ Camera permission handling for iOS and Android
- ✅ Automatic QR code detection and scanning
- ✅ Real-time product verification
- ✅ Offline-ready architecture
- ✅ Configurable counterfeit detection period (default 1 year)
- ✅ "Scan Another Product" functionality
- ✅ Clean and modern UI with styled components
- ✅ Framework-agnostic API (can be used with React Native)
- ✅ Full TypeScript support

### Documentation
- Comprehensive README with installation and usage instructions
- API documentation with all types, interfaces, and methods
- Setup guide for iOS and Android
- Multiple usage examples
- Contribution guidelines
- Troubleshooting guide

## [Unreleased]

### Planned
- Unit tests coverage for all components
- Integration tests
- Performance optimizations
- Batch scanning support
- Scan history persistence
- Analytics integration
- Dark mode support
- Custom theme support
- Additional language support
- Barcode format support beyond QR codes
- Offline product database caching
- React Native Web support
- Expo compatibility

---

## Version History

- **1.0.0** - Initial release (November 14, 2025)

## Migration Guides

### Upgrading to 1.0.0

This is the initial release. No migration needed.

## Support

For questions or issues, please:
- Open an issue on [GitHub](https://github.com/syngenta/mobile-product-check/issues)
- Contact support at support@syngenta.com

[1.0.0]: https://github.com/syngenta/mobile-product-check/releases/tag/v1.0.0
[Unreleased]: https://github.com/syngenta/mobile-product-check/compare/v1.0.0...HEAD
