"use client";
import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

const NavMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  const menuItems = [
    { href: "/discover", label: "Discover Mixes" },
    { href: "/discoverdjs", label: "Discover DJs" },
  ];

  return (
    <div className="relative">
      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-x-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 font-medium hover:bg-slate-200 dark:hover:bg-gray-800 text-sm ring-1 ring-slate-600 dark:ring-gray-500 dark:text-slate-200">
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="md:hidden ring-2 rounded-full p-2 ring-slate-600 dark:ring-gray-500 bg-slate-100 dark:bg-gray-950"
      >
        {open ? (
          <HiX className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <HiMenu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
