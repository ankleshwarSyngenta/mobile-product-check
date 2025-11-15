export const ERROR_CODE_MESSAGES: Record<number, string> = {
  0: 'Tracking id is not available.',
  1: 'Code scanned multiple times. Contact Syngenta.',
  2: 'Tracking id is not available.',
  3: 'Tracking ID is not active.',
  4: 'Invalid mandatory input values.', // Could append dynamic list
  5: 'Missing mandatory input values.',
  6: 'Invalid Tracking ID.',
  7: 'Tracking ID is blacklisted.',
  8: 'Authentication for code has failed.',
  9: 'Turkey product with valid format.',
  10: 'GTIN does not exist.',
  11: 'SN does not exist.',
  12: 'Tracking ID is stolen.',
};

export function mapErrorCodeToMessage(code: number): string | undefined {
  return ERROR_CODE_MESSAGES[code];
}
