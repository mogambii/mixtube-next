"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";

// Create a context to share like count state across components
export const LikeContext = createContext();

export function LikeProvider({ children, initialLikeCount, mixtapeId }) {
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  
  return (
    <LikeContext.Provider value={{ likeCount, setLikeCount, mixtapeId }}>
      {children}
    </LikeContext.Provider>
  );
}

// Custom hook to use the like context
export function useLikeCount() {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLikeCount must be used within a LikeProvider");
  }
  return context;
}

const Likebtn = ({ id, likedparam, initialCount }) => {
  const [liked, setLiked] = useState(likedparam);
  const { data: session } = useSession();
  const contextValue = useContext(LikeContext);
  
  // If context is available, use it; otherwise use local state
  const [localLikeCount, setLocalLikeCount] = useState(initialCount || 0);
  
  // Function to update like count both in context (if available) and locally
  const updateLikeCount = (increment) => {
    if (contextValue) {
      contextValue.setLikeCount(prev => increment ? prev + 1 : prev - 1);
    }
    setLocalLikeCount(prev => increment ? prev + 1 : prev - 1);
    
    // Dispatch a custom event to notify other components about the like count change
    const event = new CustomEvent('likeCountUpdated', { 
      detail: { mixtapeId: id, increment } 
    });
    window.dispatchEvent(event);
  };

  const handleLikeToggle = async () => {
    if (!session) {
      toast.error("Please login to like mixtapes");
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState); // Optimistic update
    
    // Update like count optimistically
    updateLikeCount(newLikedState);

    try {
      const response = await fetch(`/api/mixtape/user/${id}/like`, {
        method: newLikedState ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update like status");
      }

      toast.success(data.message);
    } catch (error) {
      console.error(`Failed to ${newLikedState ? "like" : "unlike"} mixtape:`, error);
      toast.error(error.message || `Failed to ${newLikedState ? "like" : "unlike"} mixtape`);
      
      // Revert the optimistic updates
      setLiked(!newLikedState);
      updateLikeCount(!newLikedState);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`flex items-center p-3 rounded-full transition-all duration-500 ${
        liked 
          ? "ring-2 ring-red-600 bg-red-50 dark:bg-red-900/30 scale-110" 
          : "ring-1 ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800 hover:ring-red-400 dark:hover:ring-red-400"
      } hover:bg-red-100 dark:hover:bg-red-900/40 transform hover:scale-105 active:scale-95`}
      aria-label={liked ? "Unlike mixtape" : "Like mixtape"}
    >
      <FaHeart 
        className={`transform transition-all duration-500 ${liked 
          ? "text-red-600 dark:text-red-500 scale-110" 
          : "text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400"}`} 
      />
    </button>
  );
};

export default Likebtn;