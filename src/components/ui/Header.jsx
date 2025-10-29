// src/components/ui/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "../../contexts/CartContext";
import { getLocalizedPath } from "../../utils/getLocalizedPath";
import i18n from "i18next";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE } from "../../utils/api";
import AccountMenu from "./AccountMenu.jsx";

const BASE_URL = import.meta.env?.BASE_URL || "/";
const withBase = (p) =>
  (BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL) +
  (p.startsWith("/") ? p : "/" + p);

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [originOpen, setOriginOpen] = useState(false);
  const lastScrollY = useRef(0);

  const { t } = useTranslation(["header", "auth"]);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = i18n.language || "en";
  const { user, logout: ctxLogout, setUser } = useAuth();

  const isActive = (path) => location.pathname === path;
  const homePath = getLocalizedPath("home", lang);

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

      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min((y / (total || 1)) * 100, 100));
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
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        if (typeof setUser === "function") setUser(null);
      }
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      navigate(getLocalizedPath("home", lang));
    }
  };

  const getScrollColor = (p) =>
    p < 25
      ? "bg-amber-500"
      : p < 50
      ? "bg-yellow-500"
      : p < 75
      ? "bg-green-500"
      : "bg-emerald-600";

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-[10000] transition-transform duration-300 ${
          hideHeader ? "-translate-y-full" : "translate-y-0"
        } bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-b border-slate-200/70 dark:border-slate-700/70`}
        style={{ minHeight: "4.75rem" }}
      >
        {/* scroll indicator */}
        <div
          className={`absolute top-0 left-0 h-1 ${getScrollColor(
            scrollProgress
          )} transition-all`}
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="w-full px-3 sm:px-6 py-2">
          {/* 3-column layout; center column for the logo */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* LEFT — primary nav (desktop) */}
            <nav className="hidden md:flex items-center gap-4">
              {/* About */}
              <Link
                to={getLocalizedPath("about", lang)}
                aria-current={
                  isActive(getLocalizedPath("about", lang)) ? "page" : undefined
                }
                className={`text-sm font-semibold px-3 py-2 rounded-md leading-none ${
                  isActive(getLocalizedPath("about", lang))
                    ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-green-700 dark:hover:text-green-400"
                }`}
              >
                {t("nav.about", { defaultValue: "About" })}
              </Link>

              {/* FAQ */}
              <Link
                to={getLocalizedPath("faq", lang)}
                aria-current={
                  isActive(getLocalizedPath("faq", lang)) ? "page" : undefined
                }
                className={`text-sm font-semibold px-3 py-2 rounded-md leading-none ${
                  isActive(getLocalizedPath("faq", lang))
                    ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-green-700 dark:hover:text-green-400"
                }`}
              >
                {t("nav.faq", { defaultValue: "FAQ" })}
              </Link>

              {/* The Origin (dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setOriginOpen(true)}
                onMouseLeave={() => setOriginOpen(false)}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={originOpen}
                  onClick={() => setOriginOpen((v) => !v)}
                  className={`text-sm font-semibold px-3 py-2 rounded-md leading-none inline-flex items-center gap-1 ${
                    originOpen ||
                    isActive(originPath("tea")) ||
                    isActive(originPath("oils"))
                      ? "bg-slate-100 dark:bg-slate-800 text-green-700 dark:text-green-400"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-green-700 dark:hover:text-green-400"
                  }`}
                >
                  {t("nav.origin", { defaultValue: "The Origin" })}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {originOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md overflow-hidden z-[10020]"
                  >
                    <Link
                      to={originPath("tea")}
                      className="block px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      role="menuitem"
                    >
                      {t("nav.tea", { defaultValue: "Tea" })}
                    </Link>
                    <Link
                      to={originPath("oils")}
                      className="block px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      role="menuitem"
                    >
                      {t("nav.oil", { defaultValue: "Oils" })}
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* CENTER — brand (bigger & centered, tagline under logo) */}
            <div className="flex flex-col items-center justify-center min-w-0">
              <Link to={homePath} className="flex items-center">
                <img
                  src={withBase("/images/tropinordlogoPreview.png")}
                  alt={t("logo.alt", { defaultValue: "TropiNord Logo" })}
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain"
                  onError={(e) => (e.currentTarget.src = withBase("/logo.svg"))}
                />
              </Link>
              <span className="mt-1 text-sm sm:text-base font-semibold text-[#f2c94c]">
                {t("tagline", {
                  defaultValue: "Tropical Origins. Global Harmony.",
                })}
              </span>
            </div>

            {/* RIGHT — utilities */}
            <div className="flex items-center justify-end gap-1 sm:gap-2">
              {/* Cart */}
              <Link
                to={getLocalizedPath("cart", lang)}
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                aria-label={t("nav.cart", { defaultValue: "Cart" })}
                title={t("nav.cart", { defaultValue: "Cart" })}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account dropdown */}
              <AccountMenu user={user} onLogout={handleLogout} />

              {/* Language & Theme — visible in both light & dark modes */}
              <div className="inline-flex items-center gap-2">
                <LanguageSwitcher
                  compact
                  placement="left"
                  className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <ThemeToggle />
              </div>

              {/* Mobile burger */}
              <button
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                aria-label={
                  drawerOpen
                    ? t("menu.closeAriaLabel")
                    : t("menu.openAriaLabel")
                }
                aria-expanded={drawerOpen}
                aria-controls="mobile-menu"
                onClick={() => setDrawerOpen((v) => !v)}
              >
                {drawerOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* bottom hairline */}
        <div className="border-t border-slate-200/70 dark:border-slate-700/70" />
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
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
              className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("nav.about", { defaultValue: "About" })}
            </Link>

            {/* FAQ */}
            <Link
              to={getLocalizedPath("faq", lang)}
              onClick={() => setDrawerOpen(false)}
              className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("nav.faq", { defaultValue: "FAQ" })}
            </Link>

            {/* The Origin group */}
            <div className="mt-2">
              <p className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("nav.origin", { defaultValue: "The Origin" })}
              </p>
              <Link
                to={originPath("tea")}
                onClick={() => setDrawerOpen(false)}
                className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t("nav.tea", { defaultValue: "Tea" })}
              </Link>
              <Link
                to={originPath("oils")}
                onClick={() => setDrawerOpen(false)}
                className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t("nav.oil", { defaultValue: "Oils" })}
              </Link>
            </div>

            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
              {!user ? (
                <>
                  <Link
                    to={getLocalizedPath("login", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full h-10 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-center leading-10"
                  >
                    {t("login", { ns: "auth", defaultValue: "Sign in" })}
                  </Link>
                  <Link
                    to={getLocalizedPath("register", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full h-10 px-3 rounded-md bg-[#d97a0b] hover:bg-[#c16c09] text-white text-sm font-semibold text-center leading-10"
                  >
                    {t("registerTitle", {
                      ns: "auth",
                      defaultValue: "Create account",
                    })}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={getLocalizedPath("dashboard", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full h-10 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-center leading-10"
                  >
                    {t("nav.dashboard", { defaultValue: "Dashboard" })}
                  </Link>
                  <Link
                    to={getLocalizedPath("orderHistory", lang)}
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full h-10 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-center leading-10"
                  >
                    {t("nav.orderHistory", { defaultValue: "Order history" })}
                  </Link>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                    className="block w-full h-10 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-center leading-10"
                  >
                    {t("logout", { ns: "auth", defaultValue: "Log out" })}
                  </button>
                </>
              )}
            </div>

            {/* Language + Theme in drawer for quick access */}
            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4 flex items-center gap-2">
              <LanguageSwitcher
                compact
                className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              />
              <ThemeToggle />
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}
