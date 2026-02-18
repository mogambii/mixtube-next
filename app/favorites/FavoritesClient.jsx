"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { FaHeart, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const MixtapeCardSkeleton = () => (
  <div className="block rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md h-full">
    <Skeleton className="w-full h-52" />
    <div className="p-5">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <div className="flex justify-between items-center mt-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

const MixtapeCard = ({ mixtape }) => (
  <Link
    href={`/mix/${mixtape.unique}`}
    className="group block rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 h-full"
  >
    <div className="relative">
      <Image
        width={500}
        height={500}
        src={mixtape.imgthumb}
        alt={mixtape.title}
        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
        {mixtape.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
        {mixtape.djName.toUpperCase()}
      </p>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(mixtape.createdAt).toLocaleDateString()}
        </span>
        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
          <FaHeart className="text-red-500 h-4 w-4" />
        </div>
      </div>
    </div>
  </Link>
);

export default function FavoritesClient({
  initialFavorites,
  initialHasMore,
  limit,
}) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const { ref, inView } = useInView({ threshold: 0, triggerOnce: false });

  useEffect(() => {
    if (!inView || !hasMore || loadingMore) return;

    const fetchMore = async () => {
      setLoadingMore(true);
      try {
        const nextPage = currentPage + 1;
        const res = await fetch(
          `/api/favorites?page=${nextPage}&limit=${limit}`,
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFavorites((prev) => [...prev, ...data.favorites]);
        setCurrentPage(data.pagination.currentPage);
        setHasMore(data.pagination.currentPage < data.pagination.pages);
      } catch (err) {
        console.error("Error loading more favorites:", err);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchMore();
  }, [inView, hasMore, loadingMore, currentPage, limit]);

  const Header = () => (
    <div className="flex flex-col items-center mb-10">
      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
        <FaHeart className="text-red-500 h-6 w-6" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
        Your Favorite Mixes
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl text-center">
        Your personal collection of mixtapes you&apos;ve loved and saved for
        easy access
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-md ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header />

        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-md mx-auto text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-block mb-4">
              <FaHeart className="text-gray-400 dark:text-gray-500 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven&apos;t added any mixes to your favorites yet. Browse
              mixtapes and click the heart icon to add them here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Discover Mixtapes
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((mix) => (
                <MixtapeCard key={mix.id} mixtape={mix} />
              ))}
              {/* Skeleton placeholders while loading more */}
              {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <MixtapeCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div
                ref={ref}
                className="flex justify-center items-center py-8 mt-6"
              >
                {loadingMore && (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
                    <FaSpinner className="animate-spin text-indigo-500 h-6 w-6" />
                  </div>
                )}
              </div>
            )}

            {!hasMore && (
              <div className="text-center py-8 mt-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm px-6 max-w-md mx-auto">
                <p className="font-medium">
                  You&apos;ve reached the end of your favorites!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
