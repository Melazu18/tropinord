import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 flex flex-wrap md:flex-nowrap items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity"
      >
        <span className="text-green-600 dark:text-green-400">Tropi</span>
        <span className="text-sky-500 dark:text-sky-400">Nord</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-wrap gap-4 md:gap-6 text-sm font-medium mt-4 md:mt-0">
        <Link
          to="/"
          className={`text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-medium border-b-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/"
              ? "border-green-600"
              : "border-transparent hover:border-green-400"
          }`}
        >
          {t("nav.home")}
        </Link>
        <Link
          to="/services"
          className={`text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-medium border-b-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/services"
              ? "border-green-600"
              : "border-transparent hover:border-green-400"
          }`}
        >
          {t("nav.services")}
        </Link>
        <Link
          to="/explore"
          className={`text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-medium border-b-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/explore"
              ? "border-green-600"
              : "border-transparent hover:border-green-400"
          }`}
        >
          {t("nav.explore")}
        </Link>
        <Link
          to="/contact"
          className={`text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-medium border-b-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/contact"
              ? "border-green-600"
              : "border-transparent hover:border-green-400"
          }`}
        >
          {t("nav.contact")}
        </Link>
        <Link
          to="/about"
          className={`text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-medium border-b-2 transition-all duration-300 ease-in-out ${
            location.pathname === "/about"
              ? "border-green-600"
              : "border-transparent hover:border-green-400"
          }`}
        >
          {t("nav.about")}
        </Link>
      </nav>

      {/* Tools */}
      <div className="flex items-center gap-4 ml-auto md:ml-6 mt-4 md:mt-0">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
