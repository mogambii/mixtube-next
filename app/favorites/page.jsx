"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaHeart, FaSpinner } from "react-icons/fa";
import Image from "next/image";

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
  const [totalPages, setTotalPages] = useState(0);
  const limit = 9;

  const fetchFavorites = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/favorites?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch favorites");
      const data = await response.json();
      setFavorites(data.favorites);
      setTotalPages(data.pagination.pages);
      setCurrentPage(data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchFavorites(currentPage);
    }
  }, [session, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-100 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-blue-500 text-5xl" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((mix) => (
              <MixtapeCard key={mix.id} mixtape={mix} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md transition-colors duration-300 shadow-md ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-md">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md transition-colors duration-300 shadow-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
