/**
 * Groq AI Translation Service
 * Handles Roman Urdu to Urdu translation with content moderation
 * Now uses server-side API route to keep API keys secure
 */

class GroqService {
  /**
   * Translate Roman Urdu to Urdu script via our secure API route
   */
  async translateRomanToUrdu(romanText: string): Promise<{ success: boolean; urduText?: string; error?: string }> {
    // Validate input
    if (!romanText || !romanText.trim()) {
      return { success: false, error: 'Please enter some text to translate.' };
    }

    if (romanText.length > 1000) {
      return { success: false, error: 'Text is too long. Please limit to 1000 characters.' };
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ romanText }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Translation failed. Please try again.',
        };
      }

      return data;
    } catch (error) {
      console.error('Translation error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          return { success: false, error: 'Unable to connect to translation service. Please check your internet connection.' };
        }
        return { success: false, error: error.message };
      }
      
      return { success: false, error: 'An unexpected error occurred during translation.' };
    }
  }
}

export const groqService = new GroqService();
