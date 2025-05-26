"use client";
import React, { useState, useEffect } from "react";
import { IoPlay } from "react-icons/io5";
import { usePlayerContext } from "@/context/PlayerContext";
import { RiMusic2Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const AudioAdd = ({ id }) => {
  const { playMix, currentMix } = usePlayerContext();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Check if this is the currently playing mixtape
  const isCurrentlyPlaying = currentMix && currentMix.id === id;

  // Reset animation key when playing status changes for smooth transitions
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [isCurrentlyPlaying]);

  const handlePlay = () => {
    setIsClicked(true);
    playMix(id);

    // Reset the click animation after a short delay
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <div className="relative group">
      <motion.button
        onClick={handlePlay}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`
          relative overflow-hidden
          flex items-center justify-center
          w-full h-full
          rounded-full
          ${isCurrentlyPlaying
            ? "bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white"
            : "bg-gradient-to-tr from-purple-500 via-violet-500 to-indigo-500 text-white"}
          shadow-lg
        `}
        style={{
          boxShadow: isCurrentlyPlaying 
            ? "0 0 15px rgba(147, 51, 234, 0.5), 0 0 30px rgba(79, 70, 229, 0.3)" 
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
        aria-label="Play mixtape"
      >
        {/* Glowing ring for currently playing */}
        {isCurrentlyPlaying && (
          <motion.div 
            key={`ring-${animationKey}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 rounded-full ring-2 ring-purple-400/70 dark:ring-purple-600/70"
          />
        )}

        {/* Enhanced ripple effect on hover */}
        <AnimatePresence>
          {isHovering && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-white/20"
            />
          )}
        </AnimatePresence>

        {/* Icon with enhanced animations */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={isCurrentlyPlaying ? "playing" : "paused"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {isCurrentlyPlaying ? (
              <div className="relative flex items-center justify-center p-1">
                <RiMusic2Fill className="text-white text-lg" />
                {/* Multiple pulsing circles for more dynamic effect */}
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-75 animation-delay-0"></span>
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-50 animation-delay-300"></span>
              </div>
            ) : (
              <div className="flex items-center justify-center p-1 group-hover:translate-x-0.5 transition-transform duration-300">
                <IoPlay className="text-white text-lg" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Optional subtle glow effect */}
      {isCurrentlyPlaying && (
        <div className="absolute inset-0 -z-10 blur-md opacity-30 bg-purple-500 rounded-full scale-75"></div>
      )}
    </div>
  );
};

export default AudioAdd;
