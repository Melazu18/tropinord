import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import {
  FaHome,
  FaConciergeBell,
  FaCompass,
  FaEnvelope,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTagline, setShowTagline] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowTagline(window.scrollY < 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClasses = (path) =>
    `relative flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 font-semibold text-sm group
     ${
       location.pathname === path
         ? "bg-green-600 text-white"
         : "text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-800 hover:text-green-800 dark:hover:text-white"
     }`;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 shadow-md backdrop-blur-md"
          : "bg-white dark:bg-gray-900"
      } border-b border-gray-100 dark:border-gray-800`}
    >
      <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between px-4 md:px-6 py-3">
        {/* Logo with tagline */}
        <Link
          to="/"
          className="hover:opacity-90 transition-opacity flex flex-col items-start"
        >
          <img
            src="/images/tropinordlogo001.png"
            alt="TropiNord Logo"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-sm"
          />
          <span
            className={`text-xs md:text-sm mt-1 font-light transition-all duration-500 ease-in-out transform ${
              showTagline
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            } text-gray-600 dark:text-gray-300`}
          >
            Tropical Traditions, Nordic Standards.
          </span>
        </Link>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200 text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav
          className={`w-full md:w-auto flex-col md:flex-row md:flex gap-3 md:gap-5 mt-4 md:mt-0 ${
            menuOpen ? "flex animate-slide-down" : "hidden md:flex"
          }`}
        >
          <Link
            to="/"
            className={navLinkClasses("/")}
            onClick={() => setMenuOpen(false)}
          >
            <FaHome className="text-xs" />
            {t("nav.home")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/services"
            className={navLinkClasses("/services")}
            onClick={() => setMenuOpen(false)}
          >
            <FaConciergeBell className="text-xs" />
            {t("nav.services")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/explore"
            className={navLinkClasses("/explore")}
            onClick={() => setMenuOpen(false)}
          >
            <FaCompass className="text-xs" />
            {t("nav.explore")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/contact"
            className={navLinkClasses("/contact")}
            onClick={() => setMenuOpen(false)}
          >
            <FaEnvelope className="text-xs" />
            {t("nav.contact")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/about"
            className={navLinkClasses("/about")}
            onClick={() => setMenuOpen(false)}
          >
            <FaInfoCircle className="text-xs" />
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          import {Link} from "react-router-dom"; // make sure this is imported
          // Inside your return block, replace the current Place Order button
          with:
          <Link
            to="/order"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow transition duration-200"
          >
            🌍 Place Order
          </Link>
        </nav>

        {/* Tools */}
        <div className="flex items-center gap-4 ml-auto md:ml-6 mt-4 md:mt-0">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
