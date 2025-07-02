"use client";

import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  AlertCircle,
} from "lucide-react";
import { useMusic } from "../contexts/MusicContext";
import { useState } from "react";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    volume,
    setVolume,
    seekTo,
    nextTrack,
    previousTrack,
    error,
  } = useMusic();
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  if (!currentTrack) {
    return null;
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (value: number[]) => {
    if (duration > 0) {
      const newTime = (value[0] / 100) * duration;
      seekTo(newTime);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3 mb-[17%] sm:mb-0">
      {error && (
        <div className="mb-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto">
        <div className="hidden sm:flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={currentTrack.cover || "/placeholder.svg"}
              alt={currentTrack.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="font-medium text-white truncate">
                {currentTrack.title}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 text-gray-400 hover:text-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
                onClick={previousTrack}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="w-10 h-10 bg-white text-black hover:bg-gray-200"
                onClick={togglePlay}
                disabled={!!error}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
                onClick={nextTrack}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                disabled={!duration || !!error}
                className="flex-1 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
              />
              <span className="text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 text-gray-400 hover:text-white"
              onClick={handleMuteToggle}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
            />
          </div>
        </div>

        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={currentTrack.cover || "/placeholder.svg"}
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="font-medium text-white truncate text-sm">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 text-gray-400 hover:text-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2 mb-3">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
                onClick={previousTrack}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="w-12 h-12 bg-white text-black hover:bg-gray-200"
                onClick={togglePlay}
                disabled={!!error}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 fill-current" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
                onClick={nextTrack}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400 hover:text-white"
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                disabled={!duration || !!error}
                className="flex-1 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
              />
              <span className="text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-800">
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 text-gray-400 hover:text-white"
              onClick={handleMuteToggle}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1 max-w-32 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
            />
            <span className="text-xs text-gray-400 min-w-8">
              {Math.round(isMuted ? 0 : volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
