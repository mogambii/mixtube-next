"use client";
import { handleLIkeAndUnlike } from "@/actions/handlers";
import React, { useState } from "react";
import { FaHeart, FaSpinner } from "react-icons/fa";

const Likebtn = ({ id, likedparam }) => {
  const [liked, setLiked] = useState(likedparam);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeToggle = async () => {
    const newLikedState = !liked; // Optimistic update
    setLiked(newLikedState);
    setIsLiking(true);

    try {
      const endpoint = newLikedState ? "like" : "unlike";
      await handleLIkeAndUnlike({ action: endpoint, id: id });
    } catch (error) {
      console.error(`Failed to ${newLikedState ? "like" : "unlike"} mixtape:`, error);
      alert("An error occurred while processing your like.");
      setLiked(!newLikedState); // Revert to previous state if API call fails
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`flex items-center px-4 py-2 rounded-full transition-colors duration-300 ${
        liked ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
      } hover:bg-blue-600`}
      disabled={isLiking}
    >
      {isLiking ? (
        <FaSpinner className="animate-spin h-6" />
      ) : liked ? (
        "Unlike"
      ) : (
        "Like"
      )}
      <FaHeart className={`ml-2 ${liked ? "text-white" : "text-red-500"}`} />
    </button>
  );
};

export default Likebtn;
