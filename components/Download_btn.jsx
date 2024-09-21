"use client";
import { handleUpdateDownloads } from "@/actions/handlers";
import React from "react";

const Download_btn = ({ url, id }) => {
  // Function to handle the download
  const handleDownload = async () => {
    try {
      // Open the URL in a new tab to initiate the download
      window.open(url, "_blank");

      // Update the downloads count after initiating the download
      await handleUpdateDownloads(id);
    } catch (error) {
      console.error("Error initiating the download:", error);
      alert("An error occurred while downloading the file.");
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="mt-4 w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Download
      </button>
    </div>
  );
};

export default Download_btn;
