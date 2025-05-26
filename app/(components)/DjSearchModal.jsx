"use client";
import React, { useState, useEffect } from "react";
import { FaMagnifyingGlass, FaSpinner } from "react-icons/fa6";
import { MdClose, MdManageSearch } from "react-icons/md";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (value !== debouncedValue) setIsTyping(true);

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsTyping(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, debouncedValue]);

  return { debouncedValue, isTyping };
}

// Skeleton loader
const ProfileCardSkeleton = () => (
  <div className="block rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md h-full w-full p-1">
    <div className="flex flex-col items-center h-full w-full p-3 sm:p-4">
      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full mb-3 sm:mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const DjSearchModal = ({ isOpen, onClose }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [lastSearchedTerm, setLastSearchedTerm] = useState("");

  const { debouncedValue: debouncedSearchTerm, isTyping } = useDebounce(
    searchInput,
    500
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchInput("");
      setSearchResults([]);
      setHasNoResults(false);
      setLastSearchedTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      debouncedSearchTerm &&
      debouncedSearchTerm.trim().length > 0 &&
      debouncedSearchTerm !== lastSearchedTerm
    ) {
      fetchDjs(debouncedSearchTerm);
      setLastSearchedTerm(debouncedSearchTerm);
    } else if (debouncedSearchTerm.trim().length === 0) {
      setSearchResults([]);
      setHasNoResults(false);
      setLastSearchedTerm("");
    }
  }, [debouncedSearchTerm, lastSearchedTerm]);

  const fetchDjs = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    const timestamp = Date.now();
    const apiUrl = `/api/dj-search?query=${encodeURIComponent(
      query
    )}&limit=10&_=${timestamp}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const responseData = await response.json();
      setSearchResults(responseData.results || []);
      setHasNoResults((responseData.results || []).length === 0);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error searching DJs:", error);
        setSearchResults([]);
        setHasNoResults(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto pt-16 pb-8"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 backdrop-blur-md backdrop-saturate-150">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                {isSearching ? (
                  <FaSpinner className="animate-spin text-indigo-500 dark:text-indigo-400" />
                ) : isTyping ? null : (
                  <FaMagnifyingGlass className="text-indigo-500 dark:text-indigo-400" />
                )}
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search for DJs by name..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-inner transition-all duration-200"
                autoFocus
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setLastSearchedTerm("");
                  }}
                  className="absolute inset-y-0 right-3 flex items-center"
                  aria-label="Clear search"
                >
                  <MdClose className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              aria-label="Close search"
            >
              <MdClose size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {debouncedSearchTerm && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center animate-fadeIn">
              <span className="font-medium">Searching for:</span>
              <span className="ml-2 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md text-indigo-700 dark:text-indigo-300 font-medium">
                {debouncedSearchTerm}
              </span>
              {isTyping && (
                <span className="ml-2 text-xs text-indigo-500 dark:text-indigo-400 italic animate-pulse">
                  typing...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth min-h-svh">
          {isSearching && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProfileCardSkeleton key={i} />
              ))}
            </div>
          )}

          {hasNoResults && !isSearching && (
            <div className="flex flex-col items-center justify-center min-h-svh py-12 text-center animate-fadeIn">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-full mb-4 shadow-inner">
                <MdManageSearch className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No DJs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                We couldn&apos;t find any DJs matching &quot;{searchInput}
                &quot;. Try a different search term.
              </p>
            </div>
          )}

          {searchResults.length > 0 && !isSearching && (
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Found {searchResults.length}{" "}
                {searchResults.length === 1 ? "DJ" : "DJs"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fadeIn">
                {searchResults.map((dj) => (
                  <div
                    key={dj.username}
                    className="w-full h-full hover:scale-105 transition-all duration-200 hover:shadow-lg rounded-xl overflow-hidden"
                  >
                    <Link
                      href={`/dj/${dj.username}`}
                      className="block h-full"
                      onClick={onClose}
                    >
                      <ProfileCard
                        Djname={dj.djName}
                        profilep={dj.profilep}
                        name={dj.username}
                        isVerified={false}
                        followers={dj._count?.followedBy || 0}
                        mixtapes={dj._count?.mixtapes || 0}
                        className="h-full"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}

          {!isSearching && searchResults.length === 0 && !hasNoResults && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn min-h-svh">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-full mb-4 shadow-inner">
                <FaMagnifyingGlass className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Search for DJs
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Type a DJ name in the search box above to find your favorite
                DJs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DjSearchModal;
