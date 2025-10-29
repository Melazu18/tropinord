// src/components/AccountMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import { getDisplayName } from "../utils/displayName"; // ✅ correct relative path

export default function AccountMenu({ user, onLogout }) {
  const { t } = useTranslation(["header", "auth"]);
  const lang = (i18n.language || "en").slice(0, 2);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Compute the label once per render
  const label = getDisplayName(user); // handle → masked email → "Account"

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // close on route change / language change
  useEffect(() => setOpen(false), [location.pathname, lang]);

  const item =
    "block px-4 py-2 text-sm rounded-md transition-colors " +
    "hover:bg-gray-50 text-gray-900 " + // light mode
    "dark:text-white dark:hover:bg-white/10"; // dark mode

  const box =
    "absolute right-0 mt-2 w-56 rounded-lg border shadow-lg " +
    "bg-white text-gray-900 border-gray-200 " + // light
    "dark:bg-[#0e1a2e] dark:text-white dark:border-white/10 z-[10030]"; // dark

  const header =
    "px-4 py-2 text-sm font-semibold rounded-t-lg " +
    "bg-gray-100 text-gray-800 " + // light
    "dark:bg-white/10 dark:text-white/90"; // dark

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-10 px-3 rounded-md hover:bg-white/10"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {/* Avatar (initial) */}
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 overflow-hidden">
          <span className="text-xs font-bold">
            {(label?.[0] || "A").toUpperCase()}
          </span>
        </span>
        <span className="hidden sm:inline">{label}</span>
      </button>

      {/* Dropdown */}
      <div className={`${box} ${open ? "block" : "hidden"}`} role="menu">
        <div className={header}>{label}</div>

        {!user ? (
          <div className="p-2">
            <Link
              to={getLocalizedPath("login", lang)}
              className={item}
              role="menuitem"
            >
              {t("login", { ns: "auth", defaultValue: "Log in" })}
            </Link>
            <Link
              to={getLocalizedPath("register", lang)}
              className={item}
              role="menuitem"
            >
              {t("registerTitle", { ns: "auth", defaultValue: "Register" })}
            </Link>
          </div>
        ) : (
          <div className="p-2">
            <Link
              to={getLocalizedPath("dashboard", lang)}
              className={item}
              role="menuitem"
            >
              {t("dashboard", { ns: "header", defaultValue: "Dashboard" })}
            </Link>
            <Link
              to={getLocalizedPath("orderHistory", lang)}
              className={item}
              role="menuitem"
            >
              {t("orderHistory", {
                ns: "header",
                defaultValue: "Order history",
              })}
            </Link>
            {user.role === "ADMIN" && (
              <Link
                to={getLocalizedPath("admin", lang)}
                className={item}
                role="menuitem"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className={`${item} w-full text-left`}
              role="menuitem"
            >
              {t("logout", { ns: "auth", defaultValue: "Log out" })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
