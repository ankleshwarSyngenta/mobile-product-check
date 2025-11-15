/**
 * Port interface for localization
 */
export interface LocalizationPort {
  /**
   * Translate a key with optional parameters
   */
  t(key: string, params?: Record<string, string | number>): string;

  /**
   * Change locale
   */
  setLocale?(locale: string): void;

  /**
   * Get current locale
   */
  getLocale?(): string;
}

/**
 * Simple default localization with English messages
 */
export class DefaultLocalization implements LocalizationPort {
  private messages: Record<string, string> = {
    'verification.success': 'This product is authentic and registered with Syngenta.',
    'verification.error': 'Verification failed. Please try again.',
    'verification.warning': 'Potential counterfeit detected. Please escalate to Syngenta.',
    'verification.scanning': 'Scanning code...',
    'verification.noCamera': 'Camera permission denied',
    'verification.na': 'N/A',
    'error.code.0': 'Tracking id is not available.',
    'error.code.1': 'Code scanned multiple times. Contact Syngenta.',
    'error.code.2': 'Tracking id is not available.',
    'error.code.3': 'Tracking ID is not active.',
    'error.code.4': 'Invalid mandatory input values.',
    'error.code.5': 'Missing mandatory input values.',
    'error.code.6': 'Invalid Tracking ID.',
    'error.code.7': 'Tracking ID is blacklisted.',
    'error.code.8': 'Authentication for code has failed.',
    'error.code.9': 'Turkey product with valid format.',
    'error.code.10': 'GTIN does not exist.',
    'error.code.11': 'Serial Number does not exist.',
    'error.code.12': 'Tracking ID is stolen.',
  };

  t(key: string, params?: Record<string, string | number>): string {
    let message = this.messages[key] || key;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        message = message.replace(`{{${key}}}`, String(value));
      });
    }

    return message;
  }
}
