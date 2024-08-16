"use client";
import React, { useState, useRef, useEffect } from "react";
import { LiaStepBackwardSolid, LiaStepForwardSolid } from "react-icons/lia";
import { RiPauseLine, RiPlayFill } from "react-icons/ri";
import { Bars } from "react-loader-spinner"; // Import the loader component

function AudioPlayer({ audio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [durationDisplay, setDurationDisplay] = useState("00:00");
  const [isBuffering, setIsBuffering] = useState(false);
  const [tooltipTime, setTooltipTime] = useState(null);

  const audioPlayer = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleForward = () => {
    audioPlayer.current.currentTime = Math.min(
      audioPlayer.current.currentTime + 10,
      audioPlayer.current.duration
    );
  };

  const handleRewind = () => {
    audioPlayer.current.currentTime = Math.max(
      audioPlayer.current.currentTime - 10,
      0
    );
  };

  const handleSeek = (e) => {
    const seekPosition =
      (e.nativeEvent.offsetX / e.target.clientWidth) *
      audioPlayer.current.duration;
    audioPlayer.current.currentTime = seekPosition;
  };

  const updateProgress = () => {
    if (audioPlayer.current) {
      const currentTime = audioPlayer.current.currentTime;
      const duration = audioPlayer.current.duration;

      setProgress((currentTime / duration) * 100);
      setCurrentTimeDisplay(formatTime(currentTime));
      setDurationDisplay(formatTime(duration));

      if (dotRef.current) {
        dotRef.current.style.left = `${(currentTime / duration) * 100}%`;
      }
    }
  };

  const formatTime = (time) => {
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

    if (audioElement) {
      audioElement.addEventListener("waiting", handleWaiting);
      audioElement.addEventListener("playing", handlePlaying);
      return () => {
        audioElement.removeEventListener("waiting", handleWaiting);
        audioElement.removeEventListener("playing", handlePlaying);
      };
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (progressRef.current) {
      const x = e.nativeEvent.offsetX;
      const time =
        (x / progressRef.current.clientWidth) * audioPlayer.current.duration;
      setTooltipTime(formatTime(time));
    }
  };

  return (
    <div className="audio-player p-4 bg-slate-200 dark:bg-gray-900 text-gray-200 rounded-lg shadow-lg">
      <audio
        ref={audioPlayer}
        src={audio}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
      />
      <div
        ref={progressRef}
        className="relative w-full h-1 bg-gray-600 rounded cursor-pointer"
        onClick={handleSeek}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltipTime(null)}
      >
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        />
        <div
          ref={dotRef}
          className="absolute h-2 w-2 bg-blue-500 rounded-full"
          style={{
            left: `${progress}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        {tooltipTime && (
          <div className="absolute top-0 left-0 mt-1 text-xs bg-gray-900 text-white rounded px-1 py-0.5">
            {tooltipTime}
          </div>
        )}
      </div>
      <div className="controls flex justify-between items-center mt-5">
        <button onClick={handleRewind} aria-label="Rewind 10 seconds">
          <LiaStepBackwardSolid className="h-5 w-5 text-blue-500" />
        </button>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="h-10 w-10 rounded-full ring-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition items-center justify-center flex"
        >
          {isBuffering ? (
            <Bars height="24" width="24" color="#3b82f6" ariaLabel="loading" />
          ) : isPlaying ? (
            <RiPauseLine className="h-7 w-7" />
          ) : (
            <RiPlayFill className="h-7 w-7" />
          )}
        </button>
        <button onClick={handleForward} aria-label="Forward 10 seconds">
          <LiaStepForwardSolid className="h-5 w-5 text-blue-500" />
        </button>
      </div>
      <div className="time-display text-center mt-2 flex justify-between mx-6">
        <div>{currentTimeDisplay}</div>
        <div>{durationDisplay}</div>
      </div>
    </div>
  );
}

export default AudioPlayer;
