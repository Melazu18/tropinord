// src/components/ui/LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { routeMap } from "../../routes/routeMap"; // 👈 use routeMap, not translateExistingPath

const SUPPORTED = ["en", "sv", "fr", "es"];
const RTL = ["ar", "he", "fa", "ur"];

function getLangFromPathname(pathname) {
  const m = pathname.match(/^\/(en|sv|fr|es)(?=\/|$)/);
  return m ? m[1] : null;
}

/** Detect which route key we are on for a given lang. Longest-match wins. */
function detectRouteKey(pathname, lang) {
  const after = pathname.replace(/^\/(en|sv|fr|es)/, ""); // strip "/{lang}"
  const clean = after.replace(/^\/+/, ""); // e.g. "kaffe" or "origine/huiles"
  let best = null;

  for (const key of Object.keys(routeMap)) {
    const slug = routeMap[key]?.[lang];
    if (!slug) continue;
    if (clean === slug || clean.startsWith(slug + "/")) {
      if (!best || slug.length > best.slug.length) {
        best = { key, slug, tail: clean.slice(slug.length) }; // tail like "" or "/foo"
      }
    }
  }
  return best; // { key, slug, tail } | null
}

function buildPathForLang(targetLang, detected, fallbackPathname) {
  if (detected) {
    const tgtSlug = routeMap[detected.key]?.[targetLang];
    if (tgtSlug) return `/${targetLang}/${tgtSlug}${detected.tail || ""}`;
  }
  // Fallback: just swap the first segment or go to the home of targetLang
  if (/^\/(en|sv|fr|es)(?=\/|$)/.test(fallbackPathname)) {
    return fallbackPathname.replace(/^\/(en|sv|fr|es)/, `/${targetLang}`);
  }
  return `/${targetLang}/${routeMap.home[targetLang]}`;
}

/**
 * Props
 *  - compact: boolean → icon-only trigger sized like other header icons (40x40)
 *  - placement: 'left' | 'right'
 *  - className, wrapperClassName
 */
export default function LanguageSwitcher({
  compact = false,
  placement = "right",
  className = "",
  wrapperClassName = "",
}) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentLang =
    getLangFromPathname(location.pathname) ||
    (i18n.language || "en").slice(0, 2);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "sv", label: "Svenska", flag: "🇸🇪" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];
  const currentData = languages.find((l) => l.code === currentLang) || {
    label: "Language",
    flag: "🌐",
  };

  const onChange = async (lng) => {
    if (!SUPPORTED.includes(lng) || lng === currentLang) {
      setOpen(false);
      return;
    }
    // sync i18n + html dir + localStorage
    await i18n.changeLanguage(lng);
    const isRtl = RTL.includes(lng);
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    try {
      localStorage.setItem("lang", lng);
      localStorage.setItem("dir", isRtl ? "rtl" : "ltr");
    } catch {}

    // compute target path with same route key
    const detected = detectRouteKey(location.pathname, currentLang);
    const next = buildPathForLang(lng, detected, location.pathname);
    navigate(next, { replace: false, state: { _langSwitched: true } });
    setOpen(false);
  };

  // Restore dir on mount
  useEffect(() => {
    const savedDir = localStorage.getItem("dir");
    if (savedDir) document.documentElement.dir = savedDir;
  }, []);

  // Close on outside click / ESC
  useEffect(() => {
    const onDoc = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const triggerBase =
    "inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c94c]/70 hover:bg-white/10";
  const size = compact ? "h-10 w-10 p-0" : "px-2 py-2";
  const triggerClass = `${triggerBase} ${size} ${className}`;
  const side =
    placement === "left"
      ? "left-0 origin-top-left"
      : "right-0 origin-top-right";

  return (
    <div className={`relative ${wrapperClassName}`}>
      <button
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
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
              {currentData.flag}
            </span>
            <span>{currentData.label}</span>
          </span>
        )}
      </button>

      <div
        ref={dropdownRef}
        className={`absolute ${side} top-full mt-1 w-48 max-h-96 overflow-y-auto rounded-md border border-white/10 bg-[#0e1a2e] text-white shadow-xl z-[10030] ${
          open ? "block" : "hidden"
        }`}
        role="menu"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
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
