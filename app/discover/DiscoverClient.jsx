"use client";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import MixCard from "../(components)/MixCard";
import { useInView } from "react-intersection-observer";

const DiscoverClient = ({ initialMixes }) => {
  const limit = 12;
  const [mixes, setMixes] = useState(initialMixes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialMixes.length === limit);
  const [loadingMore, setLoadingMore] = useState(false);
  const { ref: loadMoreRef, inView } = useInView();

  const fetchMixes = async (pageNumber) => {
    try {
      const response = await fetch(`/api/discover?page=${pageNumber}`);
      const data = await response.json();
      return {
        mixtapes: data.mixtapes,
        hasMore: data.mixtapes.length === limit,
      };
    } catch (error) {
      console.error("Error fetching mixes:", error);
      return { mixtapes: [], hasMore: false };
    }
  };

  // Load more when scrolling to bottom
  useEffect(() => {
    const loadMore = async () => {
      if (inView && !loadingMore && hasMore) {
        setLoadingMore(true);
        const nextPage = page + 1;
        const { mixtapes, hasMore: moreAvailable } = await fetchMixes(nextPage);
        setMixes((prev) => [...prev, ...mixtapes]);
        setHasMore(moreAvailable);
        setPage(nextPage);
        setLoadingMore(false);
      }
    };

    loadMore();
  }, [inView, loadingMore, hasMore, page]);

  return (
    <div>
      <div className="grid gap-2 sm:gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {mixes.map((mix) => (
          <div key={mix.unique} className="w-full">
            <MixCard
              link={`/mix/${mix.unique}/`}
              Djname={mix.djName}
              title={mix.title}
              img={mix.imgthumb}
              downloads={mix.totalDownloads}
              plays={mix.totalPlays}
            />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex justify-center pt-12 pb-8"
        >
          {loadingMore ? (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-lg">
              <FaSpinner className="animate-spin h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading more...</span>
            </div>
          ) : (
            <div className="px-5 py-2.5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-lg">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Scroll for more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverClient;
