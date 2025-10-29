// src/components/ui/LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { translateExistingPath } from "../../utils/getLocalizedPath";

/**
 * Props
 *  - compact: boolean → icon-only trigger sized like other header icons (40x40)
 *  - placement: 'left' | 'right' → which side to anchor the dropdown to
 *  - className: extra classes for the trigger button
 *  - wrapperClassName: extra classes for the outer wrapper (optional)
 */
export default function LanguageSwitcher({
  compact = false,
  placement = "right",
  className = "",
  wrapperClassName = "",
}) {
  const { i18n, t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const availableLanguages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "sv", label: "Svenska", flag: "🇸🇪" },
    // Extras: do not change the URL segment for these
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  const rtlLangs = ["ar", "he", "fa", "ur"];
  const currentLang = (i18n.language || "en").slice(0, 2);

  const currentLanguageData = availableLanguages.find(
    (l) => l.code === currentLang
  ) || {
    label: "Language",
    flag: "🌐",
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);

    const isRtl = rtlLangs.includes(lng);
    const html = document.documentElement;
    html.dir = isRtl ? "rtl" : "ltr";
    localStorage.setItem("dir", isRtl ? "rtl" : "ltr");

    // Only rewrite the URL for languages that your router supports as a segment.
    const supportsSegment = lng === "en" || lng === "sv";
    const fullPath = location.pathname + location.search + location.hash;

    const targetPath = supportsSegment
      ? translateExistingPath(fullPath, lng) // also translates slugs (home ⇄ hem, etc.)
      : fullPath; // keep URL for other languages

    navigate(targetPath, { replace: true });
    setShowDropdown(false);
  };

  // Restore direction on load
  useEffect(() => {
    const savedDir = localStorage.getItem("dir");
    if (savedDir) document.documentElement.dir = savedDir;
  }, []);

  // Close dropdown on outside click / ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setShowDropdown(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Trigger styles: match icon buttons (40x40) when compact
  const triggerBase =
    "inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c94c]/70 hover:bg-white/10";
  const size = compact ? "h-10 w-10 p-0" : "px-2 py-2";
  const triggerClass = `${triggerBase} ${size} ${className}`;

  // Dropdown side & alignment
  const side =
    placement === "left"
      ? "left-0 origin-top-left"
      : "right-0 origin-top-right";

  return (
    <div className={`relative ${wrapperClassName}`}>
      {/* Trigger */}
      <button
        ref={btnRef}
        onClick={toggleDropdown}
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={showDropdown}
        title={t("header.language", { defaultValue: "Language" })}
      >
        <FaGlobe className={compact ? "text-[18px]" : "text-base"} />
        {!compact && (
          <span className="hidden sm:flex items-center gap-1 ml-2 text-sm text-gray-200">
            <span
              className="text-base"
              style={{
                fontFamily:
                  "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji",
              }}
            >
              {currentLanguageData.flag}
            </span>
            <span>{currentLanguageData.label}</span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute ${side} top-full mt-1 w-48 max-h-96 overflow-y-auto rounded-md border border-white/10 bg-[#0e1a2e] text-white shadow-xl z-[10030] ${
          showDropdown ? "block" : "hidden"
        }`}
        role="menu"
      >
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center w-full px-3 py-2 text-left text-sm hover:bg-white/10 ${
              currentLang === lang.code ? "bg-white/5" : ""
            }`}
            role="menuitem"
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
    </div>
  );
}
