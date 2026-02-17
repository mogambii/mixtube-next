"use client";

import MixCard from "@/app/(components)/MixCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, Music2 } from "lucide-react";

const MyMixxes = ({ username, initialMixxes = [] }) => {
  const [mixes, setMixes] = useState(initialMixxes);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    initialMixxes.length > 0 ? 1 : 0,
  );

  const isLoadingRef = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  });

  const fetchMixes = useCallback(
    async (page) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setLoadingMore(true);

      try {
        const res = await fetch(`/api/mixes?username=${username}&page=${page}`);
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        const newMixes = data.mixes || [];

        setMixes((prev) => {
          // Deduplicate by unique
          const existingIds = new Set(prev.map((m) => m.unique));
          const fresh = newMixes.filter((m) => !existingIds.has(m.unique));
          return [...prev, ...fresh];
        });

        setHasMore(data.pagination?.hasNextPage ?? false);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching mixes:", err);
        setHasMore(false);
      } finally {
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [username],
  );

  // Reset when username changes
  useEffect(() => {
    setMixes(initialMixxes);
    setCurrentPage(initialMixxes.length > 0 ? 1 : 0);
    setHasMore(true);
    isLoadingRef.current = false;
  }, [username]);

  // Trigger next page when sentinel comes into view
  useEffect(() => {
    if (inView && hasMore && !loadingMore && !isLoadingRef.current) {
      fetchMixes(currentPage + 1);
    }
  }, [inView, hasMore, loadingMore, currentPage, fetchMixes]);

  if (mixes.length === 0 && !loadingMore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
          <Music2 className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No mixtapes yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {mixes.map((mix) => (
          <div
            key={mix.unique}
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <MixCard
              link={`/mix/${mix.unique}`}
              Djname={mix.djName}
              title={mix.title}
              year={mix.time}
              img={mix.imgthumb}
              downloads={mix.engagement?.downloads ?? mix.totalDownloads ?? 0}
              plays={mix.engagement?.plays ?? mix.totalPlays ?? 0}
            />
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div
          ref={ref}
          className="flex justify-center items-center py-8 min-h-[80px]"
        >
          {loadingMore && (
            <div className="flex items-center gap-2.5 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-full shadow-md border border-gray-100 dark:border-gray-700">
              <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Loading more...
              </span>
            </div>
          )}
        </div>
      )}

      {!hasMore && mixes.length > 0 && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-6">
          All {mixes.length} mixtapes loaded
        </p>
      )}
    </div>
  );
};

export default MyMixxes;
