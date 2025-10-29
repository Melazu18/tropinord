// src/pages/RequestPasswordReset.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RequestPasswordReset() {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      // Always returns 200 (to avoid email enumeration)
      if (res.ok) {
        setStatus({
          type: "success",
          msg: t("reset.requestSent", {
            defaultValue: "If that email exists, we sent a reset link.",
          }),
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          msg: t("errors.tryAgain", { defaultValue: "Please try again." }),
        });
      }
    } catch {
      setStatus({
        type: "error",
        msg: t("errors.network", { defaultValue: "Network error." }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("reset.forgotTitle", { defaultValue: "Forgot your password?" })}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t("reset.forgotSubtitle", {
            defaultValue:
              "Enter your email and we’ll send you a link to reset your password.",
          })}
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <label htmlFor="email" className="block text-sm font-medium">
            {t("fields.email", { defaultValue: "Email" })}
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {submitting
              ? t("reset.sending", { defaultValue: "Sending..." })
              : t("reset.sendLink", { defaultValue: "Send reset link" })}
          </button>

          {status.msg && (
            <p
              className={`text-sm mt-2 ${
                status.type === "success"
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-600 dark:text-red-300"
              }`}
            >
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
