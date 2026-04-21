'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioBlob: Blob | null;
  autoPlay?: boolean;
}

export default function AudioPlayer({ audioBlob, autoPlay = true }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Handle audio blob changes and auto-play
  useEffect(() => {
    if (!audioBlob) {
      // Clean up previous audio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    // Clean up previous URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // Create new URL for the audio blob
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);

    // Reset playback state
    setCurrentTime(0);
    setIsPlaying(false);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioBlob]);

  // Handle auto-play when audio URL is set
  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
      // Small delay to ensure audio is loaded
      const timer = setTimeout(() => {
        audioRef.current?.play().catch((error) => {
          console.error('Auto-play failed:', error);
          setIsPlaying(false);
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [audioUrl, autoPlay]);

  // Update current time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current && !isNaN(audioRef.current.currentTime)) {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
    }
  };

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle play event
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Handle pause event
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Reset to beginning when playback completes
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Play failed:', error);
        setIsPlaying(false);
      });
    }
  };

  // Handle seek
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle volume change
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if no audio
  if (!audioBlob || !audioUrl) {
    return null;
  }

  return (
    <div className="w-full bg-white border-2 border-pakistan-green rounded-lg p-3 sm:p-4 shadow-sm" role="region" aria-label="Audio player">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        preload="metadata"
        aria-label="Synthesized speech audio"
      />

      {/* Custom Controls */}
      <div className="space-y-3 sm:space-y-4">
        {/* Play/Pause Button and Time Display */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={togglePlayPause}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-pakistan-green text-white rounded-full hover:bg-pakistan-lightGreen transition-colors focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2 touch-manipulation active:scale-95"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Time Display */}
          <div className="flex-shrink-0 text-xs sm:text-sm text-gray-600 font-mono" aria-live="off">
            <span aria-label={`Current time ${formatTime(currentTime)}`}>{formatTime(currentTime)}</span>
            {' / '}
            <span aria-label={`Total duration ${formatTime(duration)}`}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Seek Bar */}
        <div className="space-y-1">
          <label htmlFor="audio-seek" className="sr-only">
            Seek audio position
          </label>
          <input
            id="audio-seek"
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pakistan-green focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2"
            aria-label="Seek audio position"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            style={{
              background: `linear-gradient(to right, #01411C 0%, #01411C ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`,
            }}
          />
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <label htmlFor="audio-volume" className="sr-only">
            Volume control
          </label>
          <input
            id="audio-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pakistan-green focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2 touch-manipulation"
            aria-label="Volume control"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(volume * 100)}
            aria-valuetext={`Volume ${Math.round(volume * 100)} percent`}
            style={{
              background: `linear-gradient(to right, #01411C 0%, #01411C ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
            }}
          />
          <span className="text-xs sm:text-sm text-gray-600 font-mono w-8 sm:w-10 text-right" aria-hidden="true">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
