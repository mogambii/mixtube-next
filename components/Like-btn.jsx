"use client";
import { handleLIkeAndUnlike } from "@/actions/handlers";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";

const Likebtn = ({ id, likedparam }) => {
  const [liked, setLiked] = useState(likedparam);

  const handleLikeToggle = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState); 

    try {
      const endpoint = newLikedState ? "like" : "unlike";
      await handleLIkeAndUnlike({ action: endpoint, id: id });
    } catch (error) {
      console.error(`Failed to ${newLikedState ? "like" : "unlike"} mixtape:`, error);
      toast.error(`Failed to ${newLikedState ? "like" : "unlike"} mixtape`);
      setLiked(!newLikedState); 
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
