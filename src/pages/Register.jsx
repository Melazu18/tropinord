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

  // ✅ Golden palette input styling (iOS Safari-safe)
  const inputClass =
    "w-full rounded border border-slate-300 px-3 py-2 " +
    "bg-white text-amber-700 placeholder:text-amber-600/70 " +
    "dark:border-slate-700 dark:bg-gray-800 dark:text-[#f2c94c] dark:placeholder:text-yellow-200/60 " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 " +
    "[&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_white_inset] " +
    "dark:[&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_#1f2937_inset] " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:rgb(180,83,9)] " +
    "dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f2c94c]";

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
          <label
            className="block text-sm font-medium mb-1 text-amber-800 dark:text-[#f2c94c]"
            htmlFor="name"
          >
            {t("name")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="name"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1 text-amber-800 dark:text-[#f2c94c]"
            htmlFor="email"
          >
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1 text-amber-800 dark:text-[#f2c94c]"
            htmlFor="password"
          >
            {t("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
              autoComplete="new-password"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute inset-y-0 right-2 flex items-center text-amber-700 hover:text-amber-900 dark:text-[#f2c94c]"
              aria-label={
                showPwd
                  ? t("hide", { defaultValue: "Hide" })
                  : t("show", { defaultValue: "Show" })
              }
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-amber-700/80 dark:text-yellow-200/70">
            {t("passwordHint", {
              defaultValue: "At least 8 characters.",
            })}
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1 text-amber-800 dark:text-[#f2c94c]"
            htmlFor="confirm"
          >
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`${inputClass} pr-10 ${
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
              className="absolute inset-y-0 right-2 flex items-center text-amber-700 hover:text-amber-900 dark:text-[#f2c94c]"
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
          {busy ? t("working", { defaultValue: "Working..." }) : t("createAccount")}
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
