"use client";
import React from "react";

const Download_btn = ({ url, id }) => {
  // Function to handle the download
  const handleDownload = async () => {
    try {
      // Use the proxy API to download the file
      const response = await fetch(`/api/download?id=${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob();

      // Create a Blob URL and trigger the download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${id}.mp3`); // Set a default filename or custom one

      // Programmatically trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL after download
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the file:", error);
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
