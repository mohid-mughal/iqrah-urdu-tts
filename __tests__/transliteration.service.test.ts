import TransliterationService, { transliterationService } from '../services/transliteration.service';

describe('TransliterationService', () => {
  let service: TransliterationService;

  beforeEach(() => {
    service = new TransliterationService();
  });

  describe('isUrduScript', () => {
    it('should return true for Urdu text', () => {
      expect(service.isUrduScript('سلام')).toBe(true);
      expect(service.isUrduScript('میرا نام')).toBe(true);
      expect(service.isUrduScript('پاکستان')).toBe(true);
    });

    it('should return false for Roman text', () => {
      expect(service.isUrduScript('hello')).toBe(false);
      expect(service.isUrduScript('Pakistan')).toBe(false);
      expect(service.isUrduScript('abc123')).toBe(false);
    });

    it('should return true for mixed text with Urdu characters', () => {
      expect(service.isUrduScript('hello سلام')).toBe(true);
      expect(service.isUrduScript('123 پاکستان')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(service.isUrduScript('')).toBe(false);
    });

    it('should return false for numbers only', () => {
      expect(service.isUrduScript('123')).toBe(false);
    });
  });

  describe('romanToUrdu', () => {
    it('should convert basic Roman Urdu to Urdu script', () => {
      const result = service.romanToUrdu('salam');
      expect(service.isUrduScript(result)).toBe(true);
    });

    it('should preserve existing Urdu script', () => {
      const urduText = 'سلام';
      const result = service.romanToUrdu(urduText);
      expect(result).toBe(urduText);
    });

    it('should handle mixed Roman and Urdu text', () => {
      const mixed = 'hello سلام world';
      const result = service.romanToUrdu(mixed);
      // Should preserve the Urdu part
      expect(result).toContain('سلام');
    });

    it('should preserve spaces', () => {
      const result = service.romanToUrdu('mera naam');
      expect(result).toContain(' ');
    });

    it('should handle empty string', () => {
      expect(service.romanToUrdu('')).toBe('');
    });

    it('should handle multi-character combinations', () => {
      // 'kh' should map to خ
      const result = service.romanToUrdu('kh');
      expect(result).toBeTruthy();
    });

    it('should preserve punctuation', () => {
      const result = service.romanToUrdu('hello, world!');
      expect(result).toContain(',');
      expect(result).toContain('!');
    });

    it('should handle the required Mohid sentence', () => {
      const roman = 'mera naam mohid hai';
      const result = service.romanToUrdu(roman);
      expect(service.isUrduScript(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle the required Ahmed sentence', () => {
      const roman = 'mera naam ahmed hai';
      const result = service.romanToUrdu(roman);
      expect(service.isUrduScript(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should not modify pure Urdu text', () => {
      const urduText = 'میرا نام محد ہے';
      const result = service.romanToUrdu(urduText);
      expect(result).toBe(urduText);
    });
  });

  describe('safeRomanToUrdu', () => {
    it('should return transliterated text on success', () => {
      const result = service.safeRomanToUrdu('salam');
      expect(service.isUrduScript(result)).toBe(true);
    });

    it('should return original text if transliteration fails', () => {
      // Mock the romanToUrdu method to throw an error
      const originalMethod = service.romanToUrdu;
      service.romanToUrdu = jest.fn(() => {
        throw new Error('Test error');
      });

      const input = 'test';
      const result = service.safeRomanToUrdu(input);
      expect(result).toBe(input);

      // Restore original method
      service.romanToUrdu = originalMethod;
    });

    it('should handle empty string gracefully', () => {
      expect(service.safeRomanToUrdu('')).toBe('');
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(transliterationService).toBeInstanceOf(TransliterationService);
    });

    it('should work with the singleton instance', () => {
      const result = transliterationService.romanToUrdu('salam');
      expect(transliterationService.isUrduScript(result)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle text with only spaces', () => {
      const result = service.romanToUrdu('   ');
      expect(result).toBe('   ');
    });

    it('should handle text with numbers', () => {
      const result = service.romanToUrdu('123');
      expect(result).toBeTruthy();
    });

    it('should handle special characters', () => {
      const result = service.romanToUrdu('@#$%');
      expect(result).toBeTruthy();
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      const result = service.romanToUrdu(longText);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle text with newlines', () => {
      const result = service.romanToUrdu('line1\nline2');
      expect(result).toContain('\n');
    });
  });
});
