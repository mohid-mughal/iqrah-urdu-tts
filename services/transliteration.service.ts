/**
 * TransliterationService
 * 
 * Provides Roman Urdu to Urdu script transliteration functionality.
 * Handles detection of existing Urdu text to avoid double conversion.
 */

interface TransliterationMapping {
  [key: string]: string;
}

class TransliterationService {
  private readonly urduMapping: TransliterationMapping;

  constructor() {
    // Comprehensive Roman to Urdu character mapping
    // Ordered by length (longest first) to handle multi-character sequences
    this.urduMapping = {
      // Special combinations (must come before individual characters)
      'kh': 'خ',
      'gh': 'غ',
      'sh': 'ش',
      'ch': 'چ',
      'th': 'ٹھ',
      'dh': 'ڈھ',
      'bh': 'بھ',
      'ph': 'پھ',
      'rh': 'ڑھ',
      
      // Aspirated consonants
      'Kh': 'خ',
      'Gh': 'غ',
      'Sh': 'ش',
      'Ch': 'چ',
      'Th': 'ٹھ',
      'Dh': 'ڈھ',
      'Bh': 'بھ',
      'Ph': 'پھ',
      'Rh': 'ڑھ',
      
      // Consonants
      'a': 'ا',
      'b': 'ب',
      'p': 'پ',
      't': 'ت',
      'T': 'ٹ',
      'j': 'ج',
      'c': 'چ',
      'h': 'ح',
      'd': 'د',
      'D': 'ڈ',
      'r': 'ر',
      'R': 'ڑ',
      'z': 'ز',
      's': 'س',
      'x': 'ش',
      'S': 'ص',
      'Z': 'ض',
      'q': 'ق',
      'k': 'ک',
      'g': 'گ',
      'l': 'ل',
      'm': 'م',
      'n': 'ن',
      'N': 'ں',
      'w': 'و',
      'v': 'و',
      'y': 'ی',
      'e': 'ے',
      'f': 'ف',
      
      // Vowels and diacritics
      'aa': 'آ',
      'A': 'ع',
      'i': 'ی',
      'u': 'و',
      'o': 'و',
      
      // Numbers
      '0': '۰',
      '1': '۱',
      '2': '۲',
      '3': '۳',
      '4': '۴',
      '5': '۵',
      '6': '۶',
      '7': '۷',
      '8': '۸',
      '9': '۹',
    };
  }

  /**
   * Checks if a string contains Urdu script characters
   * @param text - The text to check
   * @returns true if the text contains Urdu characters
   */
  isUrduScript(text: string): boolean {
    if (!text) return false;
    
    // Urdu Unicode ranges:
    // 0600-06FF: Arabic (includes Urdu)
    // 0750-077F: Arabic Supplement
    // FB50-FDFF: Arabic Presentation Forms-A
    // FE70-FEFF: Arabic Presentation Forms-B
    const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return urduRegex.test(text);
  }

  /**
   * Converts Roman Urdu text to Urdu script
   * Preserves existing Urdu script characters
   * @param text - The Roman Urdu text to convert
   * @returns The converted Urdu script text
   */
  romanToUrdu(text: string): string {
    if (!text) return text;

    // If the entire text is already in Urdu script, return as-is
    if (this.isUrduScript(text) && !this.hasLatinCharacters(text)) {
      return text;
    }

    let result = '';
    let i = 0;

    while (i < text.length) {
      const char = text[i];
      
      // If current character is already Urdu script, preserve it
      if (this.isUrduScript(char)) {
        result += char;
        i++;
        continue;
      }

      // Preserve spaces and punctuation
      if (char === ' ' || this.isPunctuation(char)) {
        result += char;
        i++;
        continue;
      }

      // Try to match multi-character sequences first
      let matched = false;
      
      // Check for 2-character combinations
      if (i + 1 < text.length) {
        const twoChar = text.substring(i, i + 2);
        if (this.urduMapping[twoChar]) {
          result += this.urduMapping[twoChar];
          i += 2;
          matched = true;
          continue;
        }
      }

      // Check for single character
      if (!matched && this.urduMapping[char]) {
        result += this.urduMapping[char];
        i++;
        continue;
      }

      // If no mapping found, preserve the original character
      result += char;
      i++;
    }

    return result;
  }

  /**
   * Checks if text contains Latin characters
   * @param text - The text to check
   * @returns true if the text contains Latin characters
   */
  private hasLatinCharacters(text: string): boolean {
    return /[a-zA-Z]/.test(text);
  }

  /**
   * Checks if a character is punctuation
   * @param char - The character to check
   * @returns true if the character is punctuation
   */
  private isPunctuation(char: string): boolean {
    const punctuationRegex = /[.,!?;:'"()[\]{}\-–—…]/;
    return punctuationRegex.test(char);
  }

  /**
   * Graceful degradation handler
   * Returns the original text if transliteration fails
   * @param text - The text to transliterate
   * @returns The transliterated text or original text on failure
   */
  safeRomanToUrdu(text: string): string {
    try {
      return this.romanToUrdu(text);
    } catch (error) {
      console.error('Transliteration failed, returning original text:', error);
      return text;
    }
  }
}

// Export singleton instance
export const transliterationService = new TransliterationService();
export default TransliterationService;
