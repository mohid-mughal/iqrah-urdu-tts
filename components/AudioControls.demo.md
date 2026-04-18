# AudioControls Component Demo

## Overview

The AudioControls component provides an interface for users to upload audio files or record audio from their microphone for voice cloning purposes. It displays the selected/recorded audio information and allows users to remove the reference audio.

## Features

- **File Upload**: Upload audio files in WAV, MP3, FLAC, or OGG formats
- **Microphone Recording**: Record audio directly from the user's microphone with visual recording indicator
- **Audio Information Display**: Shows filename and duration of selected/recorded audio
- **Remove Functionality**: Clear reference audio with a remove button
- **Recording Status**: Animated indicator showing recording is in progress
- **Error Handling**: Displays user-friendly error messages for recording failures

## Props

```typescript
interface AudioControlsProps {
  onFileUpload: (file: File) => void;
  onRecordingComplete: (audioBlob: Blob) => void;
  referenceAudio: File | Blob | null;
  onRemoveAudio: () => void;
  disabled?: boolean;
}
```

## Usage Example

```tsx
import AudioControls from '@/components/AudioControls';
import { useState } from 'react';

function MyComponent() {
  const [referenceAudio, setReferenceAudio] = useState<File | Blob | null>(null);

  const handleFileUpload = (file: File) => {
    setReferenceAudio(file);
    console.log('File uploaded:', file.name);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setReferenceAudio(audioBlob);
    console.log('Recording complete, size:', audioBlob.size);
  };

  const handleRemoveAudio = () => {
    setReferenceAudio(null);
    console.log('Reference audio removed');
  };

  return (
    <AudioControls
      onFileUpload={handleFileUpload}
      onRecordingComplete={handleRecordingComplete}
      referenceAudio={referenceAudio}
      onRemoveAudio={handleRemoveAudio}
      disabled={false}
    />
  );
}
```

## Requirements Validated

- **4.1**: File picker accepts WAV, MP3, FLAC, and OGG formats
- **4.2**: Displays filename and remove button when audio is selected
- **4.3**: Remove button clears the reference audio
- **5.1**: Microphone icon requests permission and starts recording
- **5.3**: Visual indicator (animated pulse) shows recording is in progress
- **5.5**: Displays recorded audio duration and remove button after recording

## Design Features

- **Pakistan-themed colors**: Uses Pakistan green for buttons and accents
- **Responsive layout**: Stacks buttons vertically on mobile, horizontally on desktop
- **Animated recording indicator**: Pulsing white dot when recording
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Error handling**: User-friendly error messages for permission and recording failures

## States

1. **Initial State**: Both upload and record buttons available
2. **Recording State**: Record button shows "Stop Recording" with animated indicator, upload button disabled
3. **Audio Selected State**: Shows audio info card with filename, duration, and remove button
4. **Error State**: Displays error message below buttons
5. **Disabled State**: All controls disabled when parent component sets disabled prop

## Accessibility

- ARIA labels on all interactive elements
- Keyboard accessible file input
- Clear visual feedback for all states
- Error messages announced to screen readers
- Touch-friendly button sizes for mobile devices
