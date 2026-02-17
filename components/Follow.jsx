"use client";
import { useState, useEffect } from "react";
import { FaSpinner, FaUserPlus, FaUserCheck, FaBell } from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Follow = ({ username, following }) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { data: session } = useSession();

  // Don't render if user is viewing their own profile
  if (!session || session.user.name === username) {
    return null;
  }

  const handleFollowAction = async (action) => {
    try {
      const response = await fetch(`/api/user/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          djusername: username,
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${action}`);
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const toggleFollow = async () => {
    if (!session) {
      toast.error("Please sign in to follow DJs", {
        position: "bottom-center",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    const action = isFollowing ? "unfollow" : "follow";
    const actionText = isFollowing ? "unfollowed" : "followed";

    try {
      await handleFollowAction(action);
      setIsFollowing(!isFollowing);

      toast.success(`You ${actionText} ${username}`, {
        position: "bottom-center",
        icon: isFollowing ? "👋" : "🎉",
        duration: 3000,
      });
    } catch (error) {
      toast.error(`Failed to ${action}. Please try again.`, {
        position: "bottom-center",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.button
          onClick={toggleFollow}
          disabled={isLoading}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          className={`
            flex items-center justify-center gap-2 px-2 py-2 rounded-full 
            font-medium text-sm transition-all duration-200 ease-out
            ${
              isFollowing
                ? isHovering
                  ? "bg-red-50 text-red-600 border border-red-200 hover:shadow-red-100/50"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:shadow-gray-100/50"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30"
            }
            ${isLoading ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
            shadow-sm hover:shadow-md min-w-[130px]
          `}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" size={14} />
              <span className="block">Loading...</span>
            </>
          ) : isFollowing ? (
            isHovering ? (
              <>
                <HiOutlineUserRemove size={14} />
                <span className="block">Unfollow</span>
              </>
            ) : (
              <>
                <FaUserCheck size={14} />
                <span className="block">Following</span>
              </>
            )
          ) : (
            <>
              <FaUserPlus size={14} />
              <span className="block">Follow</span>
            </>
          )}

          {/* Invisible element to reserve space for longest possible text */}
          <span className="invisible absolute pointer-events-none">
            <FaUserCheck size={14} />
            <span>Unfollowing...</span>
          </span>
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export default Follow;
