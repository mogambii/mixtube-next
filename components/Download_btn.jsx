"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaDownload, FaSpinner } from "react-icons/fa";

const Download_btn = ({ id }) => {
  const { data: session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!id) {
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
      const downloadUrl = `https://storage.mixtube.xyz/download/${encodeURIComponent(
        id
      )}`;

      // Create a hidden anchor tag and force a download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `mixtape-${id}.mp3`; // Set a default filename
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open an external link in a new tab after download starts
      const externalLink = "https://www.profitableratecpm.com/y5ffkwhme?key=17359f4bbc9a1475cdac44bd6fdc0a88";
      window.open(externalLink, "_blank");

      toast.success("Download started successfully");
    } catch (error) {
      console.error("Error handling download:", error);
      toast.error(
        error.message || "Failed to start download. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="text-green-600 dark:text-green-400 focus:outline-none"
      disabled={isDownloading}
      aria-label="Download mixtape"
    >
      {isDownloading ? (
        <FaSpinner className="animate-spin h-6 w-6" />
      ) : (
        <FaDownload className="h-6 w-6" />
      )}
    </button>
  );
};

export default Download_btn;
