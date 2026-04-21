// Core data models for Iqrah Urdu TTS application

export type TranslationMode = 'ai' | 'character';
export type ModelType = 'standard' | 'phoneme' | 'characterPhoneme';

export interface AppState {
  selectedModel: ModelType;
  inputText: string;
  referenceAudio: File | Blob | null;
  synthesizedAudio: Blob | null;
  isLoading: boolean;
  error: string | null;
  isRecording: boolean;
  translationMode: TranslationMode;
}

export interface ModelConfig {
  id: ModelType;
  name: string;
  description: string;
  endpoint: string;
  trainingInfo: {
    // samples: number;
    corpus: string;
    phonemes: boolean;
    phonemeType?: string;
    limitation?: string;
  };
}

export interface SampleSentence {
  id: string;
  urdu: string;
  roman: string;
  category?: string;
}
