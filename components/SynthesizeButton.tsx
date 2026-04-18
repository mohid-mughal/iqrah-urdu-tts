'use client';

import { useState } from 'react';
import { ttsService } from '@/services/tts.service';

interface SynthesizeButtonProps {
  text: string;
  referenceAudio: File | Blob | null;
  modelEndpoint: string;
  onSynthesisStart: () => void;
  onSynthesisComplete: (audioBlob: Blob) => void;
  onSynthesisError: (error: Error) => void;
  disabled?: boolean;
}

export default function SynthesizeButton({
  text,
  referenceAudio,
  modelEndpoint,
  onSynthesisStart,
  onSynthesisComplete,
  onSynthesisError,
  disabled = false,
}: SynthesizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSynthesize = async () => {
    // Don't proceed if button is disabled or already loading
    if (disabled || isLoading || !text.trim()) {
      return;
    }

    try {
      // Notify parent that synthesis is starting
      onSynthesisStart();
      setIsLoading(true);

      // Call TTS service
      const response = await ttsService.synthesize({
        text: text.trim(),
        referenceAudio: referenceAudio || undefined,
        endpoint: modelEndpoint,
      });

      // Notify parent of successful synthesis
      onSynthesisComplete(response.audioBlob);
    } catch (error) {
      // Notify parent of error
      const errorObj = error instanceof Error ? error : new Error('Synthesis failed');
      onSynthesisError(errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  // Button is disabled if: explicitly disabled, loading, or text is empty
  const isButtonDisabled = disabled || isLoading || !text.trim();

  return (
    <button
      onClick={handleSynthesize}
      disabled={isButtonDisabled}
      className={`
        w-full py-3 px-4 sm:px-6 rounded-lg font-medium text-white text-sm sm:text-base
        transition-all duration-200
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2
        touch-manipulation
        active:scale-98
        ${
          isButtonDisabled
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : 'bg-green-600 hover:bg-green-700 active:bg-green-800 cursor-pointer'
        }
      `}
      aria-label={isLoading ? 'Synthesizing speech, please wait' : 'Synthesize speech from text'}
      aria-busy={isLoading}
      aria-disabled={isButtonDisabled}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Synthesizing...</span>
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          <span>Synthesize Speech</span>
        </>
      )}
    </button>
  );
}
