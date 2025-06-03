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

  // Get current language safely
  const rawLang = i18n.language || localStorage.getItem("lng") || "en";
  const currentLang = rawLang.length === 2 ? rawLang : "en";

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setShowDropdown(false);
  };

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

  useEffect(() => {
    console.log("🌐 Current language:", currentLang);
  }, [currentLang]);

  return (
    <div className="relative text-sm" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 text-gray-700 hover:text-green-700"
      >
        <FaGlobe />
        <span>{currentLang?.toUpperCase?.() || "EN"}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-50">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center w-full px-4 py-2 text-left hover:bg-green-50 ${
                currentLang === lang.code ? "font-semibold text-green-700" : ""
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
