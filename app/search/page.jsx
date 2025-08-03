"use client";
import React, { useEffect, useState, useCallback } from "react";
import { MdManageSearch, MdOutlineSearchOff } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import MixCard from "../(components)/MixCard";
import NavMenu from "@/components/NavMenu";
import { FaSpinner } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { IoMusicalNotes } from "react-icons/io5";
import { RiVolumeUpLine } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";

// Skeleton loader for mix cards
const MixCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
    <div className="relative">
      <Skeleton className="w-full h-48" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex justify-between text-sm">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  </div>
);

// Improved debounce hook with cleanup
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

const SearchPage = () => {
  useEffect(() => {
    document.title = "MixTapped - Search";
  }, []);

  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Use debounce with 600ms delay - enough time for most typing pauses
  const debouncedSearchTerm = useDebounce(inputValue, 600);

  // Track if we should show loading state
  const showLoading = searching && hasSearched;

  // Effect to handle the debounced search term
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0) {
      fetchData(debouncedSearchTerm);
    } else {
      // Clear results when search term is empty
      setSearchResults([]);
      setNoResults(false);
      setHasSearched(false);
    }
  }, [debouncedSearchTerm]);

  const fetchData = async (query) => {
    if (!query || query.trim().length === 0) return;

    setSearching(true);
    setHasSearched(true);

    try {
      // Add cache busting parameter
      const response = await fetch(
        `/api/search/mixtape?query=${encodeURIComponent(
          query
        )}&_=${Date.now()}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      setSearchResults(result);
      setNoResults(result.length === 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
      setNoResults(true);
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const NoValueState = () => (
    <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-6 mb-6 mx-auto w-24 h-24 flex items-center justify-center">
          <MdOutlineSearchOff className="h-12 w-12 text-indigo-500 dark:text-indigo-300" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-4">
          Discover Mixtapes
        </h3>
        <p className="text-gray-500 dark:text-gray-300 mt-3 mb-6">
          Search by title, DJ name, or genre to find your next favorite mix
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <IoMusicalNotes className="mb-2 text-indigo-500" />
            <span>Mixtapes</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <RiVolumeUpLine className="mb-2 text-indigo-500" />
            <span>DJs</span>
          </div>
        </div>
      </div>
    </div>
  );

  const NoResultsState = () => (
    <div className="w-full py-16 flex justify-center items-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full p-6 mb-6 mx-auto w-20 h-20 flex items-center justify-center">
          <MdManageSearch className="h-10 w-10 text-indigo-500 dark:text-indigo-300" />
        </div>
        <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          No results found for &quot;{inputValue}&quot;
        </h4>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Try different keywords or check the spelling
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="font-medium mb-2">Search tips:</p>
          <ul className="list-disc list-inside space-y-1 text-left">
            <li>Check for typos or misspellings</li>
            <li>Try more general terms</li>
            <li>Search for DJ names or genres</li>
            <li>Keep queries short and simple</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 z-10 px-4 py-4 shadow-md backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex-1">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-indigo-500 dark:text-indigo-400">
                {showLoading ? (
                  <FaSpinner className="animate-spin" size={18} />
                ) : (
                  <FaMagnifyingGlass size={18} />
                )}
              </div>
              <input
                type="text"
                id="search"
                value={inputValue}
                onChange={handleInputChange}
                name="search"
                placeholder="Search by title, DJ name, or genre..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                autoFocus
                aria-label="Search mixtapes"
              />
            </div>
          </form>
          <NavMenu />
        </div>
      </div>
    </div>
  );

  const SkeletonResults = () => (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <MixCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  const SearchResults = () => (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((mix) => (
          <div
            key={mix.unique}
            className="transform hover:scale-[1.02] transition-transform duration-300"
          >
            <MixCard
              link={`/mix/${mix.unique}`}
              title={mix.title}
              year={mix.date}
              name={mix.name}
              img={mix.imgthumb}
              downloads={mix.totalDownloads}
              Djname={mix.djName}
              plays={mix.totalPlays}
            />
          </div>
        ))}
      </div>
      {searchResults.length > 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 bg-gray-50 dark:bg-gray-800/50 py-3 px-6 rounded-full inline-block mx-auto shadow-sm">
          Found {searchResults.length} result
          {searchResults.length !== 1 ? "s" : ""} for{" "}
          <span className="font-semibold">&quot;{inputValue}&quot;</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SearchBar />
      <main className="pt-4 pb-16">
        {/* Initial state - no search yet */}
        {!hasSearched && !inputValue && <NoValueState />}

        {/* Loading state */}
        {showLoading && <SkeletonResults />}

        {/* No results found */}
        {hasSearched && !showLoading && noResults && <NoResultsState />}

        {/* Results found */}
        {hasSearched && !showLoading && searchResults.length > 0 && (
          <SearchResults />
        )}

        {/* Empty search (user cleared input) */}
        {hasSearched && !inputValue && !showLoading && <NoValueState />}
      </main>
    </div>
  );
};

export default SearchPage;
