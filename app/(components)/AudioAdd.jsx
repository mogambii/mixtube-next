"use client";
import React, { useState } from "react";
import { IoPlay } from "react-icons/io5";
import { usePlayerContext } from "@/context/PlayerContext";
import { RiMusic2Fill } from "react-icons/ri";

const AudioAdd = ({ id }) => {
  const { playMix, currentMix } = usePlayerContext();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Check if this is the currently playing mixtape
  const isCurrentlyPlaying = currentMix && currentMix.id === id;

  const handlePlay = () => {
    setIsClicked(true);
    playMix(id);

    // Reset the click animation after a short delay
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <div className="relative">
      <button
        onClick={handlePlay}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`
          relative overflow-hidden
          flex items-center justify-center
          w-full h-full
          rounded-full
          transition-all duration-500
          ${
            isCurrentlyPlaying
              ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white ring-2 ring-purple-300 dark:ring-purple-900"
              : "bg-gradient-to-tr from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          }
          ${isClicked ? "scale-95" : ""}
          transform hover:scale-110 active:scale-95
          shadow-lg hover:shadow-purple-500/30
        `}
        aria-label="Play mixtape"
      >
        {/* Ripple effect on hover */}
        <span
          className={`
            absolute inset-0 rounded-full
            bg-white/20 transform scale-0
            transition-transform duration-700 ease-out
            ${isHovering ? "scale-[2.5]" : ""}
            opacity-0 ${isHovering ? "opacity-30" : ""}
          `}
        />

        {/* Icon with pulse animation when playing */}
        <div className="relative z-10">
          {isCurrentlyPlaying ? (
            <div className="relative">
              <RiMusic2Fill className="text-white text-lg" />
              {/* Pulsing circle animation */}
              <span className="absolute inset-0 rounded-full bg-white/30 p-1 animate-ping opacity-75"></span>
            </div>
          ) : (
            <IoPlay className="text-white text-lg p-1" />
          )}
        </div>
      </button>
    </div>
  );
};

export default AudioAdd;
