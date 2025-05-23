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
    setOpen(false); // ✅ Closes menu when route changes
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
              className={`rounded-full px-4 py-2 font-medium text-sm transition-all duration-300 ease-in-out ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-indigo-500/30"
                  : "hover:bg-slate-200 dark:hover:bg-gray-800 ring-1 ring-slate-600 dark:ring-gray-500 dark:text-slate-200 hover:scale-105"
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
        className="md:hidden rounded-full p-2 transition-all duration-200 ring-2 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 relative z-10 active:scale-95 active:bg-indigo-50 dark:active:bg-indigo-900/30 focus:outline-none"
        style={{
          boxShadow: open ? "0 0 0 2px rgba(79, 70, 229, 0.5)" : "none",
          borderColor: open ? "#6366f1" : "#64748b",
          transform: `scale(${open ? "0.98" : "1"})`,
        }}
      >
        <div className="relative w-5 h-5">
          <span
            className={`absolute top-1/2 left-0 block w-5 h-0.5 rounded-full transition-all duration-300 ${
              open
                ? "bg-indigo-600 dark:bg-indigo-400 rotate-45"
                : "bg-gray-600 dark:bg-gray-300 -translate-y-1"
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
                ? "bg-indigo-600 dark:bg-indigo-400 -rotate-45"
                : "bg-gray-600 dark:bg-gray-300 translate-y-1"
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 z-50"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div className="py-2 px-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 my-1 text-sm rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setOpen(false)} // ✅ Ensures it closes when clicked
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
    </div>
  );
};

export default NavMenu;
