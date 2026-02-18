"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { MdManageSearch, MdOutlineSearchOff } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaDownload, FaRegCirclePlay, FaSpinner } from "react-icons/fa6";
import MixCard from "../(components)/MixCard";
import NavMenu from "@/components/NavMenu";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

const LIMIT = 10;

// Matches MixCard layout exactly
const MixCardSkeleton = () => (
  <div className="p-2 w-full animate-pulse">
    <div className="dark:bg-gray-800/90 bg-white rounded-xl flex flex-col sm:flex-row gap-3 p-3 sm:p-4 w-full shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Image placeholder */}
      <div className="w-full sm:w-40 sm:h-40 h-48 flex-shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
      {/* Content placeholder */}
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 dark:bg-gray-700 p-1.5 rounded-full w-7 h-7" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 dark:bg-gray-700 p-1.5 rounded-full w-7 h-7" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          </div>
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
  <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center">
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg mx-auto">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center">
        <MdOutlineSearchOff className="h-12 w-12 text-indigo-500 dark:text-indigo-300" />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-4">
        Discover Mixtapes
      </h3>
      <p className="text-gray-500 dark:text-gray-300 mt-3">
        Search by title, DJ name, or genre to find your next favorite mix
      </p>
    </div>
  </div>
);

const NoResultsState = ({ query }) => (
  <div className="w-full py-16 flex justify-center items-center">
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-6 mb-6 mx-auto w-20 h-20 flex items-center justify-center">
        <MdManageSearch className="h-10 w-10 text-indigo-500 dark:text-indigo-300" />
      </div>
      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        No results found for &quot;{query}&quot;
      </h4>
      <p className="text-gray-500 dark:text-gray-300">
        Try a different DJ name, title, or genre
      </p>
    </div>
  </div>
);

const SearchPage = () => {
  useEffect(() => {
    document.title = "MixTapped - Search";
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const debouncedQuery = useDebounce(inputValue, 500);

  // Infinite scroll sentinel
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  // Fresh search whenever debounced query changes
  useEffect(() => {
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
        // API returns { success, results, count }
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
  }, [debouncedQuery]);

  // Load more when sentinel comes into view
  useEffect(() => {
    if (!inView || !hasMore || loading || loadingMore || !debouncedQuery.trim())
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
  }, [inView, hasMore, loading, loadingMore, debouncedQuery, page]);

  const isSearching = loading;
  const showEmpty = !hasSearched && !inputValue;
  const showNone = hasSearched && !loading && results.length === 0;
  const showResults = hasSearched && !loading && results.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky search bar */}
      <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 z-10 px-4 py-4 shadow-md backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex-1">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-indigo-500 dark:text-indigo-400">
                {isSearching ? (
                  <FaSpinner className="animate-spin" size={18} />
                ) : (
                  <FaMagnifyingGlass size={18} />
                )}
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search by title, DJ name, or genre..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                autoFocus
                aria-label="Search mixtapes"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue("")}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          </form>
          <NavMenu />
        </div>
      </div>

      <main className="pt-4 pb-16">
        {/* Initial empty state */}
        {showEmpty && <NoValueState />}

        {/* Loading skeletons */}
        {isSearching && (
          <div className="max-w-3xl mx-auto px-4 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <MixCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* No results */}
        {showNone && <NoResultsState query={inputValue} />}

        {/* Results list */}
        {showResults && (
          <div className="max-w-3xl mx-auto px-4 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 px-2">
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                &quot;{inputValue}&quot;
              </span>
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

            {/* Infinite scroll skeletons */}
            {loadingMore && (
              <>
                <MixCardSkeleton />
                <MixCardSkeleton />
              </>
            )}

            {/* Sentinel */}
            {hasMore && <div ref={sentinelRef} className="h-4" />}

            {/* End of results */}
            {!hasMore && results.length > 0 && (
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
                All results loaded
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
