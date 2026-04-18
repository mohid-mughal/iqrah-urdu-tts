/**
 * Recording Service for microphone audio capture using MediaRecorder API
 * Handles permission requests, recording state, and audio blob conversion
 */

import { convertToWav } from '@/utils/audioConverter';

export class RecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private recording: boolean = false;

  /**
   * Request microphone permission from the browser
   * @returns Promise resolving to true if permission granted, false otherwise
   */
  async requestPermission(): Promise<boolean> {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaRecorder API is not supported in this browser');
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });

      // Permission granted - stop the stream for now
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      // Handle permission errors
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          throw new Error('Microphone access is required for voice recording. Please enable it in your browser settings.');
        }
        
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No microphone detected. Please connect a microphone and try again.');
        }
        
        // Re-throw other errors
        throw error;
      }
      
      return false;
    }
  }

  /**
   * Start recording audio from the microphone
   * @throws Error if permission not granted or recording fails
   */
  async startRecording(): Promise<void> {
    try {
      // Check if already recording
      if (this.recording) {
        throw new Error('Recording is already in progress');
      }

      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // Reset audio chunks
      this.audioChunks = [];

      // Create MediaRecorder instance
      // Try to use audio/webm first, fall back to browser default
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/wav';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ''; // Use browser default
        }
      }

      const options = mimeType ? { mimeType } : undefined;
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      // Handle data available event
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Handle recording errors
      this.mediaRecorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        this.cleanup();
        throw new Error('Recording failed. Please try again.');
      };

      // Start recording
      this.mediaRecorder.start();
      this.recording = true;
    } catch (error) {
      // Clean up on error
      this.cleanup();
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          throw new Error('Microphone access is required for voice recording. Please enable it in your browser settings.');
        }
        
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No microphone detected. Please connect a microphone and try again.');
        }
        
        throw error;
      }
      
      throw new Error('Recording failed. Please try again.');
    }
  }

  /**
   * Stop recording and return the recorded audio as a WAV Blob
   * @returns Promise resolving to WAV audio Blob
   * @throws Error if not currently recording
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // Check if recording
        if (!this.recording || !this.mediaRecorder) {
          reject(new Error('No recording in progress'));
          return;
        }

        // Handle stop event
        this.mediaRecorder.onstop = async () => {
          try {
            // Create blob from chunks
            const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
            const audioBlob = new Blob(this.audioChunks, { type: mimeType });

            // Verify we have audio data
            if (audioBlob.size === 0) {
              reject(new Error('No audio data recorded'));
              return;
            }

            // Convert to WAV format
            try {
              const wavBlob = await convertToWav(audioBlob);
              this.cleanup();
              resolve(wavBlob);
            } catch (conversionError) {
              this.cleanup();
              reject(new Error('Failed to convert audio to WAV format. Please try again.'));
            }
          } catch (error) {
            this.cleanup();
            reject(error instanceof Error ? error : new Error('Failed to process recorded audio'));
          }
        };

        // Stop the media recorder
        this.mediaRecorder.stop();
        this.recording = false;
      } catch (error) {
        this.cleanup();
        reject(error instanceof Error ? error : new Error('Failed to stop recording'));
      }
    });
  }

  /**
   * Check if currently recording
   * @returns true if recording is in progress, false otherwise
   */
  isRecording(): boolean {
    return this.recording;
  }

  /**
   * Clean up resources (stop tracks and reset state)
   */
  private cleanup(): void {
    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Reset state
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recording = false;
  }

  /**
   * Cancel recording and clean up without returning audio
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
    }
    this.cleanup();
  }
}

// Export singleton instance
export const recordingService = new RecordingService();
