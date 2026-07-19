"use client";
import React, { useEffect, useState, useRef } from "react";
import { MdManageSearch, MdOutlineSearchOff } from "react-icons/md";
import { FaMagnifyingGlass, FaSpinner } from "react-icons/fa6";
import MixCard from "./MixCard";
import { useInView } from "react-intersection-observer";

const LIMIT = 10;

const MixCardSkeleton = () => (
  <div className="p-2 w-full animate-pulse">
    <div className="dark:bg-gray-800/90 bg-white rounded-xl flex flex-col sm:flex-row gap-3 p-3 sm:p-4 w-full shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="w-full sm:w-28 sm:h-28 h-32 flex-shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const NoValueState = () => (
  <div className="w-full py-16 flex justify-center items-center">
    <div className="text-center p-6 max-w-sm mx-auto">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
        <MdOutlineSearchOff className="h-8 w-8 text-indigo-500 dark:text-indigo-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-2">
        Discover Mixtapes
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
        Search by title, DJ name, or genre...
      </p>
    </div>
  </div>
);

const NoResultsState = ({ query }) => (
  <div className="w-full py-16 flex justify-center items-center">
    <div className="text-center p-6 max-w-sm mx-auto">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
        <MdManageSearch className="h-8 w-8 text-indigo-500 dark:text-indigo-300" />
      </div>
      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
        No results found for &quot;{query}&quot;
      </h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Try a different DJ name, title, or genre
      </p>
    </div>
  </div>
);

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(inputValue, 500);
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  // Global event listener to open modal
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    window.addEventListener("openSearch", handleOpen);
    return () => window.removeEventListener("openSearch", handleOpen);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fresh search whenever debounced query changes
  useEffect(() => {
    if (!isOpen) return;

    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setHasMore(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setHasSearched(true);
      setPage(1);
      try {
        const res = await fetch(
          `/api/search/mixtape?query=${encodeURIComponent(debouncedQuery)}&limit=${LIMIT}&page=1`,
        );
        const data = await res.json();
        const items = data.results ?? [];
        setResults(items);
        setHasMore(items.length === LIMIT);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [debouncedQuery, isOpen]);

  // Load more when sentinel comes into view
  useEffect(() => {
    if (!inView || !hasMore || loading || loadingMore || !debouncedQuery.trim() || !isOpen)
      return;

    const run = async () => {
      setLoadingMore(true);
      const nextPage = page + 1;
      try {
        const res = await fetch(
          `/api/search/mixtape?query=${encodeURIComponent(debouncedQuery)}&limit=${LIMIT}&page=${nextPage}`,
        );
        const data = await res.json();
        const items = data.results ?? [];
        setResults((prev) => [...prev, ...items]);
        setPage(nextPage);
        setHasMore(items.length === LIMIT);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMore(false);
      }
    };
    run();
  }, [inView, hasMore, loading, loadingMore, debouncedQuery, page, isOpen]);

  if (!isOpen) return null;

  const isSearching = loading;
  const showEmpty = !hasSearched && !inputValue;
  const showNone = hasSearched && !loading && results.length === 0;
  const showResults = hasSearched && !loading && results.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-16 sm:pt-24 px-4 pb-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <FaMagnifyingGlass className="h-5 w-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search mixtapes, DJs, genres..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
          />
          {isSearching && <FaSpinner className="animate-spin text-indigo-500 mx-2" size={18} />}
          
          <button
            onClick={() => setIsOpen(false)}
            className="ml-2 px-2 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
          {showEmpty && <NoValueState />}

          {isSearching && !showResults && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <MixCardSkeleton key={i} />
              ))}
            </div>
          )}

          {showNone && <NoResultsState query={inputValue} />}

          {showResults && (
            <div className="space-y-2" onClick={() => setIsOpen(false)}>
              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 pb-1">
                Top Results
              </p>
              {results.map((mix) => (
                <MixCard
                  key={mix.unique}
                  link={`/mix/${mix.unique}`}
                  title={mix.title}
                  img={mix.imgthumb}
                  Djname={mix.djName}
                  plays={mix.totalPlays}
                  downloads={mix.totalDownloads}
                  loading={true}
                />
              ))}

              {loadingMore && (
                <div className="pt-2">
                  <MixCardSkeleton />
                </div>
              )}
              {hasMore && <div ref={sentinelRef} className="h-4" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
