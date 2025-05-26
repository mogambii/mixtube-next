import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

function MpNav({ place = "Search Mixtapes" }) {
  return (
    <form className="w-full max-w-md" role="search">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaMagnifyingGlass className="h-4 w-4 text-gray-400 dark:text-gray-300" />
        </div>
        <input
          type="search"
          placeholder={place}
          aria-label={place}
          className="block w-full pl-10 pr-4 py-2 rounded-full border border-transparent bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </form>
  );
}

export default MpNav;
