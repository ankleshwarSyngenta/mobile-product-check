export const DEFAULT_COUNTERFEIT_THRESHOLD = 10;
export const DEFAULT_COUNTERFEIT_CHECK_PERIOD_DAYS = 365;
export const DEFAULT_LOCALE = 'en';

export const ERROR_MESSAGES: Record<number, string> = {
  0: 'Tracking id is not available.',
  1: 'Code scanned multiple times. Contact Syngenta.',
  2: 'Tracking id is not available.',
  3: 'Tracking ID is not active.',
  4: 'Invalid mandatory input values.',
  5: 'Missing mandatory input values.',
  6: 'Invalid Tracking ID.',
  7: 'Tracking ID is blacklisted.',
  8: 'Authentication for code has failed.',
  9: 'ID is a Turkey product with valid format.',
  10: 'GTIN does not exist.',
  11: 'SN does not exist.',
  12: 'Tracking ID is stolen.',
};

export const SYNGENTA_QR_PATTERNS = [
  /syngenta\.com/i,
  /attx\.syngenta/i,
  // Add more patterns as needed
];

export const CAMERA_CONSTRAINTS = {
  video: {
    facingMode: 'environment',
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
};
