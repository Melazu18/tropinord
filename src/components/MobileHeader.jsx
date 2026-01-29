// src/components/MobileHeader.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import LanguageSwitcher from "./ui/LanguageSwitcher";
import ThemeToggle from "./ui/ThemeToggle";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { getDisplayName } from "../utils/displayName";
import i18n from "i18next";
import PressIcon from "../components/icons/PressIcon";

const BASE_URL = import.meta.env?.BASE_URL || "/";
const withBase = (p) =>
  (BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL) +
  (p.startsWith("/") ? p : "/" + p);

export default function MobileHeader() {
  const { t } = useTranslation(["header", "auth"]);
  const lang = (i18n.language || "en").slice(0, 2);
  const location = useLocation();

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [originOpen, setOriginOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);

  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const { user, logout: ctxLogout, setUser } = useAuth();
  const homePath = getLocalizedPath("home", lang);

  const isActive = (path) => location.pathname === path;

  // Map "Origin" items to proper localized routes
  const originPath = (which) =>
    which === "tea"
      ? getLocalizedPath("originTea", lang)
      : getLocalizedPath("originOils", lang);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHideHeader(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = drawerOpen ? "hidden" : prev || "";
    return () => (document.body.style.overflow = prev || "");
  }, [drawerOpen]);

  const handleLogout = async () => {
    try {
      if (typeof ctxLogout === "function") {
        await ctxLogout();
      } else {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (typeof setUser === "function") setUser(null);
      }
    } finally {
      setDrawerOpen(false);
      navigate(getLocalizedPath("home", lang));
    }
  };

  // ✅ NEW: correct account click behavior (no functionality change elsewhere)
  const handleAccountClick = () => {
    const target = user
      ? getLocalizedPath("dashboard", lang)
      : getLocalizedPath("login", lang);
    navigate(target);
  };

  return (
    <>
      {/* Mobile Header - Two Section Layout */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-[10000] transition-transform duration-300 ${
          hideHeader ? "-translate-y-full" : "translate-y-0"
        } bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-b border-slate-200/70 dark:border-slate-700/70`}
      >
        {/* Section 1: Logo and Tagline */}
        <div className="flex justify-center items-center py-3 px-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <Link
            to={homePath}
            className="flex flex-col items-center"
            aria-label={t("brand", {
              ns: "header",
              defaultValue: "TropiNord",
            })}
          >
            <img
              src={withBase("/images/tropiLogo004.png")}
              alt={t("logo.alt", { defaultValue: "TropiNord Logo" })}
              className="h-14 w-auto object-contain"
              onError={(e) => (e.currentTarget.src = withBase("/logo.svg"))}
            />
            <span className="mt-1 text-sm font-semibold text-[#f2c94c]">
              {t("tagline", {
                defaultValue: "Tropical Origins. Global Harmony.",
              })}
            </span>
          </Link>
        </div>

        {/* Section 2: Navigation and Utilities */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 px-4">
          {/* LEFT - Language & Theme */}
          <div className="flex items-center gap-2 justify-start">
            <LanguageSwitcher
              compact
              placement="left"
              className="h-10 w-10 rounded-md border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            />
            <ThemeToggle
              iconOnly
              className="w-10 h-10 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* CENTER - Empty for balance */}
          <div className="flex justify-center">{/* Empty center */}</div>

          {/* RIGHT - Cart, Account & Menu */}
          <div className="flex items-center gap-2 justify-end">
            {/* Cart */}
            <Link
              to={getLocalizedPath("cart", lang)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              aria-label={t("nav.cart", { defaultValue: "Cart" })}
              title={t("nav.cart", { defaultValue: "Cart" })}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ✅ Account icon now navigates properly */}
            <div className="relative">
              <button
                type="button"
                onClick={handleAccountClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                aria-label={t("nav.account", {
                  ns: "auth",
                  defaultValue: "Account",
                })}
                title={t("nav.account", {
                  ns: "auth",
                  defaultValue: "Account",
                })}
              >
                <User className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Burger */}
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              aria-label={
                drawerOpen ? t("menu.closeAriaLabel") : t("menu.openAriaLabel")
              }
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              {drawerOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        className={`fixed inset-0 z-[10040] md:hidden ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
        onClick={(e) => e.target === e.currentTarget && setDrawerOpen(false)}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl transition-transform ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <span className="text-sm font-semibold">
              {t("drawerTitle", { defaultValue: "Menu" })}
            </span>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label={t("menu.closeAriaLabel")}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {/* About */}
            <Link
              to={getLocalizedPath("about", lang)}
              onClick={() => setDrawerOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                isActive(getLocalizedPath("about", lang))
                  ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t("nav.about", { defaultValue: "About" })}
            </Link>

            {/* FAQ */}
            <Link
              to={getLocalizedPath("faq", lang)}
              onClick={() => setDrawerOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                isActive(getLocalizedPath("faq", lang))
                  ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t("nav.faq", { defaultValue: "FAQ" })}
            </Link>

            {/* The Origin with dropdown */}
            <div className="mt-2">
              <button
                onClick={() => setOriginOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium ${
                  originOpen ||
                  isActive(originPath("tea")) ||
                  isActive(originPath("oils"))
                    ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{t("nav.origin", { defaultValue: "The Origin" })}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    originOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {originOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700">
                  <Link
                    to={originPath("tea")}
                    onClick={() => setDrawerOpen(false)}
                    className={`block px-3 py-2 rounded text-sm ${
                      isActive(originPath("tea"))
                        ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {t("nav.tea", { defaultValue: "Tea" })}
                  </Link>
                  <Link
                    to={originPath("oils")}
                    onClick={() => setDrawerOpen(false)}
                    className={`block px-3 py-2 rounded text-sm ${
                      isActive(originPath("oils"))
                        ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {t("nav.oil", { defaultValue: "Oils" })}
                  </Link>
                </div>
              )}
            </div>

            {/* Additional navigation links */}
            <Link
              to={getLocalizedPath("contact", lang)}
              onClick={() => setDrawerOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                isActive(getLocalizedPath("contact", lang))
                  ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {t("nav.contact", { defaultValue: "Contact" })}
            </Link>

            {/* Account Section */}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
              {!user ? (
                <>
                  <Link
                    to={getLocalizedPath("login", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full px-3 py-2 rounded text-sm font-medium text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {t("login", { ns: "auth", defaultValue: "Sign in" })}
                  </Link>
                  <Link
                    to={getLocalizedPath("register", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full px-3 py-2 rounded text-sm font-medium text-center bg-[#d97a0b] hover:bg-[#c16c09] text-white"
                  >
                    {t("registerTitle", {
                      ns: "auth",
                      defaultValue: "Create account",
                    })}
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    {t("signedInAs", { defaultValue: "Signed in as" })}{" "}
                    <strong>{getDisplayName(user)}</strong>
                  </div>
                  <Link
                    to={getLocalizedPath("dashboard", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block px-3 py-2 rounded text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t("nav.dashboard", { defaultValue: "Dashboard" })}
                  </Link>
                  <Link
                    to={getLocalizedPath("orderHistory", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block px-3 py-2 rounded text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t("nav.orderHistory", { defaultValue: "Order history" })}
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      to={getLocalizedPath("admin", lang)}
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-2 rounded text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t("logout", { ns: "auth", defaultValue: "Log out" })}
                  </button>
                </>
              )}
            </div>

            {/* Language + Theme in drawer */}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("preferences", { defaultValue: "Preferences" })}
              </p>
              <div className="flex items-center gap-2 px-3">
                <LanguageSwitcher
                  compact
                  className="flex-1 h-10 px-3 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                />
                <ThemeToggle className="h-10 w-10 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" />
              </div>
            </div>
          </nav>
        </aside>
      </div>

     
    </>
  );
}
