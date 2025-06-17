import React, { useState, useRef, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const availableLanguages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "sv", label: "Svenska", flag: "🇸🇪" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  ];

  const rtlLangs = ["ar", "he", "fa", "ur"];
  const currentLang = i18n.language?.substring(0, 2) || "en";

  const currentLanguageData = availableLanguages.find(
    (lang) => lang.code === currentLang
  ) || {
    label: "Language",
    flag: "🌐",
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    const isRtl = rtlLangs.includes(lng);
    const html = document.documentElement;

    html.dir = isRtl ? "rtl" : "ltr";
    localStorage.setItem("dir", isRtl ? "rtl" : "ltr");
    setShowDropdown(false);
  };

  // Restore direction on load (rtl/ltr)
  useEffect(() => {
    const savedDir = localStorage.getItem("dir");
    if (savedDir) {
      document.documentElement.dir = savedDir;
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative text-sm z-50" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <FaGlobe className="text-base" />
        <span className="hidden sm:flex items-center gap-1">
          <span
            className="text-base"
            style={{
              fontFamily: "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji",
            }}
          >
            {currentLanguageData.flag}
          </span>
          <span>{currentLanguageData.label}</span>
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-50 border border-gray-200 dark:border-gray-300 rounded-md shadow-xl w-48 max-h-96 overflow-y-auto text-sm">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-green-50 dark:hover:bg-gray-200 transition-colors ${
                currentLang === lang.code
                  ? "font-semibold bg-green-100 dark:bg-green-200 text-green-800 dark:text-gray-900"
                  : "text-gray-900 dark:text-gray-900"
              }`}
            >
              <span
                className="text-lg mr-3"
                style={{
                  fontFamily:
                    "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji",
                }}
              >
                {lang.flag}
              </span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
