// Core exports
export * from './types';

// Ports (interfaces for dependency injection)
export * from './ports';

// Infrastructure (adapters)
export * from './infrastructure';

// API & Backend
export * from './api/BackendClient';

// Hooks
export * from './hooks/useProductVerification';

// Theme
export * from './theme/ThemeProvider';
export * from './theme/defaultTheme';
export * from './theme/types';

// Utilities
export * from './utils';

// Error codes
export * from './verification/errorCodes';

// React Native specific exports
export * from './scanner/ProductScanner';
export * from './service/ProductVerificationService';
export * from './service/useVerificationService';
export * from './camera';
export * from './screens';
export { createProductVerificationService } from './service/ProductVerificationService';
