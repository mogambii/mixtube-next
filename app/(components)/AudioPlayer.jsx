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

  // All state hooks
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isBuffering, setIsBuffering] = useState(true);
  const [tooltipTime, setTooltipTime] = useState(null);
  const [wasPaused, setWasPaused] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioPlayer = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

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
  }, [formatTime]);

  // Handle audio source changes
  useEffect(() => {
    if (!currentMix?.audio || !audioPlayer.current) return;

    setWasPaused(false);
    setIsBuffering(true);

    const audioElement = audioPlayer.current;
    audioElement.src = currentMix.audio;
    audioElement.load();

    const handleLoadedData = async () => {
      try {
        await audioElement.play();
        setIsPlaying(true);
        if (currentMix.id) {
          updatePlays(currentMix.id);
        }
      } catch (error) {
        console.log("Autoplay prevented:", error);
        setIsPlaying(false);
      } finally {
        setIsBuffering(false);
      }
    };

    audioElement.addEventListener("loadeddata", handleLoadedData);

    return () => {
      audioElement.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [currentMix, updatePlays]);

  const togglePlay = useCallback(async () => {
    if (!audioPlayer.current) return;

    try {
      if (isPlaying) {
        await audioPlayer.current.pause();
        setIsPlaying(false);
        setWasPaused(true);
      } else {
        await audioPlayer.current.play();
        if (wasPaused && currentMix?.id) {
          updatePlays(currentMix.id);
          setWasPaused(false);
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error during playback:", error);
    }
  }, [isPlaying, wasPaused, currentMix?.id, updatePlays]);

  const handleForward = useCallback(() => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.min(
        audioPlayer.current.currentTime + 10,
        audioPlayer.current.duration
      );
    }
  }, []);

  const handleRewind = useCallback(() => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = Math.max(
        audioPlayer.current.currentTime - 10,
        0
      );
    }
  }, []);

  const handleSeek = useCallback((e) => {
    if (audioPlayer.current && progressRef.current) {
      const seekPosition =
        (e.nativeEvent.offsetX / progressRef.current.clientWidth) *
        audioPlayer.current.duration;
      audioPlayer.current.currentTime = seekPosition;
    }
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audioElement = audioPlayer.current;
    if (!audioElement) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setDurationDisplay(formatTime(audioElement.duration));
      setIsBuffering(false);
    };

    audioElement.addEventListener("timeupdate", updateProgress);
    audioElement.addEventListener("waiting", handleWaiting);
    audioElement.addEventListener("playing", handlePlaying);
    audioElement.addEventListener("ended", handleEnded);
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener("timeupdate", updateProgress);
      audioElement.removeEventListener("waiting", handleWaiting);
      audioElement.removeEventListener("playing", handlePlaying);
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [updateProgress, formatTime]);

  const handleMouseMove = useCallback(
    (e) => {
      if (progressRef.current && audioPlayer.current?.duration) {
        const x = e.nativeEvent.offsetX;
        const time =
          (x / progressRef.current.clientWidth) * audioPlayer.current.duration;
        setTooltipTime(formatTime(time));
      }
    },
    [formatTime]
  );

  // Responsive layout handling
  useEffect(() => {
    const handleResize = () => {
      setIsMiniPlayer(window.innerWidth < 640);
      if (window.innerWidth >= 640) {
        setIsExpanded(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => (isMiniPlayer ? !prev : false));
  }, [isMiniPlayer]);

  if (!currentMix?.audio) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-200 shadow-xl z-50 border-t border-gray-200 dark:border-gray-800 transition-all duration-500 ${
        isExpanded ? "h-auto rounded-t-xl" : "rounded-t-xl"
      }`}
    >
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 cursor-pointer group overflow-hidden rounded-t-xl"
        onClick={handleSeek}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltipTime(null)}
      >
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 bg-[length:200%_100%] animate-gradient-x"></div>
        )}

        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />

        <div
          ref={dotRef}
          className="absolute h-4 w-4 bg-white border-2 border-indigo-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            left: `${progress}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {tooltipTime && (
          <div
            className="absolute -bottom-10 text-xs bg-indigo-600 text-white rounded-md px-2 py-1 transform -translate-x-1/2 shadow-lg z-10"
            style={{ left: `${progress}%` }}
          >
            {tooltipTime}
          </div>
        )}
      </div>

      {/* Mini Player for Mobile */}
      {isMiniPlayer && !isExpanded && (
        <div
          className="p-2 flex items-center justify-between"
          onClick={toggleExpanded}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {currentMix.imgthumb && (
              <div className="relative w-10 h-10 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={currentMix.imgthumb}
                  alt="Album Thumbnail"
                  className="object-cover"
                  fill
                  sizes="40px"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-3 h-3 flex space-x-[2px]">
                      <span className="w-[2px] h-full bg-white animate-music-bar1"></span>
                      <span className="w-[2px] h-full bg-white animate-music-bar2"></span>
                      <span className="w-[2px] h-full bg-white animate-music-bar3"></span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate w-5/6">
                {currentMix.title}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {currentTimeDisplay} / {durationDisplay}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className={`p-2 rounded-full ${
              isPlaying ? "bg-indigo-600" : "bg-purple-600"
            } text-white`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isBuffering ? (
              <div className="w-4 h-4 flex items-center justify-center">
                <Bars height={16} width={16} color="#ffffff" />
              </div>
            ) : isPlaying ? (
              <RiPauseLine size={16} />
            ) : (
              <RiPlayFill size={16} />
            )}
          </button>
        </div>
      )}

      {/* Full Player */}
      {(!isMiniPlayer || isExpanded) && (
        <div className="p-2 sm:p-3">
          {isMiniPlayer && (
            <div className="flex justify-center mb-1">
              <button
                onClick={toggleExpanded}
                className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                aria-label="Collapse player"
              />
            </div>
          )}

          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-1">
            {/* Thumbnail and Title */}
            <div className="flex items-center gap-x-3 w-full sm:w-auto sm:min-w-[250px] order-1">
              {currentMix.imgthumb && (
                <Link
                  href={`/mix/${currentMix.id}`}
                  className="relative group w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 overflow-hidden rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/40 to-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <Image
                    src={currentMix.imgthumb}
                    alt="Album Thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={64}
                    height={64}
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="relative w-6 h-6">
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 flex space-x-1">
                            <span className="w-1 h-full bg-purple-600 animate-music-bar1"></span>
                            <span className="w-1 h-full bg-indigo-600 animate-music-bar2"></span>
                            <span className="w-1 h-full bg-purple-600 animate-music-bar3"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
              )}
              <div className="flex flex-col">
                <Link
                  href={`/mix/${currentMix.id}`}
                  className="font-bold text-sm text-slate-700 dark:text-slate-200 line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-4/5"
                >
                  {currentMix.title}
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center flex-wrap">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 mr-2 mb-0.5">
                    Now Playing
                  </span>
                  <span className="mb-0.5">
                    {currentTimeDisplay} / {durationDisplay}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto sm:ml-auto order-2">
              <button
                onClick={handleRewind}
                className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded-full transition-all duration-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transform hover:scale-110 active:scale-95"
                aria-label="Rewind 10 seconds"
              >
                <LiaStepBackwardSolid size={20} />
              </button>
              <button
                onClick={togglePlay}
                className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isPlaying
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white shadow-md ${
                  isPlaying
                    ? "hover:shadow-indigo-500/30"
                    : "hover:shadow-purple-500/30"
                }`}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isBuffering ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Bars height={20} width={20} color="#ffffff" />
                  </div>
                ) : isPlaying ? (
                  <RiPauseLine size={22} />
                ) : (
                  <RiPlayFill size={22} />
                )}
              </button>
              <button
                onClick={handleForward}
                className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded-full transition-all duration-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transform hover:scale-110 active:scale-95"
                aria-label="Forward 10 seconds"
              >
                <LiaStepForwardSolid size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Element */}
      <audio
        ref={audioPlayer}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
          setIsBuffering(false);
        }}
      />
    </div>
  );
}

export default AudioPlayer;
