"use client";
import React, { useEffect, useState, useCallback } from "react";
import { MdManageSearch, MdOutlineSearchOff } from "react-icons/md";
import { Blocks } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import MixCard from "../(components)/MixCard";
import debounce from "lodash/debounce";
import NavMenu from "@/components/NavMenu";
import { FaSpinner } from "react-icons/fa";

const SearchPage = () => {
  useEffect(() => {
    document.title = "MixTube - Search";
  }, []);

  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) fetchData(query);
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setNoResults(false);
    if (!newValue) {
      setSearchResults([]);
      return;
    }
    debouncedSearch(newValue);
  };

  const fetchData = async (query) => {
    setSearching(true);
    try {
      const response = await fetch(`/api/search/mixtape?query=${query}`);

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      setSearchResults(result);
      setNoResults(result.length === 0);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setSearching(false);
    }
  };

  const NoValue = () => (
    <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg">
        <MdOutlineSearchOff className="h-24 w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 text-gray-400 dark:text-slate-50 mx-auto animate-pulse" />
        <h3 className="text-2xl md:text-3xl font-mono text-gray-500 dark:text-slate-50 mt-4">
          Start typing to search mixtapes
        </h3>
        <p className="text-gray-400 dark:text-gray-300 mt-2">
          Search by title, DJ name, or genre
        </p>
      </div>
    </div>
  );

  const NoResults = () => (
    <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg">
        <MdManageSearch className="h-24 w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 text-gray-400 dark:text-slate-50 mx-auto" />
        <h4 className="text-xl md:text-2xl font-mono text-gray-500 dark:text-slate-50 mt-4">
          No results found for &quot;{searchValue}&quot;
        </h4>
        <p className="text-gray-400 dark:text-gray-300 mt-2">
          Try different keywords or check the spelling
        </p>
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex-1">
            <div className="flex items-center bg-gray-100 rounded-full py-1 px-2 shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
              <FaMagnifyingGlass
                className="dark:text-slate-50 text-gray-500 ml-2"
                aria-label="Search Icon"
              />
              <input
                type="text"
                id="search"
                value={searchValue}
                onChange={handleInputChange}
                name="search"
                placeholder="Search by title, DJ name, or genre..."
                className="bg-transparent outline-none px-4 py-1 w-full text-gray-700 dark:text-slate-100 placeholder-gray-400"
                autoFocus
              />
              {searching && (
                <div className="animate-spin mr-2">
                  <FaSpinner
                    className="dark:text-slate-50 text-gray-500"
                    aria-label="Searching"
                  />
                </div>
              )}
            </div>
          </form>
          <NavMenu />
        </div>
      </div>
    </div>
  );

  const Results = () => (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((mix) => (
          <div
            key={mix.unique}
            className="transform hover:scale-[1.02] transition-transform duration-200"
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
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          Found {searchResults.length} result
          {searchResults.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SearchBar />
      <main className="pt-4">
        {!searchValue && <NoValue />}
        {noResults && searchValue && !searching && <NoResults />}
        {searching && searchResults.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((mix) => (
                <div
                  key={mix.unique}
                  className="transform hover:scale-[1.02] transition-transform duration-200 opacity-50"
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
          </div>
        )}
        {!searching && searchResults.length > 0 && <Results />}
      </main>
    </div>
  );
};

export default SearchPage;
