"use client";
import React from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";

const Download_btn = ({ url, id }) => {
  const { data: session } = useSession();

  const handleDownload = async () => {
    if (!session) {
      toast.error("Please login to download mixtapes");
      return;
    }

    try {
      // First update the download count
      const response = await fetch(`/api/mixtape/download/${id}`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update download count");
      }

      // Then open the URL in a new tab to initiate the download
      window.open(url, "_blank");
      toast.success("Download started");
    } catch (error) {
      console.error("Error handling download:", error);
      toast.error(error.message || "Failed to start download");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!session}
    >
      <FaDownload />
      <span>Download</span>
    </button>
  );
};

export default Download_btn;
