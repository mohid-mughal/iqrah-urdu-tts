# AudioPlayer Component

## Overview

The AudioPlayer component provides a custom audio player interface for playing synthesized speech. It includes play/pause controls, seek functionality, volume control, and automatic playback after synthesis.

## Features

- **Custom Controls**: Play/pause button, seek bar, and volume slider
- **Auto-play**: Automatically plays audio when new synthesis completes
- **Time Display**: Shows current time and total duration
- **Seek Functionality**: Click or drag on the progress bar to jump to any position
- **Volume Control**: Adjust playback volume from 0% to 100%
- **Auto-reset**: Returns to the beginning when playback completes
- **Audio Replacement**: Handles new audio blobs seamlessly

## Props

```typescript
interface AudioPlayerProps {
  audioBlob: Blob | null;
  autoPlay?: boolean;
}
```

- `audioBlob`: The audio blob to play (null if no audio available)
- `autoPlay`: Whether to automatically play when new audio is provided (default: true)

## Usage

```tsx
import AudioPlayer from '@/components/AudioPlayer';

function MyComponent() {
  const [synthesizedAudio, setSynthesizedAudio] = useState<Blob | null>(null);

  const handleSynthesisComplete = (audioBlob: Blob) => {
    setSynthesizedAudio(audioBlob);
  };

  return (
    <div>
      <AudioPlayer 
        audioBlob={synthesizedAudio} 
        autoPlay={true}
      />
    </div>
  );
}
```

## Requirements Satisfied

- **7.1**: Displays audio player with play and pause controls when audio is available
- **7.2**: Play button begins playing the synthesized audio
- **7.3**: Pause button pauses the audio playback
- **7.4**: Resets to beginning when playback completes
- **7.5**: Replaces previous audio when new audio is synthesized

## Accessibility

- ARIA labels for play/pause and seek controls
- Keyboard accessible controls
- Visual feedback for all interactive elements
- Time display in accessible format

## Styling

- Pakistan green theme for controls
- Clean, minimalistic design
- Responsive layout
- Visual progress indicators for seek and volume
