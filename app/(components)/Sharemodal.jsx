"use client";

import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaWhatsapp, FaLink } from "react-icons/fa";

const ShareModal = ({ show, onClose, url }) => {
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Share This Mixtape
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-5">
          <div className="grid grid-cols-5 gap-4 justify-items-center">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1 hover:scale-110 transition-transform"
              aria-label="Share on Facebook"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FaFacebook className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Facebook
              </span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1 hover:scale-110 transition-transform"
              aria-label="Share on Twitter"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <BsTwitterX className="text-black dark:text-white text-xl" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Twitter
              </span>
            </a>

            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1 hover:scale-110 transition-transform"
              aria-label="Share on Instagram"
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <FaInstagram className="text-pink-600 dark:text-pink-400 text-xl" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Instagram
              </span>
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-1 hover:scale-110 transition-transform"
              aria-label="Share on WhatsApp"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FaWhatsapp className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                WhatsApp
              </span>
            </a>

            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center space-y-1 hover:scale-110 transition-transform"
              aria-label="Copy link"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <FaLink className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {copySuccess ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <div className="relative">
            <input
              type="text"
              value={url}
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 pr-10 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCopyLink}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              aria-label="Copy link"
            >
              {copySuccess ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
