"use client";
import React, { useEffect, useState, useRef } from "react";
import { Bars } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import NavMenu from "@/components/NavMenu";

const DiscoverDjs = () => {
  if (typeof window !== "undefined") {
    document.title = "MixTube - Discover Djs";
  }
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  const debounceTimeoutRef = useRef(null);

  const fetchDjs = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/dj-search?query=${query}`);
      const data = await response.json();
      setResults(data);
      setHasNoResults(data.length === 0);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchDjs(query);
    }, 500);
  };

  useEffect(() => {
    fetchDjs("");
  }, []);

  const NoResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-full p-6 mb-4"
      >
        <MdManageSearch className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </motion.div>
      <motion.h4
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
      >
        No DJs Found
      </motion.h4>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-400 max-w-sm"
      >
        We couldn&apos;t find any DJs matching your search. Try using different keywords.
      </motion.p>
    </motion.div>
  );

  const Results = () =>
    results.map((dj, index) => (
      <motion.div
        key={dj.username}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link href={`/dj/${dj.username}`}>
          <ProfileCard
            Djname={dj.djName}
            profilep={dj.profilep}
            name={dj.username}
          />
        </Link>
      </motion.div>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4 sm:px-6 lg:px-8 py-6 rounded-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Discover DJs
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Find and follow your favorite DJs
              </p>
            </div>
            <NavMenu />
          </div>

          <div className="relative max-w-2xl mx-auto w-full space-y-4">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center gap-3"
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMagnifyingGlass className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for DJs by name..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${showFilters ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}`}
                aria-label="Toggle filters"
              >
                <IoFilterSharp className="h-5 w-5" />
              </button>
            </form>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sort by</h3>
                    <div className="flex flex-wrap gap-2">
                      {['recent', 'popular', 'name'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setSortBy(option)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${sortBy === option
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8">
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
              >
                <Bars
                  height="50"
                  width="50"
                  color="#6366f1"
                  ariaLabel="loading-indicator"
                  visible={true}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Searching for DJs...
                </p>
              </motion.div>
            ) : searchQuery && hasNoResults ? (
              <NoResults />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                <Results />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverDjs;
