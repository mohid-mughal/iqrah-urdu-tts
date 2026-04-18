/**
 * Integration tests for TransliterationService
 * Tests with actual sample sentences from requirements
 */

import { transliterationService } from '../services/transliteration.service';

describe('TransliterationService - Integration Tests', () => {
  describe('Sample sentences from requirements', () => {
    it('should handle Mohid NUST sentence in Urdu script', () => {
      const urduSentence = 'میرا نام محد ہے اور میں نیشنل یونیورسٹی آف سائنس اینڈ ٹیکنالوجی کا طالب علم ہوں';
      const result = transliterationService.romanToUrdu(urduSentence);
      
      // Should preserve the Urdu text exactly
      expect(result).toBe(urduSentence);
      expect(transliterationService.isUrduScript(result)).toBe(true);
    });

    it('should handle Ahmed NUST sentence in Urdu script', () => {
      const urduSentence = 'میرا نام احمد ہے اور میں نیشنل یونیورسٹی آف سائنس اینڈ ٹیکنالوجی کا طالب علم ہوں';
      const result = transliterationService.romanToUrdu(urduSentence);
      
      // Should preserve the Urdu text exactly
      expect(result).toBe(urduSentence);
      expect(transliterationService.isUrduScript(result)).toBe(true);
    });

    it('should convert Roman Urdu greeting to Urdu script', () => {
      const romanSentence = 'assalam o alaikum, aaj ka din bohat khoobsurat hai';
      const result = transliterationService.romanToUrdu(romanSentence);
      
      // Should produce Urdu script
      expect(transliterationService.isUrduScript(result)).toBe(true);
      expect(result).not.toBe(romanSentence);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle mixed Roman and Urdu text', () => {
      const mixed = 'Hello میرا نام world';
      const result = transliterationService.romanToUrdu(mixed);
      
      // Should preserve the Urdu part and convert Roman part
      expect(result).toContain('میرا نام');
      expect(transliterationService.isUrduScript(result)).toBe(true);
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should handle user typing Roman Urdu gradually', () => {
      // Simulate user typing character by character
      const inputs = ['m', 'me', 'mer', 'mera', 'mera ', 'mera n', 'mera na', 'mera naam'];
      
      inputs.forEach(input => {
        const result = transliterationService.romanToUrdu(input);
        expect(result).toBeTruthy();
        // Each result should be valid
        expect(result.length).toBeGreaterThan(0);
      });
    });

    it('should handle paste of Urdu text without modification', () => {
      const pastedUrdu = 'پاکستان کی ثقافت اور روایات بہت متنوع اور رنگارنگ ہیں';
      const result = transliterationService.romanToUrdu(pastedUrdu);
      
      // Should not modify pasted Urdu text
      expect(result).toBe(pastedUrdu);
    });

    it('should handle empty input gracefully', () => {
      expect(transliterationService.romanToUrdu('')).toBe('');
      expect(transliterationService.safeRomanToUrdu('')).toBe('');
    });

    it('should handle whitespace-only input', () => {
      const whitespace = '   \n\t  ';
      const result = transliterationService.romanToUrdu(whitespace);
      expect(result).toBe(whitespace);
    });

    it('should preserve formatting in multi-line text', () => {
      const multiline = 'line one\nline two\nline three';
      const result = transliterationService.romanToUrdu(multiline);
      
      // Should preserve newlines
      expect(result.split('\n').length).toBe(3);
    });
  });

  describe('Requirements validation', () => {
    // Requirement 1.1: Accept both Urdu script and Roman Urdu
    it('should accept both Urdu script and Roman Urdu (Req 1.1)', () => {
      const urdu = 'سلام';
      const roman = 'salam';
      
      expect(() => transliterationService.romanToUrdu(urdu)).not.toThrow();
      expect(() => transliterationService.romanToUrdu(roman)).not.toThrow();
    });

    // Requirement 1.2: Convert Roman to Urdu without modifying existing Urdu
    it('should convert Roman to Urdu without modifying existing Urdu (Req 1.2)', () => {
      const pureUrdu = 'میرا نام';
      const pureRoman = 'mera naam';
      const mixed = 'hello میرا نام world';
      
      // Pure Urdu should remain unchanged
      expect(transliterationService.romanToUrdu(pureUrdu)).toBe(pureUrdu);
      
      // Pure Roman should be converted
      const romanResult = transliterationService.romanToUrdu(pureRoman);
      expect(transliterationService.isUrduScript(romanResult)).toBe(true);
      
      // Mixed should preserve Urdu part
      const mixedResult = transliterationService.romanToUrdu(mixed);
      expect(mixedResult).toContain('میرا نام');
    });

    // Requirement 1.3: Preserve pasted Urdu script
    it('should preserve pasted Urdu script without modification (Req 1.3)', () => {
      const pastedUrdu = 'السلام علیکم، آج کا دن بہت خوبصورت ہے';
      const result = transliterationService.romanToUrdu(pastedUrdu);
      
      expect(result).toBe(pastedUrdu);
    });
  });

  describe('Graceful degradation', () => {
    it('should use safeRomanToUrdu for error handling', () => {
      const input = 'test input';
      const result = transliterationService.safeRomanToUrdu(input);
      
      // Should return a valid result
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle null or undefined gracefully', () => {
      // TypeScript would prevent this, but testing runtime behavior
      expect(transliterationService.romanToUrdu(null as any)).toBe(null);
      expect(transliterationService.romanToUrdu(undefined as any)).toBe(undefined);
    });
  });
});
