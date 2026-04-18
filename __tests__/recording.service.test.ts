/**
 * Unit tests for Recording Service
 */

import { RecordingService } from '@/services/recording.service';

// Mock BlobEvent (not available in jsdom)
class MockBlobEvent extends Event {
  data: Blob;
  
  constructor(type: string, eventInitDict: { data: Blob }) {
    super(type);
    this.data = eventInitDict.data;
  }
}

// Make BlobEvent available globally
(global as any).BlobEvent = MockBlobEvent;

// Mock MediaRecorder
class MockMediaRecorder {
  state: 'inactive' | 'recording' | 'paused' = 'inactive';
  ondataavailable: ((event: BlobEvent) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  mimeType: string;

  constructor(stream: MediaStream, options?: { mimeType?: string }) {
    this.mimeType = options?.mimeType || 'audio/webm';
  }

  start() {
    this.state = 'recording';
    // Simulate data available after a short delay
    setTimeout(() => {
      if (this.ondataavailable) {
        const blob = new Blob(['audio data'], { type: this.mimeType });
        this.ondataavailable(new BlobEvent('dataavailable', { data: blob }));
      }
    }, 10);
  }

  stop() {
    this.state = 'inactive';
    setTimeout(() => {
      if (this.onstop) {
        this.onstop();
      }
    }, 10);
  }

  static isTypeSupported(mimeType: string): boolean {
    return mimeType === 'audio/webm' || mimeType === 'audio/wav';
  }
}

// Mock MediaStream
class MockMediaStream {
  private tracks: MediaStreamTrack[] = [];

  constructor() {
    this.tracks = [
      {
        stop: jest.fn(),
        kind: 'audio',
      } as unknown as MediaStreamTrack,
    ];
  }

  getTracks() {
    return this.tracks;
  }
}

describe('RecordingService', () => {
  let service: RecordingService;
  let mockGetUserMedia: jest.Mock;

  beforeEach(() => {
    service = new RecordingService();
    
    // Mock getUserMedia
    mockGetUserMedia = jest.fn();
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia,
      },
      writable: true,
      configurable: true,
    });

    // Mock MediaRecorder
    (global as any).MediaRecorder = MockMediaRecorder;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPermission', () => {
    it('should return true when permission is granted', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      const result = await service.requestPermission();

      expect(result).toBe(true);
      expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
      expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
    });

    it('should throw error when permission is denied', async () => {
      const error = new Error('Permission denied');
      error.name = 'NotAllowedError';
      mockGetUserMedia.mockRejectedValue(error);

      await expect(service.requestPermission()).rejects.toThrow(
        'Microphone access is required for voice recording'
      );
    });

    it('should throw error when no microphone is found', async () => {
      const error = new Error('No device found');
      error.name = 'NotFoundError';
      mockGetUserMedia.mockRejectedValue(error);

      await expect(service.requestPermission()).rejects.toThrow(
        'No microphone detected'
      );
    });

    it('should throw error when MediaRecorder API is not supported', async () => {
      Object.defineProperty(global.navigator, 'mediaDevices', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      await expect(service.requestPermission()).rejects.toThrow(
        'MediaRecorder API is not supported'
      );
    });
  });

  describe('startRecording', () => {
    it('should start recording successfully', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      await service.startRecording();

      expect(service.isRecording()).toBe(true);
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
    });

    it('should throw error if already recording', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      await service.startRecording();

      await expect(service.startRecording()).rejects.toThrow(
        'Recording is already in progress'
      );
    });

    it('should throw error when permission is denied', async () => {
      const error = new Error('Permission denied');
      error.name = 'NotAllowedError';
      mockGetUserMedia.mockRejectedValue(error);

      await expect(service.startRecording()).rejects.toThrow(
        'Microphone access is required for voice recording'
      );
      expect(service.isRecording()).toBe(false);
    });

    it('should throw error when no microphone is found', async () => {
      const error = new Error('No device found');
      error.name = 'NotFoundError';
      mockGetUserMedia.mockRejectedValue(error);

      await expect(service.startRecording()).rejects.toThrow(
        'No microphone detected'
      );
      expect(service.isRecording()).toBe(false);
    });
  });

  describe('stopRecording', () => {
    it('should stop recording and return audio blob', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      await service.startRecording();
      
      // Wait for recording to start
      await new Promise(resolve => setTimeout(resolve, 20));

      const audioBlob = await service.stopRecording();

      expect(audioBlob).toBeInstanceOf(Blob);
      expect(audioBlob.size).toBeGreaterThan(0);
      expect(service.isRecording()).toBe(false);
      expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
    });

    it('should throw error if not recording', async () => {
      await expect(service.stopRecording()).rejects.toThrow(
        'No recording in progress'
      );
    });

    it('should throw error if no audio data recorded', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      // Mock MediaRecorder that doesn't produce data
      class EmptyMediaRecorder extends MockMediaRecorder {
        start() {
          this.state = 'recording';
          // Don't call ondataavailable
        }
      }
      (global as any).MediaRecorder = EmptyMediaRecorder;

      await service.startRecording();
      
      await expect(service.stopRecording()).rejects.toThrow(
        'No audio data recorded'
      );
    });
  });

  describe('isRecording', () => {
    it('should return false initially', () => {
      expect(service.isRecording()).toBe(false);
    });

    it('should return true when recording', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      await service.startRecording();

      expect(service.isRecording()).toBe(true);
    });

    it('should return false after stopping', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      await service.startRecording();
      await new Promise(resolve => setTimeout(resolve, 20));
      await service.stopRecording();

      expect(service.isRecording()).toBe(false);
    });
  });

  describe('cancelRecording', () => {
    it('should cancel recording and clean up', async () => {
      const mockStream = new MockMediaStream();
      mockGetUserMedia.mockResolvedValue(mockStream);

      await service.startRecording();
      service.cancelRecording();

      expect(service.isRecording()).toBe(false);
      expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
    });

    it('should not throw error if not recording', () => {
      expect(() => service.cancelRecording()).not.toThrow();
    });
  });
});
