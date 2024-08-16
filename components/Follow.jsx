"use client";
import Spinner from "@/app/(components)/Spinner";
import { useState } from "react";
const Follow = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
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
      if (endpoint === "follow") {
      } else {
      }

      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to follow/unfollow.");
    } finally {
      setIsFollowingLoading(false);
    }
  };
  if(!localStorage.getItem("mixtube-token")){
    return null
  }
  return (
    <div>
      <div className=" flex  gap-x-2">
        {localStorage.getItem("mixtube-token") && (
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
              <Spinner className="text-slate-50 animate-spin" />
            ) : isFollowing ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Follow;
