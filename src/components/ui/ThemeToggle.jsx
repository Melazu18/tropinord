import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import React from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="text-xl text-gray-700 dark:text-yellow-400 hover:text-green-600 dark:hover:text-white transition"
      title="Toggle theme"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}
