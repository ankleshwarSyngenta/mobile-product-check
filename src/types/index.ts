/**
 * Product information returned after successful verification
 */
export interface ProductDetails {
  productName: string;
  serialNumber: string;
  producedDate: string;
  expiryDate: string;
  batchNumber: string;
  rawMaterialBatchNumber: string;
  manufacturer?: string;
  marketedBy?: string;
}

/**
 * Verification result types
 */
export enum VerificationStatus {
  SUCCESS = 'SUCCESS',
  NON_SYNGENTA = 'NON_SYNGENTA',
  COUNTERFEIT_WARNING = 'COUNTERFEIT_WARNING',
  ERROR = 'ERROR',
}

/**
 * Error codes from Standard Scan API
 */
export enum ErrorCode {
  TRACKING_ID_NOT_AVAILABLE = 0,
  CODE_SCANNED_MULTIPLE_TIMES = 1,
  TRACKING_ID_NOT_AVAILABLE_2 = 2,
  TRACKING_ID_NOT_ACTIVE = 3,
  INVALID_MANDATORY_INPUT = 4,
  MISSING_MANDATORY_INPUT = 5,
  INVALID_TRACKING_ID = 6,
  TRACKING_ID_BLACKLISTED = 7,
  AUTHENTICATION_FAILED = 8,
  TURKEY_PRODUCT_VALID_FORMAT = 9,
  GTIN_DOES_NOT_EXIST = 10,
  SN_DOES_NOT_EXIST = 11,
  TRACKING_ID_STOLEN = 12,
}

/**
 * API error response
 */
export interface ApiError {
  errorCode: ErrorCode;
  message: string;
  details?: string;
}

/**
 * Verification response from API
 */
export interface VerificationResponse {
  status: VerificationStatus;
  data?: ProductDetails;
  error?: ApiError;
  scanCount?: number;
  isCounterfeitWarning?: boolean;
}

/**
 * Scanner configuration options
 */
export interface ScannerConfig {
  apiBaseUrl: string;
  apiKey?: string;
  locale?: string;
  counterfeitThreshold?: number;
  counterfeitCheckPeriodDays?: number;
  onSuccess?: (data: ProductDetails) => void;
  onError?: (error: ApiError) => void;
  onCounterfeitWarning?: (data: ProductDetails, scanCount: number) => void;
}

/**
 * Scanner camera options
 */
export interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
  aspectRatio?: number;
}

/**
 * Decoded QR/2D matrix code result
 */
export interface DecodedResult {
  text: string;
  format?: string;
  isValid: boolean;
  trackingId?: string;
  url?: string;
}

/**
 * Localization strings
 */
export interface LocaleStrings {
  scanPrompt: string;
  scanningInProgress: string;
  productAuthentic: string;
  productName: string;
  serialNumber: string;
  producedDate: string;
  expiryDate: string;
  batchNumber: string;
  rawMaterialBatchNumber: string;
  manufacturer: string;
  marketedBy: string;
  notAvailable: string;
  nonSyngentaProduct: string;
  counterfeitWarning: string;
  counterfeitWarningMessage: string;
  scanAnother: string;
  errorOccurred: string;
  cameraAccessDenied: string;
  cameraNotAvailable: string;
  close: string;
}
