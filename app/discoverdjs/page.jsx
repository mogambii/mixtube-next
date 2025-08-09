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
import { Music2, Clock, TrendingUp, Users } from "lucide-react";
import DjSearchModal from "@/app/(components)/DjSearchModal";

// Simplified debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const ProfileCardSkeleton = () => (
  <div className="block rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 h-full w-full p-1">
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

  // State management
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const initialLoadLimit = 12;
  const loadMoreLimit = 8;

  // Refs for controlling fetch behavior
  const isLoadingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Intersection observer for infinite scroll
  const { ref: infiniteScrollRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  });

  // Modal handlers
  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  // Enhanced fetch function with better error handling
  const fetchDjs = useCallback(
    async (sort = sortBy, filter = activeFilter, page = 1, isLoadMore = false) => {
      // Prevent multiple simultaneous requests
      if (isLoadingRef.current) return;
      
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      isLoadingRef.current = true;

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setIsInitialLoad(true);
        setError(null);
      }

      try {
        const limit = isLoadMore ? loadMoreLimit : initialLoadLimit;
        const timestamp = Date.now();
        const apiUrl = `/api/dj-search?sort=${sort}&filter=${filter}&page=${page}&limit=${limit}&_=${timestamp}`;
        
        console.log(`Fetching DJs: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          signal: abortControllerRef.current.signal,
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        const newResults = responseData.results || [];

        console.log(
          `Received ${newResults.length} results, page ${
            responseData.pagination?.currentPage || page
          }/${responseData.pagination?.totalPages || 1}`
        );

        setResults((prevResults) => {
          if (!isLoadMore) {
            return newResults;
          }
          
          // For load more, append new results and remove duplicates
          const combinedResults = [...prevResults, ...newResults];
          const uniqueResults = Array.from(
            new Map(combinedResults.map((dj) => [dj.username, dj])).values()
          );
          return uniqueResults;
        });

        setCurrentPage(responseData.pagination?.currentPage || page);
        
        // Update hasMore based on pagination
        const hasMorePages = 
          (responseData.pagination?.currentPage || page) < 
          (responseData.pagination?.totalPages || 1);
        setHasMore(hasMorePages && newResults.length > 0);

        console.log(`Has more pages: ${hasMorePages}`);

      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        
        console.error("Error fetching DJs:", error);
        setError(error.message);
        
        if (!isLoadMore) {
          setResults([]);
        }
        setHasMore(false);
      } finally {
        isLoadingRef.current = false;
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setIsInitialLoad(false);
        }
      }
    },
    [sortBy, activeFilter, initialLoadLimit, loadMoreLimit]
  );

  // Handle filter change
  const handleFilterChange = (filter) => {
    if (filter === activeFilter) return;
    
    setActiveFilter(filter);
    setCurrentPage(1);
    setResults([]);
    setHasMore(true);
    setError(null);
    setHasUserScrolled(false); // Reset scroll detection for new filter
    fetchDjs(sortBy, filter, 1, false);
  };

  // Handle sort change  
  const handleSortChange = (sort) => {
    if (sort === sortBy) return;
    
    setSortBy(sort);
    setCurrentPage(1);
    setResults([]);
    setHasMore(true);
    setError(null);
    setHasUserScrolled(false); // Reset scroll detection for new sort
    fetchDjs(sort, activeFilter, 1, false);
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchDjs(sortBy, activeFilter, 1, false);
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []); // Only run on mount

  // Track user scroll behavior
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set timeout to detect meaningful scroll
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // Only set hasUserScrolled if user has scrolled more than one viewport height
        // or scrolled down significantly (more than 300px)
        if (scrollY > Math.max(300, windowHeight * 0.3)) {
          setHasUserScrolled(true);
          // Remove event listener once we've detected user scroll
          window.removeEventListener('scroll', handleScroll);
        }
      }, 100); // Debounce scroll events
    };

    // Only add scroll listener if user hasn't scrolled yet
    if (!hasUserScrolled) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasUserScrolled]);

  // Infinite scroll effect - only trigger after user has scrolled
  useEffect(() => {
    // Prevent infinite scroll until:
    // 1. User has actually scrolled down meaningfully
    // 2. We have results to show
    // 3. Initial load is complete
    // 4. Not currently loading
    // 5. There are more items to load
    // 6. The sentinel is in view
    const shouldLoadMore = 
      hasUserScrolled &&
      inView && 
      hasMore && 
      !loadingMore && 
      !isInitialLoad && 
      !isLoadingRef.current &&
      results.length > 0 &&
      results.length >= initialLoadLimit; // Only start infinite scroll after we have initial results

    if (shouldLoadMore) {
      // Add a small delay to prevent rapid fire requests
      const timeoutId = setTimeout(() => {
        console.log(`Loading more DJs, page ${currentPage + 1}`);
        fetchDjs(sortBy, activeFilter, currentPage + 1, true);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [
    hasUserScrolled,
    inView, 
    hasMore, 
    loadingMore, 
    isInitialLoad, 
    currentPage, 
    fetchDjs, 
    results.length, 
    sortBy, 
    activeFilter,
    initialLoadLimit
  ]);

  // Enhanced Empty State
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-8 mb-6">
        <MdManageSearch className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        No DJs Found
      </h4>
      <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed mb-6">
        We couldn&apos;t find any DJs with the current filters. Try adjusting your search criteria or explore different categories.
      </p>
      <button
        onClick={() => {
          setActiveFilter("all");
          setSortBy("popular");
          setShowFilters(false);
          setHasUserScrolled(false); // Reset scroll detection
        }}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
      >
        Reset Filters
      </button>
    </div>
  );

  // Error State
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full p-8 mb-6">
        <MdManageSearch className="h-16 w-16 text-red-600 dark:text-red-400" />
      </div>
      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Something went wrong
      </h4>
      <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed mb-6">
        {error || "We're having trouble loading DJs right now. Please try again."}
      </p>
      <button
        onClick={() => fetchDjs(sortBy, activeFilter, 1, false)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
      >
        Try Again
      </button>
    </div>
  );

  // Enhanced DJ Grid
  const DjGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-4 w-full">
      {results.map((dj, index) => (
        <div
          key={`${dj.username}-${index}`}
          className="flex justify-center hover:-translate-y-2 hover:scale-105 transition-all duration-300 ease-out"
        >
          <Link href={`/dj/${dj.username}`} className="w-full h-full group">
            <div className="w-full h-full p-1">
              <div className="relative overflow-hidden rounded-xl">
                <ProfileCard
                  Djname={dj.djName}
                  profilep={dj.profilep}
                  name={dj.username}
                  isVerified={dj.isVerified || false}
                  followers={dj._count?.followedBy || 0}
                  mixtapes={dj._count?.mixtapes || 0}
                  className="w-full h-full transition-all duration-300 group-hover:shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  // Enhanced Filter Button
  const FilterButton = ({ value, icon, label, count }) => (
    <button
      onClick={() => handleFilterChange(value)}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 relative overflow-hidden group
        ${
          activeFilter === value
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500"
        }`}
    >
      <div className={`transition-colors duration-200 ${activeFilter === value ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
        {icon}
      </div>
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          activeFilter === value 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  // Enhanced Sort Button
  const SortButton = ({ value, label, icon }) => (
    <button
      onClick={() => handleSortChange(value)}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
        ${
          sortBy === value
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500"
        }`}
    >
      <div className={`transition-colors duration-200 ${sortBy === value ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
        {icon}
      </div>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Search Modal */}
      <DjSearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                  <Music2 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Discover DJs
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Connect with talented DJs and discover amazing music from around the world
              </p>
            </div>
            <div className="flex-shrink-0">
              <NavMenu />
            </div>
          </div>

          <div className="space-y-8">
            {/* Enhanced Search Bar */}
            <div className="relative max-w-4xl mx-auto w-full">
              <div className="relative flex items-center gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMagnifyingGlass className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for DJs by name, style, or location..."
                    className="block w-full pl-12 pr-6 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    onClick={openSearchModal}
                    readOnly
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center ${
                    showFilters
                      ? "ring-2 ring-indigo-500 dark:ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : ""
                  }`}
                >
                  <IoFilterSharp className="h-6 w-6" />
                </button>
              </div>

              {/* Enhanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <IoFilterSharp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          Filter by Category
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <FilterButton
                            value="all"
                            label="All DJs"
                            icon={<Music2 className="h-4 w-4" />}
                          />
                          <FilterButton
                            value="new"
                            label="New Artists"
                            icon={<Clock className="h-4 w-4" />}
                          />
                          <FilterButton
                            value="trending"
                            label="Trending"
                            icon={<TrendingUp className="h-4 w-4" />}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          Sort Options
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <SortButton
                            value="popular"
                            label="Most Popular"
                            icon={<TrendingUp className="h-4 w-4" />}
                          />
                          <SortButton
                            value="name"
                            label="Alphabetical"
                            icon={<Music2 className="h-4 w-4" />}
                          />
                          <SortButton
                            value="followers"
                            label="Most Followers"
                            icon={<Users className="h-4 w-4" />}
                          />
                          <SortButton
                            value="newest"
                            label="Recently Joined"
                            icon={<Clock className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="mt-12">
              {/* Loading State */}
              {isInitialLoad ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                      <Bars height="40" width="40" color="#6366f1" ariaLabel="loading-indicator" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-4 w-full">
                    {Array.from({ length: initialLoadLimit }).map((_, index) => (
                      <ProfileCardSkeleton key={index} />
                    ))}
                  </div>
                </div>
              ) : error ? (
                <ErrorState />
              ) : results.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeFilter === "new" ? "New Artists" : 
                         activeFilter === "trending" ? "Trending DJs" : "Featured DJs"}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {results.length} DJ{results.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  </div>

                  {/* DJ Grid */}
                  <DjGrid />

                    {/* Infinite Scroll Trigger - only show when user has scrolled */}
                    {hasUserScrolled && hasMore && results.length >= initialLoadLimit && (
                      <div ref={infiniteScrollRef} className="h-px w-full" />
                    )}

                    {/* Loading and End States */}
                    <div className="flex justify-center items-center py-12 mt-8">
                      {loadingMore && (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                          <Bars height="35" width="35" color="#6366f1" ariaLabel="loading-more" />
                        </div>
                      )}
                      {!hasMore && results.length > initialLoadLimit && (
                        <div className="text-center py-8">
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg">
                            <p className="font-medium">🎉 You've discovered all available DJs!</p>
                            <p className="text-sm opacity-90 mt-1">Check back later for new artists</p>
                          </div>
                        </div>
                      )}
                      {/* Show scroll hint if user hasn't scrolled yet */}
                      {!hasUserScrolled && results.length >= initialLoadLimit && hasMore && (
                        <div className="text-center py-8">
                          <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              👆 Scroll down to discover more DJs
                            </p>
                          </div>
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