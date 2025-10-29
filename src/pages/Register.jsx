// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { API_BASE } from "../utils/api";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { t } = useTranslation("auth");
  const lang = i18n.language || "en";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (password !== confirm) {
      setErr(t("errors.passwordsDontMatch"));
      return;
    }

    setBusy(true);
    try {
      // reCAPTCHA is optional — backend tolerates missing token.
      let recaptchaToken = null;
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

      if (siteKey && window.grecaptcha?.execute) {
        try {
          recaptchaToken = await window.grecaptcha.execute(siteKey, {
            action: "register",
          });
        } catch {
          // Ignore token errors silently; backend will still accept the request
        }
      }

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": lang,
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, recaptchaToken }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // no body or non-JSON
      }

      if (res.status === 409) {
        throw new Error(
          t("errors.emailInUse", {
            defaultValue: "Email already in use. Try logging in.",
          })
        );
      }

      if (!res.ok || data?.ok === false) {
        const msg =
          (typeof data?.error === "string" && data.error) ||
          data?.error?.message ||
          t("errors.generic", { defaultValue: "Registration failed." });
        throw new Error(msg);
      }

      // Success: ask user to verify their email
      setMsg(t("messages.checkEmail"));
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="max-w-xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-semibold mb-6">
        {t("registerTitle", { defaultValue: "Create account" })}
      </h1>

      {msg && (
        <div
          className="mb-4 rounded border border-green-300 bg-green-50 text-green-800 px-4 py-2"
          role="status"
          aria-live="polite"
        >
          {msg}
        </div>
      )}
      {err && (
        <div
          className="mb-4 rounded border border-red-300 bg-red-50 text-red-700 px-4 py-2"
          role="alert"
          aria-live="assertive"
        >
          {err}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6 space-y-4"
        noValidate
      >
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            {t("name")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            {t("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              autoComplete="new-password"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300"
              aria-label={
                showPwd
                  ? t("hide", { defaultValue: "Hide" })
                  : t("show", { defaultValue: "Show" })
              }
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {t("passwordHint", {
              defaultValue: "At least 8 characters.",
            })}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="confirm">
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full rounded border px-3 py-2 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                passwordsMismatch ? "border-red-400" : ""
              }`}
              autoComplete="new-password"
              minLength={8}
              aria-invalid={passwordsMismatch ? "true" : "false"}
              aria-describedby={passwordsMismatch ? "pw-mismatch" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300"
              aria-label={
                showConfirm
                  ? t("hide", { defaultValue: "Hide" })
                  : t("show", { defaultValue: "Show" })
              }
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordsMismatch && (
            <p id="pw-mismatch" className="mt-1 text-xs text-red-600">
              {t("errors.passwordsDontMatch")}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 disabled:opacity-60"
        >
          {busy
            ? t("working", { defaultValue: "Working..." })
            : t("createAccount")}
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("haveAccount", { defaultValue: "Already have an account?" })}{" "}
          <Link
            to={getLocalizedPath("login", lang)}
            className="text-green-700 dark:text-green-300 font-medium hover:underline"
          >
            {t("login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
