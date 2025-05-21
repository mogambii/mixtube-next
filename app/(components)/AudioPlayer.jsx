"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { LiaStepBackwardSolid, LiaStepForwardSolid } from "react-icons/lia";
import { RiPauseLine, RiPlayFill } from "react-icons/ri";
import { Bars } from "react-loader-spinner";
import { usePlayerContext } from "@/context/PlayerContext";

function AudioPlayer() {
  const { currentMix, playMix, updatePlays } = usePlayerContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isBuffering, setIsBuffering] = useState(true);
  const [tooltipTime, setTooltipTime] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const audioPlayer = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);
  const volumeRef = useRef(null);
  const volumeContainerRef = useRef(null);

  useEffect(() => {
    if (currentMix && audioPlayer.current) {
      audioPlayer.current.src = currentMix.audio;
      audioPlayer.current.volume = volume;
      audioPlayer.current.load();
      setIsBuffering(true);
    }
  }, [currentMix, volume]);

  useEffect(() => {
    const audioElement = audioPlayer.current;
    if (!audioElement) return;

    if (isPlaying) {
      const playWhenReady = () => {
        audioElement
          .play()
          .then(() => {
            // Update play count after 5 seconds of playback
            setTimeout(() => {
              updatePlays(currentMix.id);
            }, 5000);
          })
          .catch((error) => {
            console.error("Auto-play failed:", error);
            setIsPlaying(false);
          });
      };

      audioElement.addEventListener("canplay", playWhenReady, { once: true });
      
      // Cleanup function
      return () => {
        audioElement.removeEventListener("canplay", playWhenReady);
      };
    } else {
      audioElement.pause();
    }
  }, [currentMix, updatePlays, isPlaying]);

  // Handle volume changes without restarting playback
  useEffect(() => {
    const audioElement = audioPlayer.current;
    if (audioElement) {
      audioElement.volume = volume;
    }
    
    return () => {
      if (audioElement) {
        audioElement.volume = 1; // Reset volume on unmount
      }
    };
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
      if (currentMix?.id) {
        updatePlays(currentMix.id);
      }
    }
    setIsPlaying((prev) => !prev);
  };

  const handleForward = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.min(
        audioPlayer.current.currentTime + 10,
        audioPlayer.current.duration
      );
    }
  };

  const handleRewind = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.max(
        audioPlayer.current.currentTime - 10,
        0
      );
    }
  };

  const handleSeek = (e) => {
    if (audioPlayer.current?.duration) {
      const seekPosition =
        (e.nativeEvent.offsetX / e.target.clientWidth) *
        audioPlayer.current.duration;
      audioPlayer.current.currentTime = seekPosition;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleVolume = () => {
    setIsVolumeOpen(!isVolumeOpen);
  };

  const updateProgress = useCallback(() => {
    if (audioPlayer.current) {
      const currentTime = audioPlayer.current.currentTime;
      const duration = audioPlayer.current.duration;

      if (!isNaN(duration)) {
        setProgress((currentTime / duration) * 100);
        setCurrentTimeDisplay(formatTime(currentTime));
        setDurationDisplay(formatTime(duration));

        if (dotRef.current) {
          dotRef.current.style.left = `${(currentTime / duration) * 100}%`;
        }
        setIsBuffering(false);
      }
    }
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    const audioElement = audioPlayer.current;
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleLoadedMetadata = () => {
      setDurationDisplay(formatTime(audioElement.duration));
      setIsBuffering(false);
    };

    if (audioElement) {
      audioElement.addEventListener("waiting", handleWaiting);
      audioElement.addEventListener("playing", handlePlaying);
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        audioElement.removeEventListener("waiting", handleWaiting);
        audioElement.removeEventListener("playing", handlePlaying);
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [currentMix, updateProgress]);

  const handleMouseMove = (e) => {
    if (progressRef.current && audioPlayer.current?.duration) {
      const x = e.nativeEvent.offsetX;
      const time =
        (x / progressRef.current.clientWidth) * audioPlayer.current.duration;
      setTooltipTime(formatTime(time));
    }
  };

  // Close volume when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        volumeContainerRef.current &&
        !volumeContainerRef.current.contains(event.target)
      ) {
        setIsVolumeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!currentMix || !currentMix.audio) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-lg z-50 border-t border-gray-200 dark:border-gray-700">
      {/* Full-width progress bar at the very bottom */}
      <div
        ref={progressRef}
        className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
        onClick={handleSeek}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltipTime(null)}
      >
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div
          ref={dotRef}
          className="absolute h-3 w-3 bg-blue-600 dark:bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md -translate-y-1/2"
          style={{
            left: `${progress}%`,
            transition: "left 0.1s linear",
          }}
        />
        {tooltipTime && (
          <div
            className="absolute -top-8 text-xs bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 rounded px-2 py-1 transform -translate-x-1/2 shadow-lg"
            style={{ left: `${progress}%` }}
          >
            {tooltipTime}
          </div>
        )}
      </div>

      {/* Player controls container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {currentMix.imgthumb && (
            <Link
              href={`/mix/${currentMix.id}`}
              className="block w-12 h-12 md:w-14 md:h-14 relative overflow-hidden rounded-md transition-transform hover:scale-105"
            >
              <Image
                src={currentMix.imgthumb}
                alt="Album Thumbnail"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 50px, 56px"
              />
            </Link>
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/mix/${currentMix.id}`}
            className="block font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {currentMix.title}
          </Link>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currentTimeDisplay} / {durationDisplay}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={handleRewind}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors"
            aria-label="Rewind 10 seconds"
          >
            <LiaStepBackwardSolid size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full transition-colors shadow-md hover:shadow-lg flex-shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isBuffering ? (
              <Bars height={20} width={20} color="#ffffff" />
            ) : isPlaying ? (
              <RiPauseLine size={22} />
            ) : (
              <RiPlayFill size={22} className="relative left-px" />
            )}
          </button>
          <button
            onClick={handleForward}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors"
            aria-label="Forward 10 seconds"
          >
            <LiaStepForwardSolid size={20} />
          </button>
        </div>

        {/* Volume control - hidden on mobile */}
        <div
          className="hidden md:flex items-center gap-2 w-24"
          ref={volumeContainerRef}
        >
          <button
            onClick={toggleVolume}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Volume control"
          >
            {volume === 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : volume < 0.5 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12 13a1 1 0 100-2H8a1 1 0 100 2h4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <div
            className={`absolute bottom-16 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl transition-all duration-200 origin-bottom ${
              isVolumeOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-300 rounded-md appearance-none cursor-pointer accent-blue-500"
              style={{
                WebkitAppearance: "none",
                appearance: "none",
                height: "4px",
                borderRadius: "6px",
                backgroundColor: "#d1d5db", // Tailwind gray-300
              }}
            />
          </div>
        </div>

        <audio
          ref={audioPlayer}
          onTimeUpdate={updateProgress}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
