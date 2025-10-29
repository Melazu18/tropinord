import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Moon, Sun, ShoppingCart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "../../contexts/CartContext";

const NAV_LINKS = [
  ["nav.services", "/services"],
  ["nav.about", "/about"],
  ["nav.products", "/products"],
  ["nav.offers", "/offers"],
  ["nav.faq", "/faq"],
  ["nav.contact", "/contact"],
];

export default function Header({ darkMode, toggleDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [showTagline, setShowTagline] = useState(true);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  const { t } = useTranslation();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNavDropdownOpen(false);
      }
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };

    const handleScroll = () => {
      setNavDropdownOpen(false);
      setShowTagline(window.scrollY < 20);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setNavDropdownOpen(false);
        setDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow"
      style={{ minHeight: "6rem" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/home" className="flex flex-col items-start">
          <img
            src="/images/tropinordlogo001.png"
            alt={t("logo.alt", { defaultValue: "TropiNord Logo" })}
            className="h-28 w-auto object-contain"
          />
          <span
            className={`text-xs md:text-sm mt-1 font-bold tracking-tight transition-all duration-500 ease-in-out transform ${
              showTagline
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            } text-amber-600 dark:text-amber-300 font-bold text-shadow-sm`}
          >
            {t("tagline", {
              defaultValue: "Tropical Traditions, Nordic Standards",
            })}
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative group">
            <ShoppingCart className="w-6 h-6 text-gray-800 dark:text-white group-hover:scale-110 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <LanguageSwitcher />
          <ThemeToggle />

          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center space-x-2 text-sm text-gray-800 dark:text-gray-100 hover:scale-105 transition-transform"
            aria-label={t("menu.openAriaLabel", { defaultValue: "Open menu" })}
          >
            <span className="text-2xl animate-pulse">☰</span>
            <span className="font-medium">
              {t("menu.label", { defaultValue: "Menu" })}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Dropdown Nav */}
      <div
        className="hidden md:flex items-center justify-center pb-2 relative"
        ref={dropdownRef}
      >
        <button
          onClick={() => setNavDropdownOpen(!navDropdownOpen)}
          className="flex items-center space-x-1 text-sm font-medium text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md border border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          aria-label={t("menu.toggleAriaLabel", {
            defaultValue: "Toggle menu",
          })}
        >
          <span>{t("menu.label", { defaultValue: "Menu" })}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              navDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {navDropdownOpen && (
          <div className="absolute top-full mt-2 w-48 backdrop-blur-md bg-white/70 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl z-50 animate-fade-in-scale">
            <nav className="flex flex-col p-2 space-y-1">
              {NAV_LINKS.map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setNavDropdownOpen(false)}
                >
                  {t(label)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Mobile Drawer Nav */}
      <div
        className={`fixed inset-0 z-40 transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {drawerOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <div
          ref={drawerRef}
          className="relative bg-white dark:bg-gray-900 w-64 h-full p-6 shadow-xl space-y-6 text-gray-800 dark:text-gray-100 font-medium"
        >
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-4 right-4 text-2xl"
            aria-label={t("menu.closeAriaLabel", {
              defaultValue: "Close menu",
            })}
          >
            ✕
          </button>
          {NAV_LINKS.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setDrawerOpen(false)}
              className="block"
            >
              {t(label)}
            </Link>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale {
            animation: fadeInScale 0.2s ease-out;
          }
        `}
      </style>
    </header>
  );
}
