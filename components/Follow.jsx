"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Follow = ({ username, following }) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const { data: session } = useSession();

  // Don't render if user is viewing their own profile
  if (!session || session.user.name === username) {
    return null;
  }

  // Function to handle follow/unfollow API calls
  const handleFollowUnfollow = async (action, djusername) => {
    try {
      const response = await fetch(`/api/user/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: session?.user?.name,
          djusername,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${action}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
      throw error;
    }
  };

  const handleFollowToggle = async () => {
    if (!session) {
      // Redirect to login or show login modal
      return;
    }
    setIsFollowingLoading(true);
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
      // Call the API to toggle follow/unfollow
      await handleFollowUnfollow(endpoint, username);

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
      <div className="flex justify-center w-full">
        <button
          onClick={handleFollowToggle}
          disabled={isFollowingLoading}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isFollowing
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors duration-200`}
        >
          {isFollowingLoading ? (
            <FaSpinner className="animate-spin inline" />
          ) : isFollowing ? (
            "Following"
          ) : (
            "Follow"
          )}
        </button>
      </div>
    </div>
  );
};

export default Follow;
