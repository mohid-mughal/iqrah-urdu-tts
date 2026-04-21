import { MODELS } from '@/config/models';
import { ModelType } from '@/types';

interface ModelTabsProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export default function ModelTabs({ selectedModel, onModelChange }: ModelTabsProps) {
  const standardModel = MODELS.standard;
  const phonemeModel = MODELS.phoneme;
  const characterPhonemeModel = MODELS.characterPhoneme;

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b-2 border-gray-200" role="tablist" aria-label="TTS Model Selection">
        <button
          onClick={() => onModelChange('standard')}
          className={`flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-base md:text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2 ${
            selectedModel === 'standard'
              ? 'text-pakistan-green border-b-4 border-pakistan-green -mb-0.5 bg-green-50'
              : 'text-gray-600 hover:text-pakistan-lightGreen hover:bg-gray-50'
          }`}
          aria-selected={selectedModel === 'standard'}
          aria-controls="standard-panel"
          role="tab"
          id="standard-tab"
          tabIndex={selectedModel === 'standard' ? 0 : -1}
        >
          <span className="hidden sm:inline">{standardModel.name}</span>
          <span className="sm:hidden">Standard</span>
        </button>
        <button
          onClick={() => onModelChange('phoneme')}
          className={`flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-base md:text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2 ${
            selectedModel === 'phoneme'
              ? 'text-pakistan-green border-b-4 border-pakistan-green -mb-0.5 bg-green-50'
              : 'text-gray-600 hover:text-pakistan-lightGreen hover:bg-gray-50'
          }`}
          aria-selected={selectedModel === 'phoneme'}
          aria-controls="phoneme-panel"
          role="tab"
          id="phoneme-tab"
          tabIndex={selectedModel === 'phoneme' ? 0 : -1}
        >
          <span className="hidden sm:inline">{phonemeModel.name}</span>
          <span className="sm:hidden">Phoneme</span>
        </button>
        <button
          onClick={() => onModelChange('characterPhoneme')}
          className={`flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-base md:text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2 ${
            selectedModel === 'characterPhoneme'
              ? 'text-pakistan-green border-b-4 border-pakistan-green -mb-0.5 bg-green-50'
              : 'text-gray-600 hover:text-pakistan-lightGreen hover:bg-gray-50'
          }`}
          aria-selected={selectedModel === 'characterPhoneme'}
          aria-controls="character-phoneme-panel"
          role="tab"
          id="character-phoneme-tab"
          tabIndex={selectedModel === 'characterPhoneme' ? 0 : -1}
        >
          <span className="hidden md:inline">{characterPhonemeModel.name}</span>
          <span className="md:hidden">Char-Phoneme</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        {selectedModel === 'standard' && (
          <div 
            role="tabpanel" 
            id="standard-panel"
            aria-labelledby="standard-tab"
            className="space-y-2 sm:space-y-3"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-pakistan-green">
              {standardModel.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {standardModel.description}
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Training Corpus:</span>
              <span>{standardModel.trainingInfo.corpus}</span>
            </div>
          </div>
        )}

        {selectedModel === 'phoneme' && (
          <div 
            role="tabpanel" 
            id="phoneme-panel"
            aria-labelledby="phoneme-tab"
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-pakistan-green">
              {phonemeModel.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {phonemeModel.description}
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Training Corpus:</span>
              <span>{phonemeModel.trainingInfo.corpus}</span>
            </div>
            
            {/* Educational message about limitation */}
            {phonemeModel.trainingInfo.limitation && (
              <div 
                className="mt-3 sm:mt-4 p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r"
                role="note"
                aria-label="Research limitation note"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg 
                    className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-amber-800 mb-1">
                      Research Note
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                      {phonemeModel.trainingInfo.limitation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedModel === 'characterPhoneme' && (
          <div 
            role="tabpanel" 
            id="character-phoneme-panel"
            aria-labelledby="character-phoneme-tab"
            className="space-y-2 sm:space-y-3"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-pakistan-green">
              {characterPhonemeModel.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {characterPhonemeModel.description}
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Training Corpus:</span>
              <span>{characterPhonemeModel.trainingInfo.corpus}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Phonemization:</span>
              <span className="capitalize">{characterPhonemeModel.trainingInfo.phonemeType}</span>
            </div>
            
            {/* Success message */}
            <div 
              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border-l-4 border-green-400 rounded-r"
              role="note"
              aria-label="Model improvement note"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <svg 
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-green-800 mb-1">
                    Improved Accuracy
                  </h4>
                  <p className="text-xs sm:text-sm text-green-900 leading-relaxed">
                    This model uses character-based phonemization for more accurate Urdu speech synthesis, addressing the limitations found in the word-based approach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
