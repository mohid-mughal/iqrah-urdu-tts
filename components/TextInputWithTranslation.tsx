'use client';

import { ChangeEvent, useState, useEffect, useRef, useMemo } from 'react';
import { transliterationService } from '@/services/transliteration.service';
import { groqService } from '@/services/groq.service';
import { rateLimitService } from '@/services/rateLimit.service';
import { TranslationMode } from '@/types';

interface TextInputWithTranslationProps {
  value: string;
  onChange: (text: string) => void;
  translationMode: TranslationMode;
  onTranslationModeChange: (mode: TranslationMode) => void;
  disabled?: boolean;
}

export default function TextInputWithTranslation({
  value,
  onChange,
  translationMode,
  onTranslationModeChange,
  disabled = false,
}: TextInputWithTranslationProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isInEditMode, setIsInEditMode] = useState(false); // Track if user is editing translated text
  const [hasTranslated, setHasTranslated] = useState(false); // Track if AI translation was used
  const previousValueRef = useRef<string>(''); // Track previous value to detect changes

  // Memoize the disabled state to ensure consistency between server and client
  const isButtonDisabled = useMemo(() => {
    return disabled || isTranslating || value.trim().length === 0;
  }, [disabled, isTranslating, value]);

  // Detect if text contains Urdu characters
  const hasUrduCharacters = (text: string): boolean => {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
  };

  // Determine text direction based on content
  const getTextDirection = useMemo(() => {
    // If text contains Urdu characters, use RTL
    if (hasUrduCharacters(value)) {
      return 'rtl';
    }
    // Otherwise use LTR for English/Roman input
    return 'ltr';
  }, [value]);

  // Monitor value changes to detect when user clears text
  useEffect(() => {
    // If text is cleared (empty or very short), reset to input mode
    if (value.trim().length === 0) {
      setIsInEditMode(false);
      setHasTranslated(false);
    }
    // If text was cleared and user starts typing English/Roman again
    else if (previousValueRef.current.length > 0 && value.length < 5 && !hasUrduCharacters(value)) {
      setIsInEditMode(false);
      setHasTranslated(false);
    }
    
    previousValueRef.current = value;
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    
    // In AI mode with smart editing
    if (translationMode === 'ai') {
      // If we're in edit mode (after translation), apply character-based transliteration
      if (isInEditMode && hasTranslated) {
        const transliteratedText = transliterationService.safeRomanToUrdu(inputText);
        onChange(transliteratedText);
      } else {
        // Before translation, just pass through the text as-is
        onChange(inputText);
      }
    } 
    // In character mode, always apply transliteration
    else if (translationMode === 'character') {
      const transliteratedText = transliterationService.safeRomanToUrdu(inputText);
      onChange(transliteratedText);
    }
    
    // Clear any previous translation errors
    setTranslationError(null);
  };

  const handleAITranslation = async () => {
    if (!value.trim()) {
      setTranslationError('Please enter some text to translate.');
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      // Check rate limit
      const rateLimitCheck = await rateLimitService.checkRateLimit();
      if (!rateLimitCheck.allowed) {
        setTranslationError(rateLimitCheck.reason || 'Rate limit exceeded');
        setIsTranslating(false);
        return;
      }

      // Record the request
      await rateLimitService.recordRequest();

      // Translate using Groq
      const result = await groqService.translateRomanToUrdu(value);

      if (result.success && result.urduText) {
        onChange(result.urduText);
        setTranslationError(null);
        // Enable edit mode after successful translation
        setHasTranslated(true);
        setIsInEditMode(true);
      } else {
        setTranslationError(result.error || 'Translation failed');
      }
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsTranslating(false);
    }
  };

  const getPlaceholder = () => {
    if (translationMode === 'ai') {
      if (isInEditMode && hasTranslated) {
        return 'Edit your Urdu text (type in English/Roman to add more)...';
      }
      return 'Type in Roman Urdu (e.g., "mujhe khana pasand hai") then click "Translate to Urdu via AI"... ';
    } else {
      return 'Type in English/Roman Urdu - automatic character-based conversion to Urdu (InPage style)... ';
    }
  };

  const getHelpText = () => {
    if (translationMode === 'ai') {
      if (isInEditMode && hasTranslated) {
        return (
          <p>
            <strong>✏️ Edit Mode:</strong> You can now edit the Urdu text. Type in English/Roman characters to add or modify text - 
            they will automatically convert to Urdu. Clear the text completely to start a new translation.
          </p>
        );
      }
      return (
        <p>
          <strong>AI-Based Translation:</strong> Type in Roman Urdu and click the "Translate to Urdu via AI" button. 
          After translation, you can edit the text and it will automatically convert English/Roman input to Urdu.
        </p>
      );
    } else {
      return (
        <p>
          <strong>Character-Based Translation:</strong> Type in Roman Urdu or English characters and they will 
          automatically convert to Urdu script as you type (similar to InPage keyboard).
        </p>
      );
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Translation Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Translation Mode:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onTranslationModeChange('ai')}
              disabled={disabled}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                translationMode === 'ai'
                  ? 'bg-pakistan-green text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-pressed={translationMode === 'ai'}
            >
              AI-Based
            </button>
            <button
              onClick={() => onTranslationModeChange('character')}
              disabled={disabled}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                translationMode === 'character'
                  ? 'bg-pakistan-green text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-pressed={translationMode === 'character'}
            >
              Character-Based
            </button>
          </div>
          
          {/* Edit Mode Indicator */}
          {translationMode === 'ai' && isInEditMode && hasTranslated && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Mode
            </span>
          )}
        </div>

        {/* AI Translation Button - only show in AI mode when not in edit mode or when user wants to retranslate */}
        {translationMode === 'ai' && (
          <button
            onClick={handleAITranslation}
            disabled={isButtonDisabled}
            className="w-full sm:w-auto px-4 py-2 bg-pakistan-green text-white text-sm font-medium rounded-md hover:bg-pakistan-lightGreen disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isTranslating ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Translating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {isInEditMode ? 'Retranslate' : 'Translate to Urdu via AI'}
              </>
            )}
          </button>
        )}
      </div>

      {/* Translation Error Display */}
      {translationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-700">{translationError}</p>
        </div>
      )}

      {/* Text Input Area */}
      <div className="w-full">
        <label htmlFor="urdu-text-input" className="sr-only">
          Urdu text input
        </label>
        <textarea
          id="urdu-text-input"
          value={value}
          onChange={handleChange}
          disabled={disabled || isTranslating}
          placeholder={getPlaceholder()}
          style={{
            textAlign: getTextDirection === 'rtl' ? 'right' : 'left',
          }}
          className={`
            w-full min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 
            font-urdu text-base sm:text-lg
            border-2 border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
            resize-y
            urdu-text
            touch-manipulation
          `}
          dir={getTextDirection}
          lang={getTextDirection === 'rtl' ? 'ur' : 'en'}
          aria-label="Text input"
          aria-describedby="text-input-help"
        />
        <div id="text-input-help" className="mt-2 text-xs sm:text-sm text-gray-600">
          {getHelpText()}
        </div>
      </div>
    </div>
  );
}
