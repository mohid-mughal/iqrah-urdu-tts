/**
 * Audio Converter Utility
 * Provides functions to convert audio between formats using Web Audio API
 */

/**
 * Convert any audio blob/file to WAV format
 * @param audio - Input audio file or blob
 * @returns Promise resolving to WAV blob
 */
export async function convertToWav(audio: File | Blob): Promise<Blob> {
  // Check if already WAV
  if (audio.type === 'audio/wav' || audio.type === 'audio/x-wav') {
    return audio;
  }

  // If it's a File with .wav extension, assume it's WAV
  if (audio instanceof File && audio.name.toLowerCase().endsWith('.wav')) {
    return audio;
  }

  // Convert using Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await audio.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const wavBlob = audioBufferToWav(audioBuffer);
    await audioContext.close();
    return wavBlob;
  } catch (error) {
    throw new Error('Failed to convert audio to WAV format. Please ensure the audio file is valid.');
  }
}

/**
 * Convert AudioBuffer to WAV Blob
 * @param audioBuffer - Web Audio API AudioBuffer
 * @returns WAV Blob
 */
export function audioBufferToWav(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const length = audioBuffer.length * numberOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // Write WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * bitDepth / 8, true); // ByteRate
  view.setUint16(32, numberOfChannels * bitDepth / 8, true); // BlockAlign
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Write interleaved audio data
  const channels = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Check if audio is in WAV format
 * @param audio - Audio file or blob to check
 * @returns true if audio is WAV format
 */
export function isWavFormat(audio: File | Blob): boolean {
  if (audio.type === 'audio/wav' || audio.type === 'audio/x-wav') {
    return true;
  }
  
  if (audio instanceof File && audio.name.toLowerCase().endsWith('.wav')) {
    return true;
  }
  
  return false;
}
