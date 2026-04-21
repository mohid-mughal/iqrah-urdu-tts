import { ModelConfig } from '@/types';

export const MODELS: Record<string, ModelConfig> = {
  standard: {
    id: 'standard',
    name: 'Standard Model',
    description: 'Trained without phonemes',
    endpoint: 'https://ahmedjaved812-urdu-tts-backend.hf.space/synthesize',
    trainingInfo: {
      // samples: 17000,
      corpus: '17K samples',
      phonemes: false,
    },
  },
  phoneme: {
    id: 'phoneme',
    name: 'Phoneme Model (Experimental)',
    description: 'Trained with word-based phonemization',
    endpoint: 'https://ahmedjaved812-urdu-tts-phonemes-backend.hf.space/synthesize',
    trainingInfo: {
      // samples: 120000,
      corpus: '120K samples',
      phonemes: true,
      limitation: 'This model was trained using word-based phonemization instead of character-based phonemization, which affects its ability to properly synthesize Urdu speech. This is documented as a learning experience for future research.',
    },
  },
  characterPhoneme: {
    id: 'characterPhoneme',
    name: 'Character Phoneme Model',
    description: 'Advanced model with character-based phonemization for accurate Urdu speech synthesis',
    endpoint: 'https://ahmedjaved812-urdu-tts-character-phonemes-backend.hf.space/synthesize',
    trainingInfo: {
      // samples: 50000,
      corpus: '50K unique samples',
      phonemes: true,
      phonemeType: 'character-based',
    },
  },
};
