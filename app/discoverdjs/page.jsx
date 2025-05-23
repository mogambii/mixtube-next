"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Bars } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdManageSearch, MdOutlineVerified } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import NavMenu from "@/components/NavMenu";
import { Skeleton } from "@/components/ui/skeleton";

import { Music2, TrendingUp } from "lucide-react";

const ProfileCardSkeleton = () => (
  <div className="block rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md h-full w-full p-1">
    <div className="flex flex-col items-center h-full w-full p-3 sm:p-4">
      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full mb-3 sm:mb-4 flex-shrink-0" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const DiscoverDjs = () => {
  if (typeof window !== "undefined") {
    document.title = "MixTube - Discover DJs";
  }
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialLoadLimit = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const debounceTimeoutRef = useRef(null);

  // Create a ref for the container that will hold the new results
  const resultsContainerRef = useRef(null);

  const fetchDjs = useCallback(
    async (
      query,
      sort = sortBy,
      filter = activeFilter,
      page = 1,
      isLoadMore = false
    ) => {
      // For infinite scroll, we need to preserve scroll position
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setIsSearching(true);
      }

      try {
        const apiUrl = query
          ? `/api/dj-search?query=${query}&sort=${sort}&filter=${filter}`
          : `/api/dj-search?sort=${sort}&filter=${filter}&page=${page}&limit=${initialLoadLimit}`;

        const response = await fetch(apiUrl);
        const responseData = await response.json();
        // Process API response

        if (query) {
          // If it's a search query, replace results
          setResults(responseData.results || responseData); // API might return array directly or {results: []}
          setHasNoResults((responseData.results || responseData).length === 0);
          setHasMore(false); // For search, we load all results at once (for now)
          setCurrentPage(1); // Reset page for search
        } else {
          // Infinite scroll for no query
          const newResults = responseData.results || [];

          // Use a callback to ensure we're working with the latest state
          setResults((prevResults) => {
            // For load more, append new results; otherwise replace
            return isLoadMore ? [...prevResults, ...newResults] : newResults;
          });

          setHasNoResults(newResults.length === 0 && !isLoadMore && page === 1);
          setCurrentPage(responseData.pagination?.currentPage || 1);
          setHasMore(
            (responseData.pagination?.currentPage || 1) <
              (responseData.pagination?.totalPages || 1)
          );
        }
      } catch (error) {
        // Handle errors silently
        setHasMore(false); // Stop trying to load more on error
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
          // No need to adjust scroll position - the absolute positioning approach prevents scroll jumps
        } else {
          setIsSearching(false);
        }
        if (!query && !isLoadMore) {
          // Only turn off initial load if it's the first fetch without a query
          setIsInitialLoad(false);
        } else if (query) {
          // If it's a search, initial load is also done
          setIsInitialLoad(false);
        }
      }
    },
    [sortBy, activeFilter, initialLoadLimit]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchDjs(query);
    }, 300);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    fetchDjs(searchQuery, sort, activeFilter);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchDjs(searchQuery, sortBy, filter);
  };

  useEffect(() => {
    // Initial fetch when component mounts or when filters/sort change (without search query)
    if (!searchQuery) {
      setIsInitialLoad(true); // Ensure skeleton shows if filters change before first load
      fetchDjs("", sortBy, activeFilter, 1);
    }
    // Search is handled by handleSearchChange
  }, [sortBy, activeFilter, fetchDjs, searchQuery]); // searchQuery removed to prevent re-fetch on every keystroke here

  // Use a ref to track if we're currently in the middle of loading more items
  const isLoadingRef = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px", // Load earlier to prevent user from seeing the loading state
  });

  useEffect(() => {
    // Only trigger loading more if we're not already loading and the loading trigger is in view
    if (
      inView &&
      !searchQuery &&
      hasMore &&
      !loadingMore &&
      !isInitialLoad &&
      !isSearching &&
      !isLoadingRef.current
    ) {
      // Set our loading ref to prevent multiple simultaneous loads
      isLoadingRef.current = true;
      fetchDjs("", sortBy, activeFilter, currentPage + 1, true);

      // Reset the loading ref after a short delay
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 1000);
    }
  }, [
    inView,
    searchQuery,
    hasMore,
    loadingMore,
    isInitialLoad,
    isSearching,
    currentPage,
    sortBy,
    activeFilter,
    fetchDjs,
  ]);

  const NoResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-6 mb-4"
      >
        <MdManageSearch className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </motion.div>
      <motion.h4
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
      >
        No DJs Found
      </motion.h4>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-400 max-w-sm"
      >
        We couldn&apos;t find any DJs matching your search. Try different
        keywords or browse our featured DJs.
      </motion.p>
    </motion.div>
  );

  const Results = () => {
    // Determine if this is an initial load or a subsequent load (infinite scroll)
    const isInitialBatch = !loadingMore && currentPage === 1;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-4 w-full">
        {results.map((dj, index) => {
          // Only apply animation for cards loaded via infinite scroll, not for initial batch
          const shouldAnimate = !isInitialBatch;

          return (
            <motion.div
              key={dj.username}
              initial={
                shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimate
                  ? { delay: Math.min(index * 0.05, 0.5) }
                  : { duration: 0 }
              }
              whileHover={{ y: -5 }}
              className="flex justify-center"
            >
              <Link href={`/dj/${dj.username}`} className="w-full h-full">
                <div className="w-full h-full p-1">
                  <ProfileCard
                    Djname={dj.djName}
                    profilep={dj.profilep}
                    name={dj.username}
                    isVerified={
                      false
                    } /* isVerified field doesn't exist in User model */
                    followers={dj._count?.followedBy || 0}
                    mixtapes={dj._count?.mixtapes || 0}
                    className="w-full h-full"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const FilterButton = ({ value, icon, label }) => (
    <button
      onClick={() => handleFilterChange(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
        ${
          activeFilter === value
            ? "bg-indigo-600 text-white shadow-md"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Discover DJs
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Find and connect with talented DJs from around the world
              </p>
            </div>
            <div className="flex-shrink-0">
              <NavMenu />
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative max-w-3xl mx-auto w-full">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center gap-3"
              >
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMagnifyingGlass className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for DJs by name, genre, or location..."
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center ${
                    showFilters
                      ? "ring-2 ring-indigo-500 dark:ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : ""
                  }`}
                  aria-label="Toggle filters"
                >
                  <IoFilterSharp className="h-5 w-5" />
                </button>
              </form>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Filter by
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            <FilterButton
                              value="all"
                              label="All"
                              icon={<IoFilterSharp className="h-4 w-4" />}
                            />
                            <FilterButton
                              value="new"
                              label="New"
                              icon={<Music2 className="h-4 w-4" />}
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Sort by
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {[
                              { value: "name", label: "Name" },
                              { value: "followers", label: "Followers" },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                                  ${
                                    sortBy === option.value
                                      ? "bg-indigo-600 text-white shadow-md"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                  }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8">
              {isInitialLoad ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-4 w-full">
                  {Array.from({ length: initialLoadLimit }).map((_, index) => (
                    <ProfileCardSkeleton key={index} />
                  ))}
                </div>
              ) : isSearching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[30vh] space-y-4"
                >
                  <Bars
                    height="40"
                    width="40"
                    color="#6366f1"
                    ariaLabel="loading-indicator"
                    visible={true}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Searching DJs...
                  </p>
                </motion.div>
              ) : searchQuery && hasNoResults ? (
                <NoResults />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {searchQuery
                        ? `Search Results (${results.length})`
                        : activeFilter === "new"
                        ? "New DJs"
                        : "Featured DJs"}
                    </h2>
                  </div>
                  <Results />
                  {!searchQuery && hasMore && results.length > 0 && (
                    <div
                      ref={ref}
                      className="col-span-full flex justify-center items-center py-8"
                      style={{ minHeight: "150px", position: "relative" }}
                    >
                      {loadingMore && (
                        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                          <Bars
                            height="30"
                            width="30"
                            color="#6366f1"
                            ariaLabel="loading-indicator"
                          />
                        </div>
                      )}
                      {/* This invisible element ensures we have enough space at the bottom */}
                      <div style={{ height: "100px" }} />
                    </div>
                  )}
                  {!searchQuery && !hasMore && results.length > 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                      You&apos;ve reached the end of the list!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverDjs;
