import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

function MpNav({ place }) {
  return (
    <form>
      <div className="flex bg-slate-200 w-full rounded-full items-center h-10 dark:bg-gray-950 flex-grow px-2">
        <button type="submit" className="ml-2">
          <FaMagnifyingGlass className="dark:text-slate-50" />
        </button>
        <input
          type="text"
          name="search"
          placeholder={place}
          className="bg-transparent outline-none px-5 py-2 w-full text-black dark:text-slate-50 placeholder:dark:text-sky-50"
        />
      </div>
    </form>
  );
}

export default MpNav;
