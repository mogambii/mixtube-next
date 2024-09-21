"use client";
import { handleLIkeAndUnlike } from "@/actions/handlers";
import React, { useEffect, useState } from "react";
import { FaHeart, FaSpinner } from "react-icons/fa";

const Likebtn = ({ id, likedparam }) => {
  console.log(likedparam)
  const [liked, setLiked] = useState(likedparam);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeToggle = async () => {
    setIsLiking(true);
    const endpoint = liked ? "unlike" : "like";

    try {
      try {
    await handleLIkeAndUnlike({action: endpoint, id: id})

      } catch (error) {
        console.log(error)
      }

      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error(`Failed to ${liked ? "unlike" : "like"} mixtape:`, error);
      alert("An error occurred while processing your like.");
    } finally {
      setIsLiking(false);
    }
  };

  if (!isMounted || !token) {
    return null;
  }

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
          <FaHeart
            className={`ml-2 ${liked ? "text-white" : "text-red-500"}`}
          />
        </button>
      )
};

export default Likebtn;
