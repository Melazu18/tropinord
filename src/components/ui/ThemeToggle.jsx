// src/components/ui/ThemeToggle.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle({ className = "", iconOnly = true }) {
  const { t } = useTranslation("header");

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

  const labelKey = dark ? "lightMode" : "darkMode";
  const label = t(labelKey, {
    defaultValue: dark ? "Light Mode" : "Dark Mode",
  });

  const toggle = () => setDark((v) => !v);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={dark}
      title={label}
      className={`inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 ${className}`}
    >
      {dark ? (
        <FaSun className="text-xl transition-transform duration-500 hover:rotate-180" />
      ) : (
        <FaMoon className="text-xl transition-transform duration-500 hover:rotate-180" />
      )}
      {!iconOnly && <span className="ml-2 text-sm">{label}</span>}
    </button>
  );
}
