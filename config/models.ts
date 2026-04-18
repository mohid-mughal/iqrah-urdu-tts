import { ModelConfig } from '@/types';

export const MODELS: Record<string, ModelConfig> = {
  standard: {
    id: 'standard',
    name: 'Standard Model',
    description: 'Trained on 17,000 samples without phonemes',
    endpoint: 'https://ahmedjaved812-urdu-tts-backend.hf.space/synthesize',
    trainingInfo: {
      samples: 17000,
      phonemes: false,
    },
  },
  phoneme: {
    id: 'phoneme',
    name: 'Phoneme Model (Experimental)',
    description: 'Trained on 120,000 samples with word-based phonemization',
    endpoint: 'https://ahmedjaved812-urdu-tts-phonemes-backend.hf.space/synthesize',
    trainingInfo: {
      samples: 120000,
      phonemes: true,
      limitation: 'This model was trained using word-based phonemization instead of character-based phonemization, which affects its ability to properly synthesize Urdu speech. This is documented as a learning experience for future research.',
    },
  },
};
