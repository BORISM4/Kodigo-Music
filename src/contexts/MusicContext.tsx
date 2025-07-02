"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Song } from "../lib/data";

type MusicContextType = {
  currentTrack: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  queue: Song[];
  error: string | null;
};

const MusicContext = createContext<MusicContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.75);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    nextTrack();
  };

  const handleError = (e: Event) => {
    console.error("Audio error:", e);
    setError(
      "Error al reproducir el audio. El archivo puede no estar disponible."
    );
    setIsPlaying(false);
  };

  const handleCanPlay = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setError("No se pudo reproducir el audio. Intenta de nuevo.");
          setIsPlaying(false);
        });
    }
  };

  const playTrack = (track: Song, newQueue?: Song[]) => {
    setError(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.removeEventListener("ended", handleEnded);
      audioRef.current.removeEventListener("error", handleError);
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(0);

    if (newQueue) {
      setQueue(newQueue);
      setCurrentIndex(newQueue.findIndex((song) => song.id === track.id));
    }

    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.preload = "metadata";

    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleEnded);
    audioRef.current.addEventListener("error", handleError);
    audioRef.current.addEventListener("canplay", handleCanPlay);

    try {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
    } catch (err) {
      console.error("Error setting audio source:", err);
      setError("No se pudo cargar el archivo de audio");
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setError(null);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setError("No se pudo reproducir el audio. Intenta de nuevo.");
          setIsPlaying(false);
        });
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current && !isNaN(time) && isFinite(time)) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    playTrack(queue[nextIndex]);
  };

  const previousTrack = () => {
    if (queue.length === 0) return;

    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playTrack(queue[prevIndex]);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        playTrack,
        togglePlay,
        setVolume,
        seekTo,
        nextTrack,
        previousTrack,
        queue,
        error,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
