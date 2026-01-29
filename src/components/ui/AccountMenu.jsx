// src/components/AccountMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getLocalizedPath } from "../../utils/getLocalizedPath";
import { getDisplayName } from "../../utils/displayName";
import { User } from "lucide-react";

export default function AccountMenu({ user, onLogout }) {
  const { t } = useTranslation(["header", "auth"]);
  const lang = (i18n.language || "en").slice(0, 2);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  const rawLabel = getDisplayName(user);
  const headerTitle =
    !user || rawLabel === "Account"
      ? t("account", { ns: "auth", defaultValue: "Account" })
      : rawLabel;

  useEffect(() => {
    const onDown = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);
  useEffect(() => setOpen(false), [location.pathname, lang]);

  const item =
    "block px-4 py-2 text-sm rounded-md transition-colors hover:bg-gray-50 text-gray-900 dark:text-white dark:hover:bg-white/10";
  const box =
    "absolute right-0 mt-2 w-56 rounded-lg border shadow-lg bg-white text-gray-900 border-gray-200 dark:bg-[#0e1a2e] dark:text-white dark:border-white/10 z-[10030]";
  const header =
    "px-4 py-2 text-sm font-semibold rounded-t-lg bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white/90";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("account", { ns: "auth", defaultValue: "Account" })}
        title={t("account", { ns: "auth", defaultValue: "Account" })}
      >
        <User className="w-5 h-5" />
      </button>

      <div className={`${box} ${open ? "block" : "hidden"}`} role="menu">
        <div className={header}>{headerTitle}</div>

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
              to={getLocalizedPath("profile", lang)}
              className={item}
              role="menuitem"
            >
              {t("profile", { ns: "auth", defaultValue: "Profile" })}
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
