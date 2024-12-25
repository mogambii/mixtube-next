import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

function MpNav() {
  return (
    <form>
      <div className="flex bg-slate-200 w-full rounded-full items-center h-10 dark:bg-gray-950 flex-grow px-2">
          <FaMagnifyingGlass className="dark:text-slate-50 ml-2" />
        <button
          role="search"
          aria-label="Search Mixtape"
          className="bg-transparent text-start outline-none px-2 py-2 w-full text-black dark:text-slate-50 placeholder:dark:text-sky-50"
        >search mixtapes
        </button>
      </div>
    </form>
  );
}

export default MpNav;
