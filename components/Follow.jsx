"use client";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const Follow = ({ username }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(true);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const res = await fetch(
          `https://server-nezz.vercel.app/api/user/check_follow?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("mixtube-token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to check following status");
        }

        const results = await res.json();
        setIsFollowing(results.is_followed);
      } catch (error) {
        console.error("Error checking following status:", error);
      } finally {
        setIsFollowingLoading(false);
      }
    };

    if (typeof window !== "undefined" && localStorage.getItem("mixtube-token")) {
      checkFollowing();
    }
  }, [username]);

  const handleFollowToggle = async () => {
    setIsFollowingLoading(true);
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/user/engage/${endpoint}?username=${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("mixtube-token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} user`);
      }

      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error(`Error trying to ${endpoint}:`, error);
      alert("An error occurred while trying to follow/unfollow.");
    } finally {
      setIsFollowingLoading(false);
    }
  };


  return (
    <div>
      <div className="flex gap-x-2">
        <button
          onClick={handleFollowToggle}
          className={`mt-2 px-4 py-3 rounded-3xl transition-colors duration-300 ${
            isFollowing
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isFollowingLoading}
        >
          {isFollowingLoading ? (
            <FaSpinner className="text-slate-50 animate-spin" />
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </button>
      </div>
    </div>
  );
};

export default Follow;
