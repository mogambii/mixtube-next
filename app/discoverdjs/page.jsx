"use client";
import React, { useEffect, useState, useRef } from "react";
import { Bars } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";

const DiscoverDjs = () => {
  if (typeof window !== "undefined") {
    document.title = "MixTube - Discover Djs";
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);

  const debounceTimeoutRef = useRef(null);

  const fetchDjs = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/user/dj/search?search=${query}`
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

  const Menu = () => (
    <div className="w-auto">
      <div className="hidden md:flex gap-x-5">
        <Link href="/discoverdjs">
          <button className="rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10">
            Discover DJs
          </button>
        </Link>
        <Link href="/discover">
          <button className="rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10">
            Discover Mixxes
          </button>
        </Link>{" "}
      </div>
      <div className="md:hidden">
        <button className="relative" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="ring-1 rounded-full p-3">
            {isMenuOpen ? (
              <IoClose className="h-4 w-4 dark:text-slate-50" />
            ) : (
              <CiMenuFries className="h-4 w-4 dark:text-slate-50" />
            )}
          </div>
        </button>
        {isMenuOpen && (
          <div className="shadow-1 absolute right-16 top-40 border-4 p-4 rounded-lg dark:border-slate-200 bg-slate-900 text-slate-50">
            <div className="grid gap-2 w-full">
              <Link href="/discoverdjs">
                <button className="w-full rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10">
                  Discover DJs
                </button>
              </Link>
              <Link href="/discover">
                <button className="w-full rounded-3xl px-3 py-1 font-righteous dark:text-slate-50 border-2 text-xs h-10">
                  Discover Mixxes
                </button>
              </Link>{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const NoResults = () => (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="grid justify-center items-center gap-3">
        <MdManageSearch className="h-20 sm:h-24 md:h-32 lg:h-36 xl:h-40 w-full sm:w-16 md:w-20 lg:w-36 xl:w-40 dark:text-slate-50 flex  justify-center flex" />
        <h4 className="text-xl font-mono dark:text-slate-50">
          Sorry, no results found
        </h4>
      </div>
    </div>
  );

  const Results = () =>
    results.map((dj) => (
      <div
        className="w-full flex justify-center m-auto items-center"
        key={dj.username}
      >
        <Link href={`/dj/${dj.username}`}>
          <ProfileCard
            Djname={dj.Djname}
            profilep={dj.profilep}
            name={dj.username}
          />
        </Link>
      </div>
    ));

  return (
    <div>
      <h4 className="text-xl dark:text-slate-200 mb-2 font-righteous">
        Discover DJs
      </h4>
      <div className="min-h-screen">
        <div className="flex justify-between">
          <form onSubmit={(e) => e.preventDefault()} className="w-full mr-3">
            <div className="flex bg-slate-200 p-2 rounded-full items-center h-10 dark:bg-gray-800 w-full">
              <FaMagnifyingGlass className="dark:text-slate-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter DJ name"
                className="bg-transparent outline-none px-5 py-2 w-full dark:text-slate-100"
              />
            </div>
          </form>
          <Menu />
        </div>
        <div className="w-full">
          <div className="w-full pl-4">
            <h2 className="font-bold dark:text-slate-200 py-3 text-2xl">
              {searchQuery && (
                <span className="text-blue-700">
                  Results for: {searchQuery}
                </span>
              )}
            </h2>
          </div>
          {isSearching ? (
            <div className="flex justify-center min-h-svh items-center">
              <Bars
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="bars-loading"
                visible={true}
              />
            </div>
          ) : searchQuery ? (
            hasNoResults ? (
              <NoResults />
            ) : (
              <div className="flex pb-4 justify-center items-center gap-2">
                <div className="grid grid-cols-2 ff:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2 w-full">
                  <Results />
                </div>
              </div>
            )
          ) : (
            <div className="flex pb-4 justify-center items-center gap-2">
              <div className="grid grid-cols-2 ff:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2 w-full">
                <Results />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverDjs;
