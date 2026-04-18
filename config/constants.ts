// API endpoints and configuration constants

export const API_ENDPOINTS = {
  STANDARD_MODEL: 'https://ahmedjaved812-urdu-tts-backend.hf.space/synthesize',
  PHONEME_MODEL: 'https://ahmedjaved812-urdu-tts-phonemes-backend.hf.space/synthesize',
} as const;

export const AUDIO_CONFIG = {
  ACCEPTED_FORMATS: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/flac', 'audio/ogg'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  RECORDING_MIME_TYPE: 'audio/webm',
} as const;

export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  MAX_TEXT_LENGTH: 1000,
  LOADING_TIMEOUT: 30000, // 30 seconds
} as const;
