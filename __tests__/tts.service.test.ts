/**
 * Unit tests for TTS Service
 */

import { TTSService } from '@/services/tts.service';

describe('TTSService', () => {
  let service: TTSService;

  beforeEach(() => {
    service = new TTSService();
  });

  describe('synthesize', () => {
    it('should construct multipart form-data with text only', async () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' });
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: async () => mockBlob,
      });

      const result = await service.synthesize({
        text: 'Test text',
        endpoint: 'https://example.com/synthesize',
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://example.com/synthesize',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
      expect(result.audioBlob).toBe(mockBlob);
    });

    it('should include reference audio when provided', async () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' });
      const referenceAudio = new Blob(['reference'], { type: 'audio/wav' });
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: async () => mockBlob,
      });

      await service.synthesize({
        text: 'Test text',
        referenceAudio,
        endpoint: 'https://example.com/synthesize',
      });

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      const formData = callArgs[1].body as FormData;
      
      expect(formData.has('text')).toBe(true);
      expect(formData.has('reference_audio')).toBe(true);
    });

    it('should throw user-friendly error on network failure', async () => {
      global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(
        service.synthesize({
          text: 'Test text',
          endpoint: 'https://example.com/synthesize',
        })
      ).rejects.toThrow('Unable to connect to the synthesis service');
    });

    it('should handle 422 validation errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 422,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Text is required' }),
      });

      await expect(
        service.synthesize({
          text: '',
          endpoint: 'https://example.com/synthesize',
        })
      ).rejects.toThrow('Invalid input: Text is required');
    });

    it('should handle 500 server errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Headers(),
        text: async () => 'Internal server error',
      });

      await expect(
        service.synthesize({
          text: 'Test text',
          endpoint: 'https://example.com/synthesize',
        })
      ).rejects.toThrow('The synthesis service is temporarily unavailable');
    });

    it('should handle timeout errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 504,
        headers: new Headers(),
        text: async () => 'Gateway timeout',
      });

      await expect(
        service.synthesize({
          text: 'Test text',
          endpoint: 'https://example.com/synthesize',
        })
      ).rejects.toThrow('The request took too long');
    });

    it('should throw error on empty audio response', async () => {
      const emptyBlob = new Blob([], { type: 'audio/wav' });
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: async () => emptyBlob,
      });

      await expect(
        service.synthesize({
          text: 'Test text',
          endpoint: 'https://example.com/synthesize',
        })
      ).rejects.toThrow('Received empty audio response from server');
    });
  });

  describe('healthCheck', () => {
    it('should return true when health endpoint is available', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
      });
      global.fetch = mockFetch;

      const result = await service.healthCheck('https://example.com/synthesize');
      
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/health',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should return false when endpoint is unavailable', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await service.healthCheck('https://example.com/synthesize');
      
      expect(result).toBe(false);
    });

    it('should return true when OPTIONS returns 405', async () => {
      const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('Health endpoint not found'))
        .mockResolvedValueOnce({
          ok: false,
          status: 405,
        });
      global.fetch = mockFetch;

      const result = await service.healthCheck('https://example.com/synthesize');
      
      expect(result).toBe(true);
    });
  });
});
