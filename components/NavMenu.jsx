"use client";
import Link from "next/link";
import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

const NavMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  return (
    <div>
      <nav className="hidden mx:flex gap-x-3">
        <Link href="/discoverdjs">
          <button className="rounded-full px-4 py-2 font-semibold dark:text-slate-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-xs h-10">
            Discover DJs
          </button>
        </Link>
        <Link href="/discover">
          <button className="rounded-full px-4 py-2 font-semibold dark:text-slate-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-xs h-10">
            Discover Mixes
          </button>
        </Link>
      </nav>
      <div className="mx:hidden relative">
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="ring-2 rounded-full p-2 ring-slate-600 dark:ring-gray-500 bg-slate-100 dark:bg-gray-950"
        >
          {open ? (
            <IoClose className="h-5 w-5 dark:text-slate-50 text-slate-905" />
          ) : (
            <CiMenuFries className="h-5 w-5 dark:text-slate-50 text-slate-950" />
          )}
        </button>
        {open && (
          <div className="transition-all duration-300 ease-in-out shadow-xl absolute right-0 top-12 border border-slate-300 dark:border-slate-700 p-4 rounded-lg dark:bg-slate-800 bg-white text-slate-800 dark:text-slate-50">
            <div className="grid gap-3 w-40">
              <Link href="/discoverdjs">
                <button className="w-full rounded-full px-4 py-2 font-semibold text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-slate-50 border-2 border-slate-300 dark:border-slate-600 transition-colors duration-200 ease-in-out">
                  Discover DJs
                </button>
              </Link>
              <Link href="/discover">
                <button className="w-full rounded-full px-4 py-2 font-semibold text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-slate-50 border-2 border-slate-300 dark:border-slate-600 transition-colors duration-200 ease-in-out">
                  Discover Mixes
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavMenu;
