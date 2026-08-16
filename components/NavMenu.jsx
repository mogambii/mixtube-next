"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc2, Music, LogIn, UserPlus, Bell, User } from "lucide-react";
import { useSession } from "next-auth/react";

const NavMenu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

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

  const mainMenuItems = [
    { href: "/discover", label: "All Mixxes", icon: <Music size={18} /> },
    { href: "/discoverdjs", label: "All DJs", icon: <Disc2 size={18} /> },
  ];

  const authMenuItems = session
    ? [
        { href: "/profile", label: "My Profile", icon: <User size={18} /> },
        { href: "/notifications", label: "Notifications", icon: <Bell size={18} /> },
      ]
    : [
        { href: "/login", label: "Log In", icon: <LogIn size={18} /> },
        { href: "/signup", label: "Sign Up", icon: <UserPlus size={18} /> },
      ];

  const isActive = (href) => pathname === href;

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 relative z-[110] flex items-center justify-center shrink-0 ${
          open
            ? "bg-indigo-500/10 text-indigo-500"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex flex-col justify-between py-[2px] sm:py-[3px]">
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
        <div className="absolute top-[calc(100%+0.75rem)] right-0 w-60 sm:w-64 max-w-[calc(100vw-1.5rem)] rounded-3xl p-3.5 sm:p-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-[105] animate-in slide-in-from-top-2 fade-in duration-200">
          <h3 className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-2 px-2">
            Explore
          </h3>
          
          <div className="flex flex-col gap-1.5 mb-3">
            {mainMenuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl transition-all duration-200 group ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 hover:shadow-sm"
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
                  <span className={`text-sm sm:text-base font-bold ${active ? "" : "group-hover:text-indigo-600 dark:group-hover:text-white"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-2" />

          <h3 className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-2 px-2">
            Account
          </h3>

          <div className="flex flex-col gap-1.5">
            {authMenuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl transition-all duration-200 group ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      active
                        ? "bg-white/20"
                        : "bg-purple-50 dark:bg-gray-800 text-purple-500 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className={`text-sm sm:text-base font-bold ${active ? "" : "group-hover:text-purple-600 dark:group-hover:text-white"}`}>
                    {item.label}
                  </span>
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
