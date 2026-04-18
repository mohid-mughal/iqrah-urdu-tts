// Core data models for Iqrah Urdu TTS application

export interface AppState {
  selectedModel: 'standard' | 'phoneme';
  inputText: string;
  referenceAudio: File | Blob | null;
  synthesizedAudio: Blob | null;
  isLoading: boolean;
  error: string | null;
  isRecording: boolean;
}

export interface ModelConfig {
  id: 'standard' | 'phoneme';
  name: string;
  description: string;
  endpoint: string;
  trainingInfo: {
    samples: number;
    phonemes: boolean;
    limitation?: string;
  };
}

export interface SampleSentence {
  id: string;
  urdu: string;
  roman: string;
  category?: string;
}
