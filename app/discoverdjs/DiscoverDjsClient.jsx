"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, Clock, TrendingUp, Users } from "lucide-react";
import DjSearchModal from "@/app/(components)/DjSearchModal";

const LOAD_MORE_LIMIT = 12;
const ProfileCardSkeleton = () => (
  <div className="block rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md h-full w-full p-1">
    <div className="flex flex-col items-center h-full w-full p-3 sm:p-4">
      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full mb-3 sm:mb-4 flex-shrink-0" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const DiscoverDjsClient = ({
  initialResults,
  initialPagination,
  initialSort,
  initialFilter,
  initialLimit,
  initialError,
}) => {
  // ── state ──────────────────────────────────────────────────────────────────
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [results, setResults] = useState(initialResults);
  const [sortBy, setSortBy] = useState(initialSort);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [hasMore, setHasMore] = useState(
    initialPagination.currentPage < initialPagination.totalPages,
  );

  // Separate loading states so the initial SSR content never flashes a spinner
  const [isFiltering, setIsFiltering] = useState(false); // full-panel swap (sort/filter change)
  const [loadingMore, setLoadingMore] = useState(false); // append-only
  const [error, setError] = useState(initialError);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  // ── refs ───────────────────────────────────────────────────────────────────
  const isLoadingRef = useRef(false);
  const abortControllerRef = useRef(null);

  // ── intersection observer ──────────────────────────────────────────────────
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  });

  // ── helpers ────────────────────────────────────────────────────────────────
  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  // ── core fetch ─────────────────────────────────────────────────────────────
  const fetchDjs = useCallback(
    async ({ sort, filter, page, isLoadMore = false }) => {
      if (isLoadingRef.current) return;

      // cancel any in-flight request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      isLoadingRef.current = true;

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setIsFiltering(true);
        setError(null);
      }

      try {
        const limit = isLoadMore ? LOAD_MORE_LIMIT : initialLimit;
        const res = await fetch(
          `/api/dj-search?sort=${sort}&filter=${filter}&page=${page}&limit=${limit}&_=${Date.now()}`,
          {
            signal: abortControllerRef.current.signal,
            cache: "no-store",
            headers: { Pragma: "no-cache", "Cache-Control": "no-cache" },
          },
        );

        if (!res.ok)
          throw new Error(`API error: ${res.status} ${res.statusText}`);

        const data = await res.json();
        const newResults = data.results || [];
        const pagination = data.pagination || {
          currentPage: page,
          totalPages: 1,
        };

        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setHasMore(
          pagination.currentPage < pagination.totalPages &&
            newResults.length > 0,
        );

        setResults((prev) => {
          if (!isLoadMore) return newResults;
          // deduplicate on username
          const merged = [...prev, ...newResults];
          return Array.from(
            new Map(merged.map((dj) => [dj.username, dj])).values(),
          );
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
        if (!isLoadMore) setResults([]);
        setHasMore(false);
      } finally {
        isLoadingRef.current = false;
        isLoadMore ? setLoadingMore(false) : setIsFiltering(false);
      }
    },
    [initialLimit],
  );

  // ── filter / sort handlers ─────────────────────────────────────────────────
  const handleFilterChange = (filter) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setHasUserScrolled(false);
    fetchDjs({ sort: sortBy, filter, page: 1 });
  };

  const handleSortChange = (sort) => {
    if (sort === sortBy) return;
    setSortBy(sort);
    setHasUserScrolled(false);
    fetchDjs({ sort, filter: activeFilter, page: 1 });
  };

  const handleReset = () => {
    setActiveFilter("all");
    setSortBy("popular");
    setShowFilters(false);
    setHasUserScrolled(false);
    fetchDjs({ sort: "popular", filter: "all", page: 1 });
  };

  // ── scroll detection ───────────────────────────────────────────────────────
  useEffect(() => {
    if (hasUserScrolled) return;

    let t;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        if (scrollY > Math.max(300, window.innerHeight * 0.3)) {
          setHasUserScrolled(true);
          window.removeEventListener("scroll", onScroll);
        }
      }, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasUserScrolled]);

  // ── infinite scroll trigger ────────────────────────────────────────────────
  useEffect(() => {
    const shouldLoad =
      hasUserScrolled &&
      inView &&
      hasMore &&
      !loadingMore &&
      !isFiltering &&
      !isLoadingRef.current &&
      results.length >= initialLimit;

    if (!shouldLoad) return;

    const t = setTimeout(() => {
      fetchDjs({
        sort: sortBy,
        filter: activeFilter,
        page: currentPage + 1,
        isLoadMore: true,
      });
    }, 300);

    return () => clearTimeout(t);
  }, [
    hasUserScrolled,
    inView,
    hasMore,
    loadingMore,
    isFiltering,
    currentPage,
    results.length,
    sortBy,
    activeFilter,
    initialLimit,
    fetchDjs,
  ]);

  // ── cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  // ── sub-components ─────────────────────────────────────────────────────────
  const FilterButton = ({ value, icon, label }) => (
    <button
      onClick={() => handleFilterChange(value)}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
        ${
          activeFilter === value
            ? "bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/25 border-transparent"
            : "bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-300 border border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:border-indigo-300/50 dark:hover:border-indigo-500/50"
        }`}
    >
      <span className={activeFilter === value ? "text-white" : "text-indigo-500 dark:text-indigo-400"}>
        {icon}
      </span>
      {label}
    </button>
  );

  const SortButton = ({ value, label, icon }) => (
    <button
      onClick={() => handleSortChange(value)}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
        ${
          sortBy === value
            ? "bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/25 border-transparent"
            : "bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-300 border border-white/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:border-indigo-300/50 dark:hover:border-indigo-500/50"
        }`}
    >
      <span className={sortBy === value ? "text-white" : "text-indigo-500 dark:text-indigo-400"}>
        {icon}
      </span>
      {label}
    </button>
  );


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 rounded-3xl overflow-hidden">
      <DjSearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent font-righteous tracking-wide">
                Discover DJs
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
                Connect with talented DJs and discover amazing music
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Search bar + filter toggle */}
            <div className="relative w-full">
              <div className="relative flex items-center gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMagnifyingGlass className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for DJs by name, style, or location..."
                    className="block w-full pl-12 pr-6 py-3.5 border border-white/40 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg hover:shadow-xl transition-all duration-300 text-base"
                    onClick={openSearchModal}
                    readOnly
                  />
                </div>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`p-3.5 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center ${
                    showFilters ? "ring-2 ring-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-900/20" : ""
                  }`}
                >
                  <IoFilterSharp className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                </button>
              </div>

              {/* Filters panel */}
              {showFilters && (
                <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-white/5 shadow-2xl space-y-8">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <IoFilterSharp className="h-4 w-4 text-indigo-500" />
                        Filter by Category
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <FilterButton value="all" label="All DJs" icon={<Music2 className="h-4 w-4" />} />
                        <FilterButton value="new" label="New Artists" icon={<Clock className="h-4 w-4" />} />
                        <FilterButton value="trending" label="Trending" icon={<TrendingUp className="h-4 w-4" />} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                        Sort Options
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <SortButton value="popular" label="Most Popular" icon={<TrendingUp className="h-4 w-4" />} />
                        <SortButton value="name" label="Alphabetical" icon={<Music2 className="h-4 w-4" />} />
                        <SortButton value="followers" label="Most Followers" icon={<Users className="h-4 w-4" />} />
                        <SortButton value="newest" label="Recently Joined" icon={<Clock className="h-4 w-4" />} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="mt-12">
              {/* Filter/sort change — show skeleton grid */}
              {isFiltering ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-lg">
                      <FaSpinner className="h-5 w-5 text-indigo-500 animate-spin" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Updating results...</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 px-2 sm:px-4 w-full">
                    {Array.from({ length: initialLimit }).map((_, i) => (
                      <ProfileCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              ) : error ? (
                /* Error state */
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                  <div className="bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full p-8 mb-6">
                    <MdManageSearch className="h-16 w-16 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Something went wrong
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed mb-6">
                    {error}
                  </p>
                  <button
                    onClick={() =>
                      fetchDjs({ sort: sortBy, filter: activeFilter, page: 1 })
                    }
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : results.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-8 mb-6">
                    <MdManageSearch className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No DJs Found
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed mb-6">
                    We couldn&apos;t find any DJs with the current filters. Try
                    adjusting your search criteria.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Results header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeFilter === "new"
                          ? "New DJS"
                          : activeFilter === "trending"
                            ? "Trending DJs"
                            : "All DJs"}
                      </h2>
                    </div>
                  </div>

                  {/* DJ grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 w-full">
                    {results.map((dj, index) => (
                      <div
                        key={`${dj.username}-${index}`}
                        className="flex justify-center"
                      >
                        <Link
                          href={`/dj/${dj.username}`}
                          className="w-full h-full group block"
                        >
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

                  {/* Sentinel — only mounted after user scrolls to avoid immediate trigger */}
                  {hasUserScrolled &&
                    hasMore &&
                    results.length >= initialLimit && (
                      <div ref={sentinelRef} className="h-px w-full" />
                    )}

                  {/* Footer states */}
                  <div className="flex justify-center items-center py-12 mt-8">
                    {loadingMore && (
                      <div className="flex items-center gap-3 px-5 py-2.5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-lg">
                        <FaSpinner className="h-4 w-4 text-indigo-500 animate-spin" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading more...</span>
                      </div>
                    )}

                    {!hasMore && results.length > initialLimit && (
                      <div className="text-center py-8">
                        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 px-8 py-4 rounded-3xl shadow-lg">
                          <p className="font-medium text-gray-900 dark:text-white">
                            🎉 You&apos;ve discovered all available DJs!
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Check back later for new artists
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

export default DiscoverDjsClient;
