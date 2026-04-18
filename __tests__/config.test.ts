import { MODELS } from '@/config/models';
import { SAMPLE_SENTENCES } from '@/config/samples';
import { API_ENDPOINTS, AUDIO_CONFIG, UI_CONFIG } from '@/config/constants';

describe('Configuration', () => {
  describe('MODELS', () => {
    it('should have standard and phoneme models', () => {
      expect(MODELS.standard).toBeDefined();
      expect(MODELS.phoneme).toBeDefined();
    });

    it('should have correct standard model configuration', () => {
      expect(MODELS.standard.id).toBe('standard');
      expect(MODELS.standard.name).toBe('Standard Model');
      expect(MODELS.standard.trainingInfo.samples).toBe(17000);
      expect(MODELS.standard.trainingInfo.phonemes).toBe(false);
      expect(MODELS.standard.endpoint).toContain('urdu-tts-backend');
    });

    it('should have correct phoneme model configuration', () => {
      expect(MODELS.phoneme.id).toBe('phoneme');
      expect(MODELS.phoneme.name).toBe('Phoneme Model (Experimental)');
      expect(MODELS.phoneme.trainingInfo.samples).toBe(120000);
      expect(MODELS.phoneme.trainingInfo.phonemes).toBe(true);
      expect(MODELS.phoneme.trainingInfo.limitation).toBeDefined();
      expect(MODELS.phoneme.endpoint).toContain('urdu-tts-phonemes-backend');
    });
  });

  describe('SAMPLE_SENTENCES', () => {
    it('should have at least 6 sample sentences', () => {
      expect(SAMPLE_SENTENCES.length).toBeGreaterThanOrEqual(6);
    });

    it('should include Mohid sentence', () => {
      const mohidSentence = SAMPLE_SENTENCES.find(s => s.id === 'mohid');
      expect(mohidSentence).toBeDefined();
      expect(mohidSentence?.urdu).toContain('محد');
      expect(mohidSentence?.urdu).toContain('نیشنل یونیورسٹی');
    });

    it('should include Ahmed sentence', () => {
      const ahmedSentence = SAMPLE_SENTENCES.find(s => s.id === 'ahmed');
      expect(ahmedSentence).toBeDefined();
      expect(ahmedSentence?.urdu).toContain('احمد');
      expect(ahmedSentence?.urdu).toContain('نیشنل یونیورسٹی');
    });

    it('should have both urdu and roman text for each sentence', () => {
      SAMPLE_SENTENCES.forEach(sentence => {
        expect(sentence.urdu).toBeTruthy();
        expect(sentence.roman).toBeTruthy();
        expect(sentence.id).toBeTruthy();
      });
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have standard and phoneme endpoints', () => {
      expect(API_ENDPOINTS.STANDARD_MODEL).toContain('https://');
      expect(API_ENDPOINTS.PHONEME_MODEL).toContain('https://');
    });
  });

  describe('AUDIO_CONFIG', () => {
    it('should have accepted audio formats', () => {
      expect(AUDIO_CONFIG.ACCEPTED_FORMATS).toContain('audio/wav');
      expect(AUDIO_CONFIG.ACCEPTED_FORMATS).toContain('audio/mp3');
      expect(AUDIO_CONFIG.ACCEPTED_FORMATS.length).toBeGreaterThan(0);
    });

    it('should have max file size defined', () => {
      expect(AUDIO_CONFIG.MAX_FILE_SIZE).toBeGreaterThan(0);
    });
  });

  describe('UI_CONFIG', () => {
    it('should have mobile breakpoint defined', () => {
      expect(UI_CONFIG.MOBILE_BREAKPOINT).toBe(768);
    });

    it('should have max text length defined', () => {
      expect(UI_CONFIG.MAX_TEXT_LENGTH).toBeGreaterThan(0);
    });
  });
});
