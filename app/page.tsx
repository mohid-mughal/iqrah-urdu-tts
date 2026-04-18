'use client';

import { useState } from 'react';
import { AppState } from '@/types';
import { MODELS } from '@/config/models';
import { SAMPLE_SENTENCES } from '@/config/samples';
import { analyticsService } from '@/services/analytics.service';
import ModelTabs from '@/components/ModelTabs';
import TextInput from '@/components/TextInput';
import SampleSentences from '@/components/SampleSentences';
import AudioControls from '@/components/AudioControls';
import SynthesizeButton from '@/components/SynthesizeButton';
import AudioPlayer from '@/components/AudioPlayer';
import ErrorAlert from '@/components/ErrorAlert';

export default function HomePage() {
  // Application state management using React hooks
  const [appState, setAppState] = useState<AppState>({
    selectedModel: 'standard',
    inputText: '',
    referenceAudio: null,
    synthesizedAudio: null,
    isLoading: false,
    error: null,
    isRecording: false,
  });

  // Handle model tab change
  const handleModelChange = (model: 'standard' | 'phoneme') => {
    setAppState((prev) => ({
      ...prev,
      selectedModel: model,
    }));
    
    // Track model switch in analytics
    analyticsService.trackModelSwitch(model);
  };

  // Handle text input change
  const handleTextChange = (text: string) => {
    setAppState((prev) => ({
      ...prev,
      inputText: text,
      error: null, // Clear any previous errors
    }));
  };

  // Handle sample sentence selection
  const handleSampleSelect = (sentence: string) => {
    setAppState((prev) => ({
      ...prev,
      inputText: sentence,
      error: null,
    }));
  };

  // Handle file upload for reference audio
  const handleFileUpload = (file: File) => {
    setAppState((prev) => ({
      ...prev,
      referenceAudio: file,
      error: null,
    }));
    
    // Track voice cloning usage
    analyticsService.trackVoiceCloning('upload');
  };

  // Handle recording completion
  const handleRecordingComplete = (audioBlob: Blob) => {
    setAppState((prev) => ({
      ...prev,
      referenceAudio: audioBlob,
      isRecording: false,
      error: null,
    }));
    
    // Track voice cloning usage
    analyticsService.trackVoiceCloning('recording');
  };

  // Handle remove reference audio
  const handleRemoveAudio = () => {
    setAppState((prev) => ({
      ...prev,
      referenceAudio: null,
    }));
  };

  // Handle synthesis start
  const handleSynthesisStart = () => {
    setAppState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      synthesizedAudio: null, // Clear previous audio
    }));
  };

  // Handle synthesis completion
  const handleSynthesisComplete = (audioBlob: Blob) => {
    setAppState((prev) => ({
      ...prev,
      isLoading: false,
      synthesizedAudio: audioBlob,
      error: null,
    }));
    
    // Track synthesis in analytics
    analyticsService.trackSynthesis(
      appState.selectedModel,
      appState.referenceAudio !== null
    );
  };

  // Handle synthesis error
  const handleSynthesisError = (error: Error) => {
    setAppState((prev) => ({
      ...prev,
      isLoading: false,
      error: error.message,
    }));
  };

  // Get the current model endpoint
  const currentModelEndpoint = MODELS[appState.selectedModel].endpoint;

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl">
      <div className="space-y-6 sm:space-y-8">
        {/* Model Selection Tabs */}
        <section aria-labelledby="model-selection-heading">
          <h2 id="model-selection-heading" className="sr-only">Model Selection</h2>
          <ModelTabs
            selectedModel={appState.selectedModel}
            onModelChange={handleModelChange}
          />
        </section>

        {/* Text Input Section */}
        <section aria-labelledby="text-input-heading">
          <h2 id="text-input-heading" className="text-lg sm:text-xl font-semibold text-pakistan-green mb-3 sm:mb-4">
            Enter Text
          </h2>
          <TextInput
            value={appState.inputText}
            onChange={handleTextChange}
            disabled={appState.isLoading}
          />
        </section>

        {/* Sample Sentences Section */}
        <section aria-labelledby="sample-sentences-heading">
          <SampleSentences
            sentences={SAMPLE_SENTENCES}
            onSelect={handleSampleSelect}
          />
        </section>

        {/* Voice Cloning Section */}
        <section aria-labelledby="voice-cloning-heading">
          <h2 id="voice-cloning-heading" className="text-lg sm:text-xl font-semibold text-pakistan-green mb-3 sm:mb-4">
            Voice Cloning (Optional)
          </h2>
          <AudioControls
            onFileUpload={handleFileUpload}
            onRecordingComplete={handleRecordingComplete}
            referenceAudio={appState.referenceAudio}
            onRemoveAudio={handleRemoveAudio}
            disabled={appState.isLoading}
          />
        </section>

        {/* Synthesize Button */}
        <section aria-labelledby="synthesize-heading">
          <h2 id="synthesize-heading" className="sr-only">Synthesize Speech</h2>
          <SynthesizeButton
            text={appState.inputText}
            referenceAudio={appState.referenceAudio}
            modelEndpoint={currentModelEndpoint}
            onSynthesisStart={handleSynthesisStart}
            onSynthesisComplete={handleSynthesisComplete}
            onSynthesisError={handleSynthesisError}
            disabled={appState.isLoading || !appState.inputText.trim()}
          />
        </section>

        {/* Error Display */}
        {appState.error && (
          <section aria-labelledby="error-heading">
            <h2 id="error-heading" className="sr-only">Error Message</h2>
            <ErrorAlert
              message={appState.error}
              title="Synthesis Error"
              onDismiss={() => setAppState((prev) => ({ ...prev, error: null }))}
            />
          </section>
        )}

        {/* Audio Player Section */}
        {appState.synthesizedAudio && (
          <section aria-labelledby="audio-player-heading">
            <h2 id="audio-player-heading" className="text-lg sm:text-xl font-semibold text-pakistan-green mb-3 sm:mb-4">
              Synthesized Audio
            </h2>
            <AudioPlayer audioBlob={appState.synthesizedAudio} autoPlay={true} />
          </section>
        )}
      </div>
    </main>
  );
}
