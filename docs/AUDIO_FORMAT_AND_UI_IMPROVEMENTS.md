# Audio Format and UI Improvements

## Overview
This document describes the improvements made to handle audio format conversion and UI enhancements for the Iqrah Urdu TTS frontend.

## Changes Made

### 1. Audio Format Conversion to WAV

#### Problem
- Backend only accepts WAV format audio
- Recording service was saving in webm/browser default format
- Uploaded files could be in various formats (MP3, FLAC, OGG)
- This caused "TorchCodec" errors when backend tried to process non-WAV audio

#### Solution
Created a centralized audio conversion utility (`utils/audioConverter.ts`) that:
- Converts any audio format to WAV using Web Audio API
- Implements proper WAV file header structure (RIFF/WAVE format)
- Handles PCM encoding at 16-bit depth
- Properly interleaves multi-channel audio data

#### Implementation Details

**New File: `utils/audioConverter.ts`**
- `convertToWav()`: Main conversion function that handles any audio format
- `audioBufferToWav()`: Converts Web Audio API AudioBuffer to WAV blob
- `isWavFormat()`: Helper to check if audio is already in WAV format

**Updated: `services/recording.service.ts`**
- Now converts recorded audio to WAV format before returning
- Uses shared `convertToWav()` utility
- Ensures all recorded audio is in proper WAV format

**Updated: `services/tts.service.ts`**
- Added `ensureWavFormat()` method that converts reference audio to WAV
- Automatically converts uploaded files to WAV before sending to backend
- Provides clear error messages if conversion fails

### 2. Sample Sentences Update

Updated `config/samples.ts` with new reference sentences:
- "میرا نام محمد موحد مغل ہے۔" (Muhammad Mowahed Mughal)
- "میرا نام احمد جاوید ہے۔" (Ahmed Javed)
- Added longer educational sentence about Pakistan's education system
- Added weather description sentence with complex narrative

### 3. UI Background Improvements

#### Problem
- Plain white background looked too simple and unpolished

#### Solution
Added subtle Islamic geometric patterns to the background:

**Updated: `app/globals.css`**
- Changed background color from pure white (#ffffff) to soft cream (#f8faf9)
- Added diagonal crosshatch pattern using CSS gradients (opacity: 0.03)
- Added radial dot pattern overlay (opacity: 0.015)
- Patterns use Pakistan green colors to maintain brand consistency
- Fixed positioning ensures patterns don't scroll with content

**Updated: `tailwind.config.ts`**
- Added `pakistan.cream` color token for the new background

### 4. Audio Duration Display Fix

#### Problem
- Recorded audio showed "Duration: Infinity:NaN" because WAV metadata wasn't immediately available

#### Solution
**Updated: `components/AudioControls.tsx`**
- Added validation to check if duration is finite and not NaN
- Shows "Ready to use" instead of invalid duration
- Properly handles both uploaded files (with metadata) and recorded audio (without immediate metadata)

### 5. User-Friendly Error Messages

**Updated: `components/AudioControls.tsx`**
- Added clear message about WAV format recommendation
- Shows warning when non-WAV files are uploaded (but still allows them)
- Updated help text to mention automatic WAV conversion
- Improved error messages for file validation

## Technical Details

### WAV Format Specification
The implementation follows the standard WAV file format:
```
RIFF Header (12 bytes)
├─ "RIFF" identifier (4 bytes)
├─ File size - 8 (4 bytes)
└─ "WAVE" identifier (4 bytes)

fmt Chunk (24 bytes)
├─ "fmt " identifier (4 bytes)
├─ Chunk size: 16 (4 bytes)
├─ Audio format: 1 (PCM) (2 bytes)
├─ Number of channels (2 bytes)
├─ Sample rate (4 bytes)
├─ Byte rate (4 bytes)
├─ Block align (2 bytes)
└─ Bits per sample: 16 (2 bytes)

data Chunk (8 bytes + audio data)
├─ "data" identifier (4 bytes)
├─ Data size (4 bytes)
└─ Audio samples (interleaved, 16-bit PCM)
```

### Browser Compatibility
- Uses Web Audio API (supported in all modern browsers)
- Falls back to `webkitAudioContext` for older Safari versions
- MediaRecorder API for audio recording (widely supported)

## Testing Recommendations

1. **Recording Test**: Record audio and verify it's converted to WAV
2. **Upload Test**: Upload MP3/FLAC/OGG files and verify conversion
3. **WAV Upload Test**: Upload WAV file and verify no unnecessary conversion
4. **Duration Display**: Check both uploaded and recorded audio duration display
5. **Background Pattern**: Verify patterns are subtle and don't interfere with readability
6. **Error Messages**: Test with invalid files to see error messages

## Backend Error Note

The "TorchCodec is required for load_with_torchcodec" error mentioned by the user is a backend issue. The frontend now ensures all audio is sent in WAV format, which should resolve this if the backend properly handles WAV files. If the error persists, the backend needs to:
- Install torchcodec package
- Or update audio loading logic to handle WAV files without torchcodec

## Future Improvements

1. Add audio quality settings (sample rate, bit depth)
2. Show conversion progress for large files
3. Add audio preview before synthesis
4. Implement client-side audio validation (check if audio is valid before sending)
5. Add more Islamic geometric pattern options
