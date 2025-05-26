"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  const toggleMenu = () => setOpen((prev) => !prev);

  // Close menu on pathname change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close menu on escape key press
  useEffect(() => {
    if (!open) return;

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [open]);

  const menuItems = [
    { href: "/discover", label: "Discover Mixes", icon: "🎵" },
    { href: "/discoverdjs", label: "Discover DJs", icon: "🎧" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="relative" ref={menuRef}>
      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-x-3">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 font-medium text-sm transition-all duration-200 ease-out ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/40"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-600 hover:shadow-md"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="flex items-center gap-1.5">
                {item.icon && <span className="text-xs">{item.icon}</span>}
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`md:hidden rounded-full p-2 transition-all duration-200 ${
          open
            ? "ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : "ring-1 ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        } relative z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        <div className="relative w-5 h-5">
          <span
            className={`absolute top-1/2 left-0 block w-5 h-0.5 rounded-full transition-all duration-300 ${
              open
                ? "bg-indigo-600 dark:bg-indigo-400 rotate-45 translate-y-0"
                : "bg-gray-600 dark:bg-gray-300 -translate-y-1.5"
            }`}
          />
          <span
            className={`absolute top-1/2 left-0 block w-5 h-0.5 rounded-full transition-all duration-300 ${
              open
                ? "bg-indigo-600 dark:bg-indigo-400 opacity-0"
                : "bg-gray-600 dark:bg-gray-300 opacity-100"
            }`}
          />
          <span
            className={`absolute top-1/2 left-0 block w-5 h-0.5 rounded-full transition-all duration-300 ${
              open
                ? "bg-indigo-600 dark:bg-indigo-400 -rotate-45 translate-y-0"
                : "bg-gray-600 dark:bg-gray-300 translate-y-1.5"
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full right-0 mt-2 w-56 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 z-50 animate-fade-in"
        >
          <div className="py-1 px-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 my-1 text-sm rounded-md transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80"
                  }`}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex items-center gap-2 w-full">
                    {item.icon && (
                      <span className="text-base">{item.icon}</span>
                    )}
                    {item.label}
                  </span>
                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white/80"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Add this to your global CSS for the fade-in animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NavMenu;
