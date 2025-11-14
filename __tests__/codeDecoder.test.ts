import { CodeDecoder } from '../src/utils/codeDecoder';

describe('CodeDecoder', () => {
  describe('decode', () => {
    it('should decode valid Syngenta URL', () => {
      const result = CodeDecoder.decode('https://attx.syngenta.com/product?id=ABC123');
      
      expect(result.isValid).toBe(true);
      expect(result.trackingId).toBe('ABC123');
      expect(result.format).toBe('URL');
    });

    it('should return invalid for empty code', () => {
      const result = CodeDecoder.decode('');
      
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for non-Syngenta code', () => {
      const result = CodeDecoder.decode('https://example.com/product');
      
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCode', () => {
    it('should validate correct Syngenta code', () => {
      const validation = CodeDecoder.validateCode('https://attx.syngenta.com/product?id=TEST123');
      
      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should reject empty code', () => {
      const validation = CodeDecoder.validateCode('');
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Code is empty');
    });
  });

  describe('extractTrackingId', () => {
    it('should extract tracking ID from URL query parameter', () => {
      const trackingId = CodeDecoder.extractTrackingId(
        'https://attx.syngenta.com/product?id=XYZ789'
      );
      
      expect(trackingId).toBe('XYZ789');
    });

    it('should extract tracking ID from URL path', () => {
      const trackingId = CodeDecoder.extractTrackingId(
        'https://attx.syngenta.com/product/ABC123'
      );
      
      expect(trackingId).toBe('ABC123');
    });

    it('should return entire code if not a URL', () => {
      const trackingId = CodeDecoder.extractTrackingId('DIRECT123');
      
      expect(trackingId).toBe('DIRECT123');
    });
  });

  describe('isSyngentaCode', () => {
    it('should identify Syngenta URL', () => {
      expect(CodeDecoder.isSyngentaCode('https://syngenta.com/product')).toBe(true);
      expect(CodeDecoder.isSyngentaCode('https://attx.syngenta.com/product')).toBe(true);
    });

    it('should reject non-Syngenta URL', () => {
      expect(CodeDecoder.isSyngentaCode('https://example.com/product')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should identify valid URLs', () => {
      expect(CodeDecoder.isUrl('https://example.com')).toBe(true);
      expect(CodeDecoder.isUrl('http://example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(CodeDecoder.isUrl('not-a-url')).toBe(false);
      expect(CodeDecoder.isUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('detectFormat', () => {
    it('should detect URL format', () => {
      expect(CodeDecoder.detectFormat('https://example.com')).toBe('URL');
    });

    it('should detect numeric format', () => {
      expect(CodeDecoder.detectFormat('123456789')).toBe('NUMERIC');
    });

    it('should detect alphanumeric format', () => {
      expect(CodeDecoder.detectFormat('ABC123XYZ')).toBe('ALPHANUMERIC');
    });

    it('should return UNKNOWN for other formats', () => {
      expect(CodeDecoder.detectFormat('test-code-123')).toBe('UNKNOWN');
    });
  });
});
