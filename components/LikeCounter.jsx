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
    <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center transform transition-all duration-500 hover:scale-105 ${isAnimating ? 'shadow-md ring-1 ring-red-300 dark:ring-red-700' : 'hover:shadow-md'}`}>
      <div className={`p-3 rounded-lg mr-4 transition-all duration-500 ${isAnimating ? 'bg-red-200 dark:bg-red-800/50 scale-110' : 'bg-red-100 dark:bg-red-900/30'}`}>
        <FaHeart className={`h-5 w-5 transition-all duration-500 ${isAnimating ? 'text-red-600 dark:text-red-400 scale-110' : 'text-red-500 dark:text-red-400'}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Likes
        </p>
        <p className={`text-xl font-bold transition-all duration-500 ${isAnimating ? 'text-red-600 dark:text-red-400 scale-105 transform' : 'text-gray-800 dark:text-gray-200'}`}>
          {count.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default LikeCounter;
