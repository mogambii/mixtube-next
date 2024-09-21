"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const Follow = ({ username, following }) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);


  const handleFollowToggle = async () => {
    setIsFollowingLoading(true);
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
      // Call the API to toggle follow/unfollow
      await handleFollowToggle(endpoint, username);

      // Toggle the local state
      setIsFollowing((prev) => !prev);
    } catch (error) {
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
