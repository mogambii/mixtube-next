"use client";
import React, { useEffect, useState } from "react";
import { MdManageSearch, MdOutlineSearchOff } from "react-icons/md";
import { Bars } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import MixCard from "../(components)/MixCard";

const SearchPage = () => {
  useEffect(() => {
    document.title = "MixTube - Search";
  }, []);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (newValue) fetchData(newValue);
  };

  const fetchData = async (query) => {
    setSearching(true);
    try {
      const response = await fetch(
        `https://api.mixtube.xyz/api/search?search=${query}`
      );

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
    <div className="w-full h-screen flex justify-center items-center">
      <div className="">
        <MdOutlineSearchOff className="h-24 w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 text-gray-400 dark:text-slate-50  mx-auto" />
        <h3 className="text-3xl md:text-4xl font-mono text-gray-500 dark:text-slate-50">
          ENTER KEYWORD
        </h3>
      </div>
    </div>
  );

  const NoResults = () => (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="grid justify-center items-center gap-3 text-center">
        <MdManageSearch className="h-24 w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 text-gray-400 dark:text-slate-50 mx-auto" />
        <h4 className="text-xl md:text-2xl font-mono text-gray-500 dark:text-slate-50">
          NO RESULTS FOUND
        </h4>
      </div>
    </div>
  );

  const MpNav = () => (
    <form onSubmit={(e) => e.preventDefault()} className="p-1">
      <div className="flex items-center bg-slate-200 p-2 rounded-full dark:bg-gray-800">
        <FaMagnifyingGlass
          onClick={(e) => e.preventDefault()}
          className="dark:text-slate-50 text-gray-500 ml-2"
          aria-label="Search Icon"
        />
        <input
          type="text"
          id="search"
          value={searchValue}
          onChange={handleInputChange}
          name="search"
          placeholder="Search mixtapes"
          className="bg-transparent outline-none px-4 py-1 w-full dark:text-slate-100"
        />
      </div>
    </form>
  );

  const Results = () => (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {searchResults.map((mix) => (
        <MixCard
          key={mix.unique}
          link={`/mix/${mix.unique}`}
          title={mix.title}
          year={mix.date}
          name={mix.name}
          img={mix.imgthumb}
          downloads={mix.downloads}
          Djname={mix.Djname}
          plays={mix.plays}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen ">
      {MpNav()}
      <div className="px-4">
        {searchValue && (
          <h2 className="font-bold dark:text-slate-200 py-3 text-2xl">
            <span className="text-blue-700">Results for: {searchValue}</span>
          </h2>
        )}
        {searchValue ? (
          !searching ? (
            noResults ? (
              <NoResults />
            ) : (
              <Results />
            )
          ) : (
            <div className="flex justify-center py-8">
              <Bars
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="bars-loading"
                visible={true}
              />
            </div>
          )
        ) : (
          <NoValue />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
