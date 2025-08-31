"use client";

import { useState, useEffect } from "react";

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // On mount, check system theme preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
  }, []);

  // Toggle dark mode (simple class toggle on document body)
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-md">
      {/* Logo */}
      <div className="text-white font-extrabold text-3xl select-none bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500">
        Artify
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search styles..."
        className="hidden md:block px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
      />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="text-white font-semibold px-4 py-2 hover:brightness-125 transition rounded-lg">
          Get Started
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition"
        >
          {isDark ? (
            <span role="img" aria-label="sun">
              ☀️
            </span>
          ) : (
            <span role="img" aria-label="moon">
              🌙
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
