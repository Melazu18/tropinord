import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle({ className = "" }) {
  const { t } = useTranslation();
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
    <div
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      onClick={() => setDark(!dark)}
      title={t(dark ? "common.lightMode" : "common.darkMode")}
    >
      {dark ? (
        <FaSun className="text-xl transition-transform duration-500 hover:rotate-180 text-yellow-300" />
      ) : (
        <FaMoon className="text-xl transition-transform duration-500 hover:rotate-180 text-blue-400" />
      )}
      <span className="text-sm">
        {dark ? t("common.lightMode", { defaultValue: "Light Mode" }) : t("common.darkMode", { defaultValue: "Dark Mode" })}
      </span>
    </div>
  );
}
