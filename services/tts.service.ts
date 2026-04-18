/**
 * TTS Service for API communication with backend synthesis endpoints
 * Handles multipart form-data requests and binary WAV responses
 */

import { convertToWav } from '@/utils/audioConverter';

export interface SynthesisRequest {
  text: string;
  referenceAudio?: File | Blob;
  endpoint: string;
}

export interface SynthesisResponse {
  audioBlob: Blob;
}

export class TTSService {
  /**
   * Synthesize speech from text using the specified backend endpoint
   * @param request - Synthesis request containing text, optional reference audio, and endpoint
   * @returns Promise resolving to audio blob
   * @throws Error with user-friendly message on failure
   */
  async synthesize(request: SynthesisRequest): Promise<SynthesisResponse> {
    const { text, referenceAudio, endpoint } = request;

    try {
      // Construct multipart form-data
      const formData = new FormData();
      formData.append('text', text);

      // Include reference audio only if provided
      if (referenceAudio) {
        // Convert to WAV if not already in WAV format
        const wavAudio = await this.ensureWavFormat(referenceAudio);
        formData.append('reference_audio', wavAudio, 'reference.wav');
      }

      // Send POST request to backend
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      // Handle HTTP errors
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Extract binary WAV data
      const audioBlob = await response.blob();

      // Verify we received audio data
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty audio response from server');
      }

      return { audioBlob };
    } catch (error) {
      // Re-throw with user-friendly message
      throw this.formatError(error);
    }
  }

  /**
   * Ensure audio is in WAV format, converting if necessary
   * @param audio - Input audio file or blob
   * @returns Promise resolving to WAV blob
   */
  private async ensureWavFormat(audio: File | Blob): Promise<Blob> {
    try {
      return await convertToWav(audio);
    } catch (error) {
      throw new Error('Failed to convert audio to WAV format. Please upload a valid audio file or record audio directly.');
    }
  }

  /**
   * Check if the backend API is available
   * @param endpoint - Backend endpoint URL
   * @returns Promise resolving to true if healthy, false otherwise
   */
  async healthCheck(endpoint: string): Promise<boolean> {
    try {
      // Extract base URL from endpoint
      const url = new URL(endpoint);
      const baseUrl = `${url.protocol}//${url.host}`;

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        // Try to reach the health endpoint or root
        const response = await fetch(`${baseUrl}/health`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      // If health endpoint doesn't exist, try the main endpoint
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(endpoint, {
            method: 'OPTIONS',
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          return response.ok || response.status === 405; // 405 means endpoint exists but OPTIONS not allowed
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch {
        return false;
      }
    }
  }

  /**
   * Handle error responses from the backend API
   * @param response - Failed fetch response
   * @throws Error with appropriate message
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = 'Synthesis failed';

    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
    } catch {
      // If we can't parse the error, use status-based message
    }

    // Map status codes to user-friendly messages
    switch (response.status) {
      case 422:
        throw new Error(`Invalid input: ${errorMessage}`);
      case 500:
      case 502:
      case 503:
        throw new Error('The synthesis service is temporarily unavailable. Please try again later.');
      case 504:
        throw new Error('The request took too long. Please try with shorter text or try again.');
      default:
        throw new Error(`Synthesis failed: ${errorMessage}`);
    }
  }

  /**
   * Format errors into user-friendly messages
   * @param error - Error object
   * @returns Formatted Error
   */
  private formatError(error: unknown): Error {
    if (error instanceof Error) {
      // Check for network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return new Error('Unable to connect to the synthesis service. Please check your internet connection.');
      }
      
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return new Error('The request took too long. Please try with shorter text or try again.');
      }

      // Return the error as-is if it's already formatted
      return error;
    }

    // Unknown error type
    return new Error('An unexpected error occurred during synthesis');
  }
}

// Export singleton instance
export const ttsService = new TTSService();
