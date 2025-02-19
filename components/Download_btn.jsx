"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaDownload, FaSpinner } from "react-icons/fa";

const Download_btn = ({ url, id }) => {
  const { data: session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!session) {
      toast.error("Please login to download mixtapes");
      return;
    }

    if (!url || !id) {
      toast.error("Invalid download parameters");
      return;
    }

    setIsDownloading(true);
    try {
      // Update the download count in the database
      const response = await fetch(`/api/mixtape/download/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update download count");
      }

      // Construct download URL with proper encoding
      const downloadUrl = `https://storage.mixtube.xyz/download/${encodeURIComponent(id)}`;
      
      // Create a hidden anchor tag and force a download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `mixtape-${id}.mp3`; // Set a default filename
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

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!session || isDownloading}
    >
      <FaDownload className={isDownloading ? "animate-pulse" : ""} />
      <span>{isDownloading ? (
        <FaSpinner className="animate-spin"  size={20} />
      ) : "Download"}</span>
    </button>
  );
};

export default Download_btn;
