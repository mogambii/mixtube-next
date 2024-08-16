"use client";

import { useEffect, useState } from "react";
import { FaRegMoon, FaSun } from "react-icons/fa6";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="h-8 w-8 flex items-center justify-center rounded-full bg-black dark:bg-gray-700 text-white hover:bg-gray-600 dark:hover:bg-gray-500"
        aria-label={`Switch theme`}
      >
        {darkMode ? (
          <FaRegMoon className="h-5 w-5" />
        ) : (
          <FaSun className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
