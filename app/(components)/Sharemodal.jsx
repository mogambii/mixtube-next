import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaWhatsapp, FaLink } from "react-icons/fa";

const ShareModal = ({ show, onClose, url }) => {
  if (!show) return null;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 md:w-96 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
          Share
        </h3>
        <div className="flex justify-around text-gray-600 dark:text-gray-400">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <FaFacebook className="text-blue-600 text-2xl" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              url
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <BsTwitterX className=" dark:text-slate-50  text-black text-2xl" />
          </a>
          <a
            href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <FaInstagram className="text-pink-500 text-2xl" />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <FaWhatsapp className="text-green-500 text-2xl" />
          </a>
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center"
          >
            <FaLink className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span className="text-sm">Copy</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
