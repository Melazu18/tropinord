// src/pages/ResetPassword.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { t } = useTranslation("auth");
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get("token") || "",
    []
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (!token) {
      setStatus({
        type: "error",
        msg: t("reset.missingToken", { defaultValue: "Missing token." }),
      });
      return;
    }
    if (newPassword.length < 8) {
      setStatus({
        type: "error",
        msg: t("reset.minLength", {
          defaultValue: "Password must be at least 8 characters.",
        }),
      });
      return;
    }
    if (newPassword !== confirm) {
      setStatus({
        type: "error",
        msg: t("reset.mismatch", { defaultValue: "Passwords do not match." }),
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, newPassword }),
      });
      if (res.ok) {
        setStatus({
          type: "success",
          msg: t("reset.success", {
            defaultValue: "Password updated. You can now log in.",
          }),
        });
        setNewPassword("");
        setConfirm("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus({
          type: "error",
          msg:
            data?.error === "Invalid or expired token"
              ? t("reset.invalidOrExpired", {
                  defaultValue: "Invalid or expired token.",
                })
              : t("errors.tryAgain", { defaultValue: "Please try again." }),
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
          {t("reset.title", { defaultValue: "Reset your password" })}
        </h1>
        {!token && (
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            {t("reset.missingToken", { defaultValue: "Missing token." })}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <label htmlFor="newPassword" className="block text-sm font-medium">
            {t("fields.newPassword", { defaultValue: "New password" })}
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label htmlFor="confirm" className="block text-sm font-medium">
            {t("fields.confirmPassword", { defaultValue: "Confirm password" })}
          </label>
          <input
            id="confirm"
            type="password"
            required
            minLength={8}
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            type="submit"
            disabled={submitting || !token}
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {submitting
              ? t("reset.updating", { defaultValue: "Updating..." })
              : t("reset.updatePassword", {
                  defaultValue: "Update password",
                })}
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
