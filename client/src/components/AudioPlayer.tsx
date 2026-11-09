import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string | null;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  autoPlay = false,
  onPlayStateChange,
  className = ''
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackRate;
      if (autoPlay) {
        audioRef.current.play().catch(() => {
          // Autoplay may be blocked by browser policy until user interacts
        });
      }
    }
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleReplay = () => {
    if (!audioRef.current || !audioUrl) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 0.8];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onPlayStateChange) onPlayStateChange(false);
  };

  if (!audioUrl) return null;

  return (
    <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#151D32] border border-[#27324A] text-xs text-slate-300 shadow-md ${className}`}>
      <audio
        ref={audioRef}
        onPlay={() => {
          setIsPlaying(true);
          if (onPlayStateChange) onPlayStateChange(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center transition-colors shadow-glow-violet shrink-0"
        aria-label={isPlaying ? 'Pause voice' : 'Play voice'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Replay */}
      <button
        onClick={handleReplay}
        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
        title="Replay from start"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Speed control */}
      <button
        onClick={cycleSpeed}
        className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-[#10172A] border border-[#27324A] hover:border-violet-500/50 text-slate-300 transition-colors"
        title="Change playback speed"
      >
        {playbackRate}x
      </button>

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Progress timeline */}
      <div className="hidden sm:flex items-center gap-1.5 min-w-[70px] text-[10px] text-slate-400 font-mono">
        <span>{Math.floor(currentTime)}s</span>
        <div className="w-12 h-1 bg-[#10172A] rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span>{Math.floor(duration)}s</span>
      </div>
    </div>
  );
};

