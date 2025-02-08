"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Likebtn = ({ id, likedparam }) => {
  const [liked, setLiked] = useState(likedparam);
  const { data: session } = useSession();

  const handleLikeToggle = async () => {
    if (!session) {
      toast.error("Please login to like mixtapes");
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState); // Optimistic update

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
      setLiked(!newLikedState); // Revert the optimistic update
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`flex items-center p-3 rounded-full transition-colors duration-300 ${
        liked ? "ring-1 ring-blue-600 text-blue-600" : "bg-gray-200 text-red-500 ring-1 ring-red-500"
      } hover:bg-blue-600`}
    >
      <FaHeart className={`${liked ? "text-blue-600" : "text-red-500"}`} />
    </button>
  );
};

export default Likebtn;