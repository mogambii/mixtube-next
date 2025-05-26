"use client";

import MixCard from "@/app/(components)/MixCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { Bars } from "react-loader-spinner";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for loading state that matches the new MixCard layout
const MixCardSkeleton = () => (
  <div className="p-2 w-full">
    <div className="dark:bg-gray-800/90 bg-white rounded-xl flex gap-4 p-3 w-full shadow-md border border-gray-100 dark:border-gray-700">
      {/* Image placeholder with same dimensions */}
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
        <Skeleton className="h-32 w-32" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30"></div>
      </div>

      {/* Content area */}
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          {/* Title placeholder - slightly larger than before */}
          <Skeleton className="h-5 w-4/5 mb-2" />
          {/* DJ name placeholder */}
          <Skeleton className="h-3 w-1/2 mt-1" />
        </div>

        {/* Stats placeholders with improved styling */}
        <div className="flex items-center gap-6 mt-2">
          {/* Downloads */}
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full flex items-center justify-center">
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          {/* Plays */}
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full flex items-center justify-center">
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MyMixxes = ({ username }) => {
  const [mixes, setMixes] = useState([]);
  const [loadingMixes, setLoadingMixes] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Use a ref to track if we're currently in the middle of loading more items
  const isLoadingRef = useRef(false);

  // Setup intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  });
  const fetchMixes = useCallback(
    async (page, isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoadingMixes(true);
      }

      try {
        const mixResponse = await fetch(
          `/api/mixes?username=${username}&page=${page}`
        );

        if (!mixResponse.ok) {
          throw new Error(`Error: ${mixResponse.statusText}`);
        }

        const mixData = await mixResponse.json();
        const newMixes = mixData.mixes || [];

        if (isLoadMore) {
          // Append new mixes to existing ones
          setMixes((prev) => [...prev, ...newMixes]);
        } else {
          // Replace mixes for initial load or filter change
          setMixes(newMixes);
        }

        setPageCount(mixData.pagination.totalPages);
        setHasMore(mixData.pagination.hasNextPage);
      } catch (error) {
        console.error("Error fetching mixes:", error);
        setHasMore(false);
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoadingMixes(false);
        }
      }
    },
    [username]
  );

  // Initial load effect
  useEffect(() => {
    // Reset state when username changes
    setMixes([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchMixes(1, false);
  }, [username, fetchMixes]);

  // Infinite scroll effect
  useEffect(() => {
    if (
      inView &&
      hasMore &&
      !loadingMore &&
      !loadingMixes &&
      !isLoadingRef.current
    ) {
      isLoadingRef.current = true;
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMixes(nextPage, true);

      // Reset loading ref after a delay
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 1000);
    }
  }, [
    fetchMixes,
    inView,
    hasMore,
    loadingMore,
    loadingMixes,
    currentPage,
    username,
  ]);
  // Pagination controls are no longer needed with infinite scroll
  return (
    <div>
      {loadingMixes && mixes.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[390px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="transform transition-all duration-300"
              style={{
                animationDelay: `${index * 0.05}s`,
                opacity: 0.9,
              }}
            >
              <MixCardSkeleton />
            </div>
          ))}
        </div>
      ) : mixes?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {mixes?.map((mix, index) => (
              <div
                key={mix.unique}
                className="transform transition-all duration-300 hover:translate-y-[-5px]"
              >
                <MixCard
                  link={`/mix/${mix.unique}`}
                  Djname={mix.djName}
                  title={mix.title}
                  year={mix.date}
                  img={mix.imgthumb}
                  downloads={mix.engagement.downloads}
                  plays={mix.engagement.plays}
                  loading
                />
              </div>
            ))}
          </div>

          {/* Infinite scroll loading indicator and trigger */}
          {hasMore && (
            <div
              ref={ref}
              className="flex justify-center items-center py-8"
              style={{ minHeight: "100px", position: "relative" }}
            >
              {loadingMore && (
                <div className="w-full flex justify-center items-center py-6">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md flex items-center gap-3">
                    <Bars
                      height="24"
                      width="24"
                      color="#6366f1"
                      ariaLabel="loading-more"
                      visible={true}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Loading more mixtapes
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasMore && mixes.length > 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              You&apos;ve reached the end of the list
            </div>
          )}
        </>
      ) : (
        <div className="h-[370px] flex items-center justify-center">
          <h4 className="dark:text-slate-50 text-center font-righteous font-thin text-xs">
            No mixes
          </h4>
        </div>
      )}
    </div>
  );
};

export default MyMixxes;
