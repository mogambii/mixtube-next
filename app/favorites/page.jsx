"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaHeart, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const MixtapeCardSkeleton = () => (
  <div className="block rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
    <Skeleton className="w-full h-48" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const MixtapeCard = ({ mixtape }) => (
  <Link
    href={`/mix/${mixtape.unique}`}
    className="block hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md"
  >
    <Image
      width={500}
      height={500}
      src={mixtape.imgthumb}
      alt={mixtape.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
        {mixtape.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {mixtape.djName.toUpperCase()}
      </p>
    </div>
  </Link>
);

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 9;

  const fetchFavorites = async (page, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const response = await fetch(
        `/api/favorites?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch favorites");
      const data = await response.json();
      if (isLoadMore) {
        setFavorites((prevFavorites) => [...prevFavorites, ...data.favorites]);
      } else {
        setFavorites(data.favorites);
      }
      setCurrentPage(data.pagination.currentPage);
      setHasMore(data.pagination.currentPage < data.pagination.pages);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchFavorites(1); // Fetch initial page
    }
  }, [session]);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore && session?.user) {
      fetchFavorites(currentPage + 1, true);
    }
  }, [inView, hasMore, loading, loadingMore, session, currentPage]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          Please sign in to view your favorites
        </p>
      </div>
    );
  }

  if (loading && favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center flex items-center justify-center">
          <FaHeart className="mr-2 text-red-500" /> Your Favorite Mixes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <MixtapeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center flex items-center justify-center">
        <FaHeart className="mr-2 text-red-500" /> Your Favorite Mixes
      </h1>
      {favorites.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          You haven&apos;t added any mixes to your favorites yet
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((mix) => (
              <MixtapeCard key={mix.id} mixtape={mix} />
            ))}
          </div>

          {/* Infinite scroll loader */}
          {(loadingMore || (hasMore && favorites.length > 0)) && (
            <div
              ref={ref}
              className="col-span-full flex justify-center items-center py-8"
            >
              {loadingMore && (
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              )}
            </div>
          )}
          {!hasMore && favorites.length > 0 && (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              You&apos;ve reached the end of your favorites!
            </div>
          )}
        </>
      )}
    </div>
  );
}
