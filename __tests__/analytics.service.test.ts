/**
 * Unit tests for Analytics Service
 */

import { AnalyticsService, analyticsService } from '@/services/analytics.service';

// Mock @vercel/analytics
jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
}));

import { track } from '@vercel/analytics';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  const mockTrack = track as jest.MockedFunction<typeof track>;

  beforeEach(() => {
    service = new AnalyticsService();
    mockTrack.mockClear();
  });

  describe('trackSynthesis', () => {
    it('should track synthesis event with model and reference audio flag', () => {
      service.trackSynthesis('standard', true);

      expect(mockTrack).toHaveBeenCalledWith('synthesis', {
        model: 'standard',
        hasReferenceAudio: true,
        timestamp: expect.any(String),
      });
    });

    it('should track synthesis without reference audio', () => {
      service.trackSynthesis('phoneme', false);

      expect(mockTrack).toHaveBeenCalledWith('synthesis', {
        model: 'phoneme',
        hasReferenceAudio: false,
        timestamp: expect.any(String),
      });
    });

    it('should not throw error if tracking fails', () => {
      mockTrack.mockImplementationOnce(() => {
        throw new Error('Analytics error');
      });

      expect(() => {
        service.trackSynthesis('standard', true);
      }).not.toThrow();
    });
  });

  describe('trackModelSwitch', () => {
    it('should track model switch event', () => {
      service.trackModelSwitch('phoneme');

      expect(mockTrack).toHaveBeenCalledWith('model_switch', {
        model: 'phoneme',
        timestamp: expect.any(String),
      });
    });

    it('should not throw error if tracking fails', () => {
      mockTrack.mockImplementationOnce(() => {
        throw new Error('Analytics error');
      });

      expect(() => {
        service.trackModelSwitch('standard');
      }).not.toThrow();
    });
  });

  describe('trackVoiceCloning', () => {
    it('should track voice cloning with upload method', () => {
      service.trackVoiceCloning('upload');

      expect(mockTrack).toHaveBeenCalledWith('voice_cloning', {
        method: 'upload',
        timestamp: expect.any(String),
      });
    });

    it('should track voice cloning with recording method', () => {
      service.trackVoiceCloning('recording');

      expect(mockTrack).toHaveBeenCalledWith('voice_cloning', {
        method: 'recording',
        timestamp: expect.any(String),
      });
    });

    it('should not throw error if tracking fails', () => {
      mockTrack.mockImplementationOnce(() => {
        throw new Error('Analytics error');
      });

      expect(() => {
        service.trackVoiceCloning('upload');
      }).not.toThrow();
    });
  });

  describe('trackEvent', () => {
    it('should track custom event with properties', () => {
      service.trackEvent({
        name: 'custom_event',
        properties: { key: 'value' },
      });

      expect(mockTrack).toHaveBeenCalledWith('custom_event', { key: 'value' });
    });

    it('should track custom event without properties', () => {
      service.trackEvent({ name: 'simple_event' });

      expect(mockTrack).toHaveBeenCalledWith('simple_event', undefined);
    });

    it('should not throw error if tracking fails', () => {
      mockTrack.mockImplementationOnce(() => {
        throw new Error('Analytics error');
      });

      expect(() => {
        service.trackEvent({ name: 'test_event' });
      }).not.toThrow();
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(analyticsService).toBeInstanceOf(AnalyticsService);
    });
  });

  describe('error resilience', () => {
    it('should continue functioning after multiple tracking failures', () => {
      // First call fails
      mockTrack.mockImplementationOnce(() => {
        throw new Error('First error');
      });
      service.trackSynthesis('standard', true);

      // Second call succeeds
      mockTrack.mockImplementationOnce(() => {});
      service.trackModelSwitch('phoneme');

      // Third call fails
      mockTrack.mockImplementationOnce(() => {
        throw new Error('Third error');
      });
      service.trackVoiceCloning('upload');

      // All calls should complete without throwing
      expect(mockTrack).toHaveBeenCalledTimes(3);
    });
  });
});
