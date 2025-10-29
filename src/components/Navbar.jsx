// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import { useAuth } from "../contexts/AuthContext";

const langPieces = {
  en: { origin: "origin", tea: "tea", oils: "oils" },
  sv: { origin: "ursprung", tea: "te", oils: "oljor" },
  fr: { origin: "origine", tea: "the", oils: "huiles" },
  es: { origin: "origen", tea: "te", oils: "aceites" },
};

// Fallback builder if a routeMap key isn't present yet
function buildOriginPath(lang, kind) {
  const l = (lang || "en").slice(0, 2);
  const p = langPieces[l] || langPieces.en;
  return `/${l}/${p.origin}/${kind === "tea" ? p.tea : p.oils}`;
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [originOpen, setOriginOpen] = useState(false);
  const originRef = useRef(null);

  // Close dropdown on outside click / ESC
  useEffect(() => {
    const onDown = (e) => {
      if (originRef.current && !originRef.current.contains(e.target)) {
        setOriginOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setOriginOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Safe getters for all paths
  const homePath = getLocalizedPath("home", lang);
  const aboutPath = getLocalizedPath("about", lang);
  const faqPath = getLocalizedPath("faq", lang);
  const cartPath = getLocalizedPath("cart", lang);
  const loginPath = getLocalizedPath("login", lang);
  const dashPath = getLocalizedPath("dashboard", lang);
  const ordersPath = getLocalizedPath("orderHistory", lang);
  const adminPath = getLocalizedPath("admin", lang);

  // Try routeMap first; fallback to language-aware /:lang/:origin/:kind
  const originTeaPath =
    getLocalizedPath("originTea", lang) || buildOriginPath(lang, "tea");
  const originOilsPath =
    getLocalizedPath("originOils", lang) || buildOriginPath(lang, "oils");

  return (
    <nav className="relative flex items-center gap-6">
      {/* Home */}
      <Link to={homePath}>{t("nav.home", { defaultValue: "Home" })}</Link>

      {/* About */}
      <Link to={aboutPath}>{t("nav.about", { defaultValue: "About" })}</Link>

      {/* The Origin (dropdown with Tea & Oils) */}
      <div className="relative" ref={originRef}>
        <button
          type="button"
          onClick={() => setOriginOpen((v) => !v)}
          className="inline-flex items-center gap-1 hover:scale-105 transition-transform"
          aria-haspopup="menu"
          aria-expanded={originOpen}
          aria-controls="origin-menu"
        >
          {t("nav.origin", { defaultValue: "The Origin" })}
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>

        <div
          id="origin-menu"
          className={`absolute mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow z-50 border border-gray-200 dark:border-gray-700 ${
            originOpen ? "block" : "hidden"
          }`}
          role="menu"
        >
          <Link
            to={originTeaPath}
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOriginOpen(false)}
          >
            {t("nav.tea", { defaultValue: "Tea" })}
          </Link>
          <Link
            to={originOilsPath}
            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOriginOpen(false)}
          >
            {t("nav.oil", { defaultValue: "Oils" })}
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <Link to={faqPath}>{t("nav.faq", { defaultValue: "FAQ" })}</Link>

      {/* Cart */}
      <Link to={cartPath} className="ml-auto">
        {t("nav.cart", { defaultValue: "Cart" })}
      </Link>

      {/* Account / Admin */}
      {!user ? (
        <Link to={loginPath}>
          {t("nav.login", { defaultValue: "Account" })}
        </Link>
      ) : (
        <>
          <Link to={dashPath}>
            {t("nav.dashboard", { defaultValue: "Dashboard" })}
          </Link>
          <Link to={ordersPath}>
            {t("nav.orderHistory", { defaultValue: "Order history" })}
          </Link>
          {isAdmin && (
            <Link to={adminPath} className="text-amber-700 dark:text-amber-300">
              {t("nav.admin", { defaultValue: "Admin" })}
            </Link>
          )}
        </>
      )}
    </nav>
  );
}
