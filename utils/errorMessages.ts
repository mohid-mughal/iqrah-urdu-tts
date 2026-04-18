/**
 * Utility functions for formatting user-friendly error messages
 * Provides consistent error messaging across the application
 */

export type ErrorType = 
  | 'api'
  | 'network'
  | 'recording'
  | 'file_upload'
  | 'validation'
  | 'unknown';

export interface ErrorContext {
  type: ErrorType;
  originalError?: Error | unknown;
  details?: string;
}

/**
 * Format an error into a user-friendly message
 * @param error - Error object or string
 * @param context - Additional context about the error
 * @returns User-friendly error message
 */
export function formatErrorMessage(
  error: Error | string | unknown,
  context?: ErrorContext
): string {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // If it's an Error object with a message, use that
  if (error instanceof Error) {
    return error.message;
  }

  // Use context to provide a default message
  if (context) {
    switch (context.type) {
      case 'api':
        return 'The synthesis service encountered an error. Please try again.';
      case 'network':
        return 'Unable to connect to the synthesis service. Please check your internet connection.';
      case 'recording':
        return 'Recording failed. Please check your microphone and try again.';
      case 'file_upload':
        return 'Unable to read the audio file. Please try another file.';
      case 'validation':
        return 'Invalid input. Please check your data and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Fallback message
  return 'An unexpected error occurred. Please try again.';
}

/**
 * API-specific error messages based on status codes
 */
export const API_ERROR_MESSAGES = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'Authentication required. Please log in and try again.',
  403: 'Access denied. You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  422: 'Invalid input. Please check your data and try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'The synthesis service is temporarily unavailable. Please try again later.',
  502: 'The synthesis service is temporarily unavailable. Please try again later.',
  503: 'The synthesis service is temporarily unavailable. Please try again later.',
  504: 'The request took too long. Please try with shorter text or try again.',
} as const;

/**
 * Recording-specific error messages
 */
export const RECORDING_ERROR_MESSAGES = {
  permission_denied: 'Microphone access is required for voice recording. Please enable it in your browser settings.',
  no_device: 'No microphone detected. Please connect a microphone and try again.',
  not_supported: 'Audio recording is not supported in this browser. Please try a different browser.',
  recording_failed: 'Recording failed. Please try again.',
  already_recording: 'Recording is already in progress.',
  no_recording: 'No recording in progress.',
  no_audio_data: 'No audio data recorded. Please try again.',
} as const;

/**
 * File upload error messages
 */
export const FILE_UPLOAD_ERROR_MESSAGES = {
  invalid_type: 'Please upload an audio file (WAV, MP3, FLAC, or OGG).',
  file_too_large: 'Audio file is too large. Please use a file under 10MB.',
  read_error: 'Unable to read the audio file. Please try another file.',
  no_file: 'No file selected. Please choose a file to upload.',
} as const;

/**
 * Get a user-friendly error message for API errors
 * @param statusCode - HTTP status code
 * @param defaultMessage - Default message if status code not found
 * @returns User-friendly error message
 */
export function getApiErrorMessage(
  statusCode: number,
  defaultMessage?: string
): string {
  return (
    API_ERROR_MESSAGES[statusCode as keyof typeof API_ERROR_MESSAGES] ||
    defaultMessage ||
    'An error occurred while communicating with the server.'
  );
}
