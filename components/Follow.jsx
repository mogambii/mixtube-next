"use client";
import { useState, useEffect } from "react";
import { FaSpinner, FaUserPlus, FaUserCheck, FaBell } from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Follow = ({ username, following }) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
          email: session?.user?.email,
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
      toast.error("Please sign in to follow DJs", {
        position: "bottom-center",
        duration: 3000,
      });
      return;
    }
    
    setIsFollowingLoading(true);
    const endpoint = isFollowing ? "unfollow" : "follow";
    const actionText = isFollowing ? "unfollowed" : "followed";

    try {
      // Call the API to toggle follow/unfollow
      await handleFollowUnfollow(endpoint, username);

      // Toggle the local state
      setIsFollowing((prev) => !prev);
      
      // Show success toast
      toast.success(`You have ${actionText} ${username}`, {
        position: "bottom-center",
        icon: isFollowing ? "👋" : "🎉",
        duration: 3000,
      });
    } catch (error) {
      toast.error(`Failed to ${endpoint} ${username}. Please try again.`, {
        position: "bottom-center",
        duration: 3000,
      });
    } finally {
      setIsFollowingLoading(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        <motion.button
          onClick={handleFollowToggle}
          disabled={isFollowingLoading}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          className={`
            flex items-center justify-center gap-2 px-5 py-2.5 rounded-full 
            font-medium text-sm shadow-sm transition-all duration-300 
            ${isFollowing 
              ? isHovering
                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              : "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600"}
            ${isFollowingLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {isFollowingLoading ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              <span>{isFollowing ? "Unfollowing..." : "Following..."}</span>
            </>
          ) : isFollowing ? (
            <>
              {isHovering ? (
                <>
                  <HiOutlineUserRemove className="text-red-500" />
                  <span>Unfollow</span>
                </>
              ) : (
                <>
                  <FaUserCheck />
                  <span>Following</span>
                </>
              )}
            </>
          ) : (
            <>
              <FaUserPlus />
              <span>Follow</span>
            </>
          )}
        </motion.button>
      </AnimatePresence>
      
      {isFollowing && !isHovering && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100 whitespace-nowrap"
        >
          <div className="flex items-center gap-1">
            <FaBell className="text-indigo-500" size={10} />
            <span>You'll receive updates</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Follow;
