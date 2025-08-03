"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import MpNav from "../(components)/MpNav";
import MixCard from "../(components)/MixCard";
import MixCardSkeleton from "../(components)/MixCardSkeleton";
import NavMenu from "@/components/NavMenu";
import { useInView } from "react-intersection-observer";

const Discovermixxes = () => {
  useEffect(() => {
    document.title = "MixTapped - Discover Mixtapes";
  }, []);

  const [loading, setLoading] = useState(true);
  const [mixes, setMixes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { ref: loadMoreRef, inView } = useInView();
  const limit = 12;

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

  // Initial load
  useEffect(() => {
    const loadInitialMixes = async () => {
      setLoading(true);
      const { mixtapes, hasMore } = await fetchMixes(1);
      setMixes(mixtapes);
      setHasMore(hasMore);
      setLoading(false);
    };

    loadInitialMixes();
  }, []);

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
    <>
      <div className="min-h-screen">
        <h5 className="dark:text-slate-50 py-2 pl-3 font-righteous">
          DISCOVER MIXTAPES
        </h5>
        <header
          className="flex justify-between items-center mx-2 p-0"
          role="banner"
        >
          <Link
            href="/search"
            className="flex-1 mr-2"
            aria-label="Search Mixtapes"
          >
            <MpNav place="Search Mixtape" />
          </Link>
          <NavMenu />
        </header>
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-4">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="w-full">
                  <MixCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {mixes.map((mix) => (
                  <div
                    className="w-full transform hover:scale-[1.02] transition-transform duration-200"
                    key={mix.unique}
                  >
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
                  className="flex justify-center py-8 gap-3 items-center text-gray-500 dark:text-gray-400"
                >
                  {loadingMore ? (
                    <>
                      <FaSpinner className="animate-spin h-5 w-5" />
                      <span>Loading more mixtapes...</span>
                    </>
                  ) : (
                    <span className="text-sm">Scroll for more</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Discovermixxes;
