/**
 * Code decoder utility for extracting product information from scanned codes
 * Supports QR, DataMatrix, EAN, UPC formats
 */

export interface DecodedCodeData {
  trackingId?: string;
  gtin?: string;
  serialNumber?: string;
  batchNumber?: string;
  expiryDate?: string;
  raw: string;
  codeType: 'QR' | 'DataMatrix' | 'EAN' | 'UPC' | 'Unknown';
  isValid: boolean;
  validationError?: string;
}

/**
 * Decode a scanned code string into structured data
 */
export function decodeCode(rawCode: string): DecodedCodeData {
  if (!rawCode || rawCode.trim().length === 0) {
    return {
      raw: rawCode,
      codeType: 'Unknown',
      isValid: false,
      validationError: 'Empty code',
    };
  }

  const trimmedCode = rawCode.trim();

  // Try to detect code type and extract data
  if (trimmedCode.startsWith('SYN-') || trimmedCode.includes('syngenta')) {
    return decodeSyngentaQR(trimmedCode);
  }

  if (trimmedCode.length === 13 && /^\d{13}$/.test(trimmedCode)) {
    return decodeEAN13(trimmedCode);
  }

  if (trimmedCode.length === 12 && /^\d{12}$/.test(trimmedCode)) {
    return decodeUPC(trimmedCode);
  }

  // Check for GS1 DataMatrix format
  if (trimmedCode.includes('\u001d') || /^\d{2}/.test(trimmedCode)) {
    return decodeGS1DataMatrix(trimmedCode);
  }

  // Default to QR with raw data
  return {
    raw: trimmedCode,
    trackingId: trimmedCode,
    codeType: 'QR',
    isValid: true,
  };
}

/**
 * Decode Syngenta-specific QR code format
 */
function decodeSyngentaQR(code: string): DecodedCodeData {
  // Example format: SYN-TRACKINGID-SERIALNUMBER
  const parts = code.split('-');
  
  if (parts.length >= 2) {
    return {
      raw: code,
      trackingId: parts.slice(1).join('-'),
      serialNumber: parts[parts.length - 1],
      codeType: 'QR',
      isValid: true,
    };
  }

  return {
    raw: code,
    trackingId: code,
    codeType: 'QR',
    isValid: true,
  };
}

/**
 * Decode EAN-13 barcode
 */
function decodeEAN13(code: string): DecodedCodeData {
  // Validate EAN-13 checksum
  const isValid = validateEAN13Checksum(code);

  return {
    raw: code,
    gtin: code,
    codeType: 'EAN',
    isValid,
    validationError: isValid ? undefined : 'Invalid EAN-13 checksum',
  };
}

/**
 * Decode UPC-A barcode
 */
function decodeUPC(code: string): DecodedCodeData {
  // Convert UPC to GTIN-13 by adding leading zero
  const gtin = '0' + code;
  const isValid = validateEAN13Checksum(gtin);

  return {
    raw: code,
    gtin,
    codeType: 'UPC',
    isValid,
    validationError: isValid ? undefined : 'Invalid UPC checksum',
  };
}

/**
 * Decode GS1 DataMatrix format
 * Format: (01)GTIN(21)SERIAL(10)BATCH(17)YYMMDD
 */
function decodeGS1DataMatrix(code: string): DecodedCodeData {
  const result: DecodedCodeData = {
    raw: code,
    codeType: 'DataMatrix',
    isValid: false,
  };

  // Split by GS1 separator or parse Application Identifiers
  const parts = code.split('\u001d');
  const workingCode = parts.join('');

  // Extract GTIN (01)
  const gtinMatch = workingCode.match(/01(\d{14})/);
  if (gtinMatch) {
    result.gtin = gtinMatch[1];
    result.isValid = true;
  }

  // Extract Serial Number (21)
  const serialMatch = workingCode.match(/21([A-Z0-9]+)/);
  if (serialMatch) {
    result.serialNumber = serialMatch[1];
  }

  // Extract Batch (10)
  const batchMatch = workingCode.match(/10([A-Z0-9]+)/);
  if (batchMatch) {
    result.batchNumber = batchMatch[1];
  }

  // Extract Expiry Date (17)
  const expiryMatch = workingCode.match(/17(\d{6})/);
  if (expiryMatch) {
    const dateStr = expiryMatch[1];
    // Format YYMMDD to YYYY-MM-DD
    const year = parseInt(dateStr.substring(0, 2)) + 2000;
    const month = dateStr.substring(2, 4);
    const day = dateStr.substring(4, 6);
    result.expiryDate = `${year}-${month}-${day}`;
  }

  if (!result.gtin) {
    result.validationError = 'Missing GTIN in DataMatrix';
  }

  return result;
}

/**
 * Validate EAN-13 checksum
 */
function validateEAN13Checksum(code: string): boolean {
  if (code.length !== 13 || !/^\d{13}$/.test(code)) {
    return false;
  }

  const digits = code.split('').map(Number);
  const checkDigit = digits.pop()!;
  
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }
  
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return calculatedCheckDigit === checkDigit;
}

/**
 * Validate code format before sending to backend
 */
export function validateCodeFormat(code: string): { isValid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { isValid: false, error: 'Code is empty' };
  }

  if (code.length > 500) {
    return { isValid: false, error: 'Code too long' };
  }

  // Basic sanity check
  // eslint-disable-next-line no-control-regex
  if (!/^[A-Za-z0-9\-_./\u001d]+$/.test(code)) {
    return { isValid: false, error: 'Code contains invalid characters' };
  }

  return { isValid: true };
}
