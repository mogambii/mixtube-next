"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect ,useCallback } from "react";
import { LiaStepBackwardSolid, LiaStepForwardSolid } from "react-icons/lia";
import { RiPauseLine, RiPlayFill } from "react-icons/ri";
import { Bars } from "react-loader-spinner";
import { usePlayerContext } from "@/context/PlayerContext";

function AudioPlayer() {
  const { currentMix, playMix, updatePlays } = usePlayerContext();

  // Always call hooks first
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isBuffering, setIsBuffering] = useState(true);
  const [tooltipTime, setTooltipTime] = useState(null);

  const audioPlayer = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);

  // useEffect hooks must be called unconditionally
  useEffect(() => {
    if (currentMix && audioPlayer.current) {
      audioPlayer.current.src = currentMix.audio;
      audioPlayer.current.load();
      setIsPlaying(false);
      setIsBuffering(true);
    }
  }, [currentMix]);

  const togglePlay = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
      // Update play count when starting to play
      if (currentMix.id) {
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
      audioPlayer.current.currentTime = Math.max(audioPlayer.current.currentTime - 10, 0);
    }
  };

  const handleSeek = (e) => {
    const seekPosition = (e.nativeEvent.offsetX / e.target.clientWidth) * audioPlayer.current.duration;
    audioPlayer.current.currentTime = seekPosition;
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
  }, []); // No dependencies since it only depends on refs and state setters

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
        audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [currentMix, updateProgress]); 

  const handleMouseMove = (e) => {
    if (progressRef.current && audioPlayer.current.duration) {
      const x = e.nativeEvent.offsetX;
      const time = (x / progressRef.current.clientWidth) * audioPlayer.current.duration;
      setTooltipTime(formatTime(time));
    }
  };

  if (!currentMix || !currentMix.audio) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-100 dark:bg-gray-900 text-gray-200 p-4 shadow-lg z-50 rounded-t-lg">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Thumbnail and Title Section */}
        <div className="flex items-center gap-4 min-w-[200px]">
          {currentMix.imgthumb && (
            <Link href={`/mix/${currentMix.id}`} className="w-16 h-16 flex-shrink-0">
              <Image 
                src={currentMix.imgthumb} 
                alt="Album Thumbnail" 
                className="w-full h-full rounded-md object-cover" 
                width={64} 
                height={64} 
              />
            </Link>
          )}
          <div className="flex flex-col">
            <div className="font-bold text-sm text-slate-700 dark:text-slate-200  line-clamp-1">{currentMix.title}</div>
            <div className="text-xs text-gray-400">{currentTimeDisplay} / {durationDisplay}</div>
          </div>
        </div>

        {/* Controls and Progress Section */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={handleRewind} 
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <LiaStepBackwardSolid  className="text-slate-900 dark:text-slate-100" size={20} />
            </button>
            <button 
              onClick={togglePlay} 
              className="p-3 hover:bg-gray-700 rounded-full transition-colors"
            >
              {isBuffering ? (
                <Bars height={20} width={20} color="#3B82F6" />
              ) : isPlaying ? (
                <RiPauseLine   className="text-slate-900 dark:text-slate-100" size={24} />
              ) : (
                <RiPlayFill  className="text-slate-900 dark:text-slate-100" size={24} />
              )}
            </button>
            <button 
              onClick={handleForward} 
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <LiaStepForwardSolid className="text-slate-900 dark:text-slate-100" size={20} />
            </button>
          </div>

          <div className="w-full px-4">
            <div 
              ref={progressRef} 
              className="relative w-full h-1.5 bg-gray-600 rounded-full cursor-pointer group" 
              onClick={handleSeek} 
              onMouseMove={handleMouseMove} 
              onMouseLeave={() => setTooltipTime(null)}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
                style={{ width: `${progress}%` }} 
              />
              <div 
                ref={dotRef} 
                className="absolute h-3 w-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ left: `${progress}%`, top: "50%", transform: "translate(-50%, -50%)" }} 
              />
              {tooltipTime && (
                <div 
                  className="absolute -top-6 text-xs bg-gray-800 text-white rounded px-2 py-1 transform -translate-x-1/2"
                  style={{ left: `${progress}%` }}
                >
                  {tooltipTime}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Element */}
        <audio ref={audioPlayer} onTimeUpdate={updateProgress} onEnded={() => setIsPlaying(false)} />
      </div>
    </div>
  );
}

export default AudioPlayer;
