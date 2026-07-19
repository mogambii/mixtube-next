"use client";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

const LikeCounter = ({ initialCount, mixtapeId }) => {
  const [count, setCount] = useState(initialCount || 0);

  useEffect(() => {
    // Update the count when the initial count prop changes
    setCount(initialCount || 0);
  }, [initialCount]);

  useEffect(() => {
    // Listen for like count updates from the LikeBtn component
    const handleLikeCountUpdate = (event) => {
      if (event.detail.mixtapeId === mixtapeId) {
        setCount(prevCount => 
          event.detail.increment ? prevCount + 1 : prevCount - 1
        );
      }
    };

    // Add event listener
    window.addEventListener('likeCountUpdated', handleLikeCountUpdate);

    // Clean up
    return () => {
      window.removeEventListener('likeCountUpdated', handleLikeCountUpdate);
    };
  }, [mixtapeId]);

  // Determine if the count has recently changed
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Trigger animation when count changes
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className={`bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all duration-500 ${isAnimating ? "ring-2 ring-red-400/50 shadow-lg shadow-red-500/10" : ""}`}>
      <div className={`p-3 rounded-xl transition-all duration-500 ${isAnimating ? "bg-red-500/20 scale-110" : "bg-red-500/10"}`}>
        <FaHeart className={`h-5 w-5 transition-all duration-500 ${isAnimating ? "text-red-500 scale-110" : "text-red-400"}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Likes</p>
        <p className={`text-xl font-bold transition-all duration-500 ${isAnimating ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
          {count.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default LikeCounter;
