"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Bars } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import NavMenu from "@/components/NavMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2 } from "lucide-react";
import DjSearchModal from "@/app/(components)/DjSearchModal";

// Simplified debounce hook that always updates after delay
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear timeout when value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Utility function to throttle scroll events
function useThrottle(callback, delay) {
  const lastRun = useRef(0);
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      const now = Date.now();
      const elapsed = now - lastRun.current;

      const runCallback = () => {
        lastRun.current = now;
        callback(...args);
      };

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // If enough time has elapsed, run the callback immediately
      if (elapsed >= delay) {
        runCallback();
      } else {
        // Otherwise, schedule to run at the end of the delay period
        timeoutRef.current = setTimeout(runCallback, delay - elapsed);
      }
    },
    [callback, delay]
  );
}

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
    document.title = "MixTapped - Discover DJs";
  }

  // State for modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // State for infinite scroll
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialLoadLimit = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Open search modal handler
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  // Close search modal handler
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // Create a ref for the container that will hold the new results
  const resultsContainerRef = useRef(null);

  const fetchDjs = useCallback(
    async (
      sort = sortBy,
      filter = activeFilter,
      page = 1,
      isLoadMore = false
    ) => {
      // For infinite scroll, we need to preserve scroll position
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setIsInitialLoad(true);
      }

      try {
        // Add a cache-busting parameter to prevent browser caching
        const timestamp = Date.now();
        const apiUrl = `/api/dj-search?sort=${sort}&filter=${filter}&page=${page}&limit=${initialLoadLimit}&_=${timestamp}`;

        console.log(`Fetching DJs: ${apiUrl}`);
        const response = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(
          `Received ${responseData.results?.length || 0} results, page ${
            responseData.pagination?.currentPage
          }/${responseData.pagination?.totalPages}`
        );

        // Process the results
        const newResults = responseData.results || [];

        // Use a callback to ensure we're working with the latest state
        setResults((prevResults) => {
          if (!isLoadMore) {
            return newResults; // Replace results when filter/sort changes
          }

          // For load more, append new results and remove any duplicates
          const combinedResults = [...prevResults, ...newResults];
          const uniqueResults = Array.from(
            new Map(combinedResults.map((dj) => [dj.username, dj])).values()
          );
          return uniqueResults;
        });

        setCurrentPage(responseData.pagination?.currentPage || 1);

        // Check if there are more pages to load
        const hasMorePages =
          responseData.pagination?.currentPage <
          responseData.pagination?.totalPages;
        setHasMore(hasMorePages);

        console.log(
          `Has more pages: ${hasMorePages}, Current: ${responseData.pagination?.currentPage}, Total: ${responseData.pagination?.totalPages}`
        );
      } catch (error) {
        console.error("Error fetching DJs:", error);
        setHasMore(false); // Stop trying to load more on error
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setIsInitialLoad(false);
        }
      }
    },
    [sortBy, activeFilter, initialLoadLimit]
  );

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setResults([]);
    fetchDjs(sortBy, filter, 1, false);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
    setResults([]);
    fetchDjs(sort, activeFilter, 1, false);
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchDjs(sortBy, activeFilter, 1, false);
  }, [fetchDjs, sortBy, activeFilter]);

  // Use a ref to track if we're currently in the middle of loading more items
  const isLoadingRef = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Increased margin to load earlier
    triggerOnce: false, // Make sure it triggers multiple times
  });

  // This effect handles the initial load and filter/sort changes
  useEffect(() => {
    // Reset pagination when filters or sort change
    setCurrentPage(1);
    setResults([]);
    setIsInitialLoad(true);
    fetchDjs(sortBy, activeFilter, 1, false);
  }, [sortBy, activeFilter, fetchDjs]);

  // This effect handles infinite scrolling
  useEffect(() => {
    // Only trigger loading more if we're not already loading and the loading trigger is in view
    if (inView && hasMore && !loadingMore && !isInitialLoad) {
      // Add a small delay to prevent rapid firing of requests
      const timer = setTimeout(() => {
        console.log(`Loading more DJs, page ${currentPage + 1}`);
        fetchDjs(sortBy, activeFilter, currentPage + 1, true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [
    inView,
    hasMore,
    loadingMore,
    isInitialLoad,
    currentPage,
    sortBy,
    activeFilter,
    fetchDjs,
  ]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-6 mb-4">
        <MdManageSearch className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No DJs Found
      </h4>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
        We couldn&apos;t find any DJs with the current filters. Try changing
        your filter options.
      </p>
    </div>
  );

  const DjGrid = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-4 w-full">
        {results.map((dj) => (
          <div
            key={dj.username}
            className="flex justify-center hover:-translate-y-1 transition-transform duration-200"
          >
            <Link href={`/dj/${dj.username}`} className="w-full h-full">
              <div className="w-full h-full p-1">
                <ProfileCard
                  Djname={dj.djName}
                  profilep={dj.profilep}
                  name={dj.username}
                  isVerified={false}
                  followers={dj._count?.followedBy || 0}
                  mixtapes={dj._count?.mixtapes || 0}
                  className="w-full h-full"
                />
              </div>
            </Link>
          </div>
        ))}
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 rounded-b-md">
      {/* Search Modal */}
      <DjSearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />

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
            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto w-full">
              <div className="relative flex items-center gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMagnifyingGlass className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for DJs by name..."
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
                    onClick={openSearchModal} // Open modal when search bar is clicked
                    readOnly // Make it non-editable, just for opening the modal
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
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 transition-all duration-300">
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
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="mt-8">
              {/* Loading State */}
              {isInitialLoad ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-4 w-full">
                  {Array.from({ length: initialLoadLimit }).map((_, index) => (
                    <ProfileCardSkeleton key={index} />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {activeFilter === "new" ? "New DJs" : "Featured DJs"}
                    </h2>
                  </div>

                  {/* DJ Grid */}
                  <DjGrid />

                  {/* Infinite Scroll Trigger */}
                  <div
                    ref={ref}
                    className="col-span-full flex justify-center items-center py-8 mt-4"
                  >
                    {loadingMore && (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                        <Bars
                          height="30"
                          width="30"
                          color="#6366f1"
                          ariaLabel="loading-indicator"
                        />
                      </div>
                    )}
                    {!hasMore && results.length > 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        You&apos;ve reached the end of the list!
                      </div>
                    )}
                  </div>
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
