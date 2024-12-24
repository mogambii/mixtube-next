"use client";
import React, { useEffect, useState, useRef } from "react";
import { Bars } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";
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

  const debounceTimeoutRef = useRef(null);

  const fetchDjs = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mixtube.xyz/api/user/dj/search?search=${query}`
      );
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
    <div className="w-full h-screen flex flex-col justify-center items-center text-center">
      <MdManageSearch className="h-24 w-24 text-gray-500 dark:text-gray-300" />
      <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
        Sorry, no results found
      </h4>
    </div>
  );

  const Results = () =>
    results.map((dj) => (
      <Link href={`/dj/${dj.username}`} key={dj.username}>
        <ProfileCard
          Djname={dj.Djname}
          profilep={dj.profilep}
          name={dj.username}
        />
      </Link>
    ));

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen px-4 md:px-8 rounded-md">
      <div className="max-w-full mx-auto py-3">
        <div className="grid mb-6">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Discover DJs
          </h4>
          <div className="flex gap-4 w-full items-center justify-between py-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md flex-grow"
            >
              <FaMagnifyingGlass className="text-gray-500 dark:text-gray-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter DJ name"
                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </form>
            <NavMenu />
          </div>
        </div>
        <div className="space-y-6">
          {isSearching ? (
            <div className="flex justify-center items-center min-h-[70vh]">
              <Bars
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="bars-loading"
                visible={true}
              />
            </div>
          ) : searchQuery && hasNoResults ? (
            <NoResults />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-evenly justify-items-center">
              <Results />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverDjs;
