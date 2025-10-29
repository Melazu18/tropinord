import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../utils/api";

export default function ChangePasswordCard() {
  const { t } = useTranslation(["auth"]);
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (newPassword !== confirm) {
      setErr(t("errors.passwordsDontMatch"));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.error === "wrong_current_password") {
          throw new Error(
            t("errors.wrongCurrentPassword", {
              defaultValue: "Current password is not correct.",
            })
          );
        }
        throw new Error(
          data?.error ||
            t("errors.generic", { defaultValue: "Something went wrong." })
        );
      }
      setMsg(
        t("messages.passwordChanged", {
          defaultValue: "Password changed. Please log in again.",
        })
      );
      setCurrent("");
      setNew("");
      setConfirm("");
      // optional: redirect to login after a short pause
      setTimeout(() => (window.location.href = "/login"), 1200);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const Field = ({
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
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full border rounded px-3 py-2 pr-10 dark:bg-gray-800 dark:text-white"
          minLength={8}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500"
          aria-label={
            show
              ? t("hidePassword", { defaultValue: "Hide password" })
              : t("showPassword", { defaultValue: "Show password" })
          }
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">
        {t("changePasswordTitle", { defaultValue: "Change password" })}
      </h2>

      {msg && (
        <div className="mb-3 rounded border border-green-300 bg-green-50 text-green-800 px-3 py-2">
          {msg}
        </div>
      )}
      {err && (
        <div className="mb-3 rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label={t("currentPassword", { defaultValue: "Current password" })}
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          show={showCur}
          setShow={setShowCur}
          autoComplete="current-password"
        />
        <Field
          label={t("newPassword", { defaultValue: "New password" })}
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          show={showNew}
          setShow={setShowNew}
          autoComplete="new-password"
        />
        <Field
          label={t("confirmNewPassword", {
            defaultValue: "Confirm new password",
          })}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          show={showConf}
          setShow={setShowConf}
          autoComplete="new-password"
        />

        <button
          disabled={busy}
          className="inline-flex items-center justify-center rounded bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 disabled:opacity-60"
        >
          {busy
            ? t("working", { defaultValue: "Working..." })
            : t("save", { defaultValue: "Save" })}
        </button>
      </form>
    </div>
  );
}
