"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc2, Music } from "lucide-react";

const NavMenu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setOpen((prev) => !prev);

  // Close menu on pathname change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const menuRef = useRef(null);

  // Handle outside clicks and escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const menuItems = [
    { href: "/discover", label: "All Mixxes", icon: <Music size={24} /> },
    { href: "/discoverdjs", label: "All DJs", icon: <Disc2 size={24} /> },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        className={`p-2 rounded-full transition-all duration-300 relative z-[110] ${
          open
            ? "bg-indigo-500/10 text-indigo-500"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <div className="relative w-5 h-4 flex flex-col justify-between">
          <span
            className={`w-full h-[2px] rounded-full transition-all duration-300 origin-left ${
              open ? "bg-indigo-500 rotate-45 translate-x-[2px] -translate-y-[1px]" : "bg-current"
            }`}
          />
          <span
            className={`w-full h-[2px] rounded-full transition-all duration-300 ${
              open ? "opacity-0" : "bg-current"
            }`}
          />
          <span
            className={`w-full h-[2px] rounded-full transition-all duration-300 origin-left ${
              open ? "bg-indigo-500 -rotate-45 translate-x-[2px] translate-y-[1px]" : "bg-current"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Modal */}
      {open && (
        <>
          {/* Modal Content anchored to the button */}
          <div className="absolute top-[calc(100%+1rem)] right-0 w-64 rounded-3xl p-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-2xl border border-gray-100 dark:border-white/10 z-[105] animate-in slide-in-from-top-2 fade-in duration-200">
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-3 px-2">
              Navigation
            </h3>
            
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group ${
                      active
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                        : "text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        active
                          ? "bg-white/20"
                          : "bg-indigo-50 dark:bg-gray-800 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className={`text-base font-bold ${active ? "" : "group-hover:text-indigo-600 dark:group-hover:text-white"}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavMenu;
