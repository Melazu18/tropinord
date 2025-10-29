// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import i18n from "i18next";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../utils/api";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { t } = useTranslation(["auth", "buttons"]);
  const lang = i18n.language || "en";
  const navigate = useNavigate();
  const location = useLocation();

  // get auth helpers + current user
  const { user, loading, setUser, refreshUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  // compute next destination from query/state
  const params = new URLSearchParams(location.search);
  const nextQP = params.get("next");
  const fromState = location.state?.from;
  const fromStateFull = fromState
    ? `${fromState.pathname || ""}${fromState.search || ""}${
        fromState.hash || ""
      }`
    : null;
  const initialRedirect = nextQP || fromStateFull || null;

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function fetchCurrentUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
        headers: { "Accept-Language": lang },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  function chooseDefaultDestination(u) {
    // Admins → Admin area
    if (user?.role === "ADMIN") return getLocalizedPath("admin", lang);
    // Approved sellers → Dashboard
    if (user?.sellerProfile?.status === "APPROVED") {
      return getLocalizedPath("dashboard", lang);
    }
    // Everyone else → Home (NOT the apply page)
    return getLocalizedPath("home", lang);
  }

  // If user is already authenticated, leave the login page automatically
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    const dest = initialRedirect || chooseDefaultDestination(user);
    navigate(dest, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, initialRedirect]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": lang,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed");

      // 1) Hydrate auth immediately (avoid the post-login 401 race)
      if (data?.user) setUser?.(data.user);

      // 2) Decide destination using the best user we have
      let userForRouting = data?.user;
      if (!userForRouting) {
        userForRouting = await fetchCurrentUser();
        if (userForRouting) setUser?.(userForRouting);
      }

      const dest = initialRedirect || chooseDefaultDestination(userForRouting);
      navigate(dest, { replace: true });

      // 3) Background refresh to fully sync context (doesn't block nav)
      setTimeout(() => refreshUser?.({ silent: true }), 0);
    } catch (err) {
      setMsg(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-bold mb-6">
        {t("auth:loginTitle", { defaultValue: "Sign in" })}
      </h1>

      {msg && (
        <div className="mb-4 text-sm text-yellow-800 bg-yellow-100 p-3 rounded">
          {msg}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("auth:email", { defaultValue: "Email" })}
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("auth:password", { defaultValue: "Password" })}
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              className="w-full border rounded px-3 py-2 pr-10 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300"
              aria-label={
                showPwd
                  ? t("auth:hide", { defaultValue: "Hide" })
                  : t("auth:show", { defaultValue: "Show" })
              }
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          disabled={busy}
          className="w-full rounded bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 disabled:opacity-60"
        >
          {busy
            ? t("buttons:pleaseWait", { defaultValue: "Please wait…" })
            : t("auth:login", { defaultValue: "Login" })}
        </button>

        <div className="flex items-center justify-between text-sm mt-2">
          <Link
            to={getLocalizedPath("forgotPassword", lang)}
            className="text-green-700 dark:text-green-300 hover:underline"
          >
            {t("auth:links.forgotPassword", {
              defaultValue: "Forgot password?",
            })}
          </Link>

          <span className="text-gray-600 dark:text-gray-300">
            {t("auth:noAccount", { defaultValue: "No account?" })}{" "}
            <Link
              to={getLocalizedPath("register", lang)}
              className="text-green-700 dark:text-green-300 hover:underline"
            >
              {t("auth:createAccount", { defaultValue: "Create account" })}
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
