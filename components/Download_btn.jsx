"use client";
import React from "react";

const Download_btn = ({ url }) => {
  const updateDownloads = async () => {
    if (!id) return;

    try {
      await fetch(`https://server-nezz.vercel.app/api/download/${id}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Failed to update downloads:", error);
    }
  };
  const handleDownload = async () => {
    try {
      await updateDownloads();
      const downloadUrl = url;
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${mix.title || id}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
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
