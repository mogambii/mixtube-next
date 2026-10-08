"use client";

import React, { useState } from "react";
import { usePlayerContext } from "@/context/PlayerContext";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Play,
  Volume2,
  Download,
  Heart,
  Share2,
  Loader2,
  Check,
} from "lucide-react";

export default function MixHeroActions({ id, title, initialLiked, initialLikesCount }) {
  const { playMix, currentMix } = usePlayerContext();
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCurrentlyPlaying = currentMix && currentMix.id === id;

  const handlePlay = async () => {
    try {
      await playMix(id);
    } catch (err) {
      console.error("Error playing mix:", err);
      toast.error("Failed to start playback");
    }
  };

  const handleDownload = async () => {
    if (!id) {
      toast.error("Invalid download parameters");
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/mixtape/download/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update download count");
      }

      const downloadUrl = `https://storage.mixtapped.com/download/${encodeURIComponent(id)}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title || id}.mp3`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started successfully");
    } catch (error) {
      console.error("Error handling download:", error);
      toast.error(error.message || "Failed to start download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!session) {
      toast.error("Please login to like mixtapes");
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState); // Optimistic update

    // Notify LikeCounter
    const event = new CustomEvent("likeCountUpdated", {
      detail: { mixtapeId: id, increment: newLikedState },
    });
    window.dispatchEvent(event);

    try {
      const response = await fetch(`/api/mixtape/user/${id}/like`, {
        method: newLikedState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update like status");
      toast.success(data.message);
    } catch (error) {
      console.error("Like toggle error:", error);
      toast.error(error.message || "Failed to update like status");
      setLiked(!newLikedState);
      const revertEvent = new CustomEvent("likeCountUpdated", {
        detail: { mixtapeId: id, increment: !newLikedState },
      });
      window.dispatchEvent(revertEvent);
    }
  };

  const handleShareClick = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: title || "Check out this mixtape",
          url: url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
      {/* ── 1. SIMPLE CLEAN PLAY BUTTON ── */}
      <button
        onClick={handlePlay}
        className={`
          w-full sm:w-auto sm:min-w-[160px]
          bg-indigo-600 hover:bg-indigo-500 text-white
          font-bold text-sm sm:text-base
          px-6 py-3.5 rounded-full
          shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40
          transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
          flex items-center justify-center gap-2.5 cursor-pointer
          ${isCurrentlyPlaying ? "ring-2 ring-indigo-400" : ""}
        `}
      >
        {isCurrentlyPlaying ? (
          <>
            <Volume2 className="h-4 w-4 text-white animate-pulse" />
            <span>Now Playing</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
            <span>Play</span>
          </>
        )}
      </button>

      {/* ── 2. SECONDARY PILL BUTTONS (Download, Like, Share) ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
        {/* Download MP3 */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="
            flex-1 sm:flex-none
            bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20
            border border-white/15 text-white
            font-medium text-xs sm:text-sm
            px-4 sm:px-5 py-3.5 rounded-full
            transition-all duration-200 transform hover:scale-105 active:scale-95
            flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50
          "
          aria-label="Download MP3"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          ) : (
            <Download className="h-4 w-4 text-emerald-400" />
          )}
          <span>Download</span>
        </button>

        {/* Like */}
        <button
          onClick={handleLikeToggle}
          className={`
            flex-1 sm:flex-none
            border font-medium text-xs sm:text-sm
            px-4 sm:px-5 py-3.5 rounded-full
            transition-all duration-200 transform hover:scale-105 active:scale-95
            flex items-center justify-center gap-2 cursor-pointer
            ${
              liked
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
            }
          `}
          aria-label={liked ? "Unlike mixtape" : "Like mixtape"}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-300 ${
              liked ? "fill-rose-500 text-rose-500 scale-110" : "text-gray-200"
            }`}
          />
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShareClick}
          className="
            flex-1 sm:flex-none
            bg-white/10 hover:bg-white/20
            border border-white/15 text-white
            font-medium text-xs sm:text-sm
            px-4 sm:px-5 py-3.5 rounded-full
            transition-all duration-200 transform hover:scale-105 active:scale-95
            flex items-center justify-center gap-2 cursor-pointer
          "
          aria-label="Share Mix"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-gray-200" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
