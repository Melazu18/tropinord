// src/components/auth/ChangePasswordCard.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../../utils/api";

export default function ChangePasswordCard() {
  const { t } = useTranslation("auth");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (newPassword.length < 8) {
      setErr(t("reset.minLength"));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErr(t("reset.mismatch"));
      return;
    }

    try {
      setBusy(true);
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Map server error keys to translations if present
        const message =
          data?.error === "wrong_current_password"
            ? t("errors.wrongCurrentPassword")
            : t("errors.generic");
        throw new Error(message);
      }
      setMsg(t("messages.passwordChanged"));
      // Optionally clear inputs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      setErr(e.message || t("errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  const Input = ({
    label,
    type,
    value,
    onChange,
    show,
    setShow,
    autoComplete,
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10"
          required
          minLength={type === "password" ? 8 : undefined}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 dark:text-gray-300 hover:opacity-80"
          aria-label={show ? t("hidePassword") : t("showPassword")}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        {t("changePasswordTitle", { defaultValue: "Change password" })}
      </h2>

      {msg && (
        <div className="rounded border border-green-300 bg-green-50 text-green-800 px-4 py-2">
          {msg}
        </div>
      )}
      {err && (
        <div className="rounded border border-red-300 bg-red-50 text-red-700 px-4 py-2">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label={t("currentPassword")}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          show={showCur}
          setShow={setShowCur}
          autoComplete="current-password"
        />
        <Input
          label={t("newPassword")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          show={showNew}
          setShow={setShowNew}
          autoComplete="new-password"
        />
        <Input
          label={t("confirmNewPassword")}
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          show={showConf}
          setShow={setShowConf}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 disabled:opacity-60"
        >
          {busy ? t("working") : t("save")}
        </button>
      </form>
    </div>
  );
}
