"use client";
import { handleLIkeAndUnlike } from "@/actions/handlers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHeart, FaSpinner } from "react-icons/fa";

const Likebtn = ({ id, likedparam }) => {
  const [liked, setLiked] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setLiked(likedparam);
      setToken(localStorage.getItem("mixtube-token"));
    }
  }, [likedparam]);

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
    <div>
      {token ? (
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
      ) : (
        <h4 className="mt-4 text-gray-600 dark:text-gray-400">
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>{" "}
          to like and comment
        </h4>
      )}
    </div>
  );
};

export default Likebtn;
