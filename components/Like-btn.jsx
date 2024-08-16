"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHeart, FaSpinner } from "react-icons/fa";

const Likebtn = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [token, SetToken] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      SetToken(localStorage.getItem("mixtube-token"));
    }
  }, []);

  async function CheckLIked() {
    try {
      setLoading(true);
      const results = await fetch(
        `https://server-nezz.vercel.app/api/checkliked?post=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await results.json();
      setLiked(res.liked);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (token) CheckLIked();
  }, [token]);
  const handleLikeToggle = async () => {
    setIsLiking(true);
    const endpoint = liked ? "unlike" : "like";

    try {
      const res = await fetch(
        `https://server-nezz.vercel.app/api/${endpoint}?post=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok)
        throw new Error(`Failed to ${liked ? "unlike" : "like"} mixtape`);

      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error(`Failed to ${liked ? "unlike" : "like"} mixtape:`, error);
      alert("An error occurred while processing your like.");
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h3>loading..</h3>
      </div>
    );
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
