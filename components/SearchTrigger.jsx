"use client";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("openSearch"))}
      className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center shrink-0"
      aria-label="Search"
    >
      <FaMagnifyingGlass className="w-4 h-4 sm:w-4 sm:h-4" />
    </button>
  );
}
