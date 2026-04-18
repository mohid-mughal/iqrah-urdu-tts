'use client';

import { useState, useRef, useEffect } from 'react';
import { recordingService } from '@/services/recording.service';

interface AudioControlsProps {
  onFileUpload: (file: File) => void;
  onRecordingComplete: (audioBlob: Blob) => void;
  referenceAudio: File | Blob | null;
  onRemoveAudio: () => void;
  disabled?: boolean;
}

export default function AudioControls({
  onFileUpload,
  onRecordingComplete,
  referenceAudio,
  onRemoveAudio,
  disabled = false,
}: AudioControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate audio duration when reference audio changes
  useEffect(() => {
    if (!referenceAudio) {
      setAudioDuration(null);
      setAudioFileName(null);
      return;
    }

    // Set filename if it's a File
    if (referenceAudio instanceof File) {
      setAudioFileName(referenceAudio.name);
    } else {
      setAudioFileName('Recorded Audio');
    }

    // Calculate duration
    const audio = new Audio();
    const url = URL.createObjectURL(referenceAudio);
    
    const handleLoadedMetadata = () => {
      // Check if duration is valid (not Infinity or NaN)
      if (audio.duration && isFinite(audio.duration) && !isNaN(audio.duration)) {
        setAudioDuration(audio.duration);
      } else {
        // For recorded audio, duration might not be available immediately
        setAudioDuration(null);
      }
      URL.revokeObjectURL(url);
    };

    const handleError = () => {
      setAudioDuration(null);
      URL.revokeObjectURL(url);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.src = url;

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      URL.revokeObjectURL(url);
    };
  }, [referenceAudio]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type - prefer WAV format
      const validTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/flac', 'audio/ogg'];
      const validExtensions = ['.wav', '.mp3', '.flac', '.ogg'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        setRecordingError('Please upload an audio file. WAV format is recommended for best results.');
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setRecordingError('Audio file is too large. Please use a file under 10MB.');
        return;
      }

      // Warn if not WAV format
      if (!file.type.includes('wav') && !fileExtension.includes('.wav')) {
        setRecordingError('Note: Non-WAV files will be automatically converted. For best results, use WAV format.');
        // Still allow the upload, just show a warning
      } else {
        setRecordingError(null);
      }
      
      onFileUpload(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      // Stop recording
      try {
        const audioBlob = await recordingService.stopRecording();
        setIsRecording(false);
        setRecordingError(null);
        onRecordingComplete(audioBlob);
      } catch (error) {
        setIsRecording(false);
        setRecordingError(error instanceof Error ? error.message : 'Failed to stop recording');
      }
    } else {
      // Start recording
      try {
        setRecordingError(null);
        await recordingService.startRecording();
        setIsRecording(true);
      } catch (error) {
        setIsRecording(false);
        setRecordingError(error instanceof Error ? error.message : 'Failed to start recording');
      }
    }
  };

  const handleRemoveAudio = () => {
    setRecordingError(null);
    setAudioDuration(null);
    setAudioFileName(null);
    onRemoveAudio();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* File Upload Button */}
        <button
          onClick={handleUploadClick}
          disabled={disabled || isRecording}
          className={`
            flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-sm sm:text-base
            bg-white border-2 border-pakistan-green text-pakistan-green
            rounded-lg font-medium
            hover:bg-pakistan-green hover:text-white
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-pakistan-green
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2
            touch-manipulation
            active:scale-98
          `}
          aria-label="Upload audio file for voice cloning"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="hidden xs:inline">Upload Audio</span>
          <span className="xs:hidden">Upload</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".wav,.mp3,.flac,.ogg,audio/wav,audio/mpeg,audio/flac,audio/ogg"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Audio file input for voice cloning"
          id="audio-file-input"
        />

        {/* Microphone Recording Button */}
        <button
          onClick={handleRecordClick}
          disabled={disabled}
          className={`
            flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-sm sm:text-base
            rounded-lg font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            touch-manipulation
            active:scale-98
            ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
                : 'bg-pakistan-green text-white hover:bg-pakistan-lightGreen focus:ring-pakistan-green'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          aria-label={isRecording ? 'Stop recording audio' : 'Start recording audio for voice cloning'}
          aria-pressed={isRecording}
        >
          {isRecording ? (
            <>
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="hidden xs:inline">Stop Recording</span>
              <span className="xs:hidden">Stop</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span className="hidden xs:inline">Record Audio</span>
              <span className="xs:hidden">Record</span>
            </>
          )}
        </button>
      </div>

      {/* Recording Error Display */}
      {recordingError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
          <p className="text-xs sm:text-sm text-red-700 break-words">{recordingError}</p>
        </div>
      )}

      {/* Reference Audio Display */}
      {referenceAudio && (
        <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-pakistan-green flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {audioFileName}
                  </p>
                  {audioDuration !== null && isFinite(audioDuration) && !isNaN(audioDuration) ? (
                    <p className="text-xs text-gray-500">
                      Duration: {formatDuration(audioDuration)}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Ready to use
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveAudio}
              disabled={disabled}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Remove reference audio"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs sm:text-sm text-gray-600" id="audio-controls-help">
        <p>
          Upload an audio file (WAV format recommended) or record your voice for voice cloning. Audio will be automatically converted to WAV format if needed. The synthesized speech will mimic the reference voice.
        </p>
      </div>
    </div>
  );
}
