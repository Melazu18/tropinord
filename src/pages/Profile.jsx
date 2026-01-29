import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";
import { API_BASE } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { getLocalizedPath } from "../utils/getLocalizedPath";

export default function Profile() {
  const navigate = useNavigate();
  const lang = (i18n.language || "en").slice(0, 2);
  const { user, setUser, logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    handle: "",
    phone: "",
    address: "",
    dob: "",
    sex: "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState(null);

  // Load profile data
  useEffect(() => {
    const load = async () => {
      try {
        // if your /api/users/me already returns everything, use that instead
        const r = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        const data = await r.json();
        if (!data?.ok) throw new Error(data?.error || "failed");

        const u = data.user;
        setForm({
          name: u?.name || "",
          handle: u?.handle || "",
          phone: u?.phone || "",
          address: u?.address || "",
          dob: u?.dob ? String(u.dob).slice(0, 10) : "",
          sex: u?.sex || "",
        });
      } catch (e) {
        // if unauthenticated, send to login
        navigate(getLocalizedPath("login", lang));
      }
    };

    load();
  }, [navigate, lang]);

  const onChange = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const r = await fetch(`${API_BASE}/users/me/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          handle: form.handle || null,
          phone: form.phone || null,
          address: form.address || null,
          dob: form.dob || null,
          sex: form.sex || null,
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "save_failed");

      setMsg("Saved ✅");

      // Optional: update auth context user (if you store name/handle)
      if (typeof setUser === "function" && data?.user) {
        setUser((prev) => ({ ...(prev || {}), ...data.user }));
      }
    } catch (e) {
      setMsg(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const ok = window.confirm(
      "Are you sure? This will deactivate your account."
    );
    if (!ok) return;

    setDeleting(true);
    setMsg(null);

    try {
      const r = await fetch(`${API_BASE}/users/me`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "delete_failed");

      // clear local session
      if (typeof logout === "function") await logout();
      else if (typeof setUser === "function") setUser(null);

      navigate(getLocalizedPath("home", lang));
    } catch (e) {
      setMsg(`Delete failed: ${e.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {msg && (
        <div className="mb-4 text-sm p-3 rounded border border-slate-200 dark:border-slate-700">
          {msg}
        </div>
      )}

      <div className="space-y-4">
        <label className="block">
          <div className="text-sm mb-1">Name</div>
          <input
            value={form.name}
            onChange={onChange("name")}
            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Handle</div>
          <input
            value={form.handle}
            onChange={onChange("handle")}
            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Phone</div>
          <input
            value={form.phone}
            onChange={onChange("phone")}
            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Address</div>
          <input
            value={form.address}
            onChange={onChange("address")}
            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Date of birth</div>
          <input
            type="date"
            value={form.dob}
            onChange={onChange("dob")}
            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Sex</div>
          <select
            value={form.sex}
            onChange={onChange("sex")}
            className="w-full h-10 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <option value="">—</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <button
          onClick={save}
          disabled={saving}
          className="w-full h-11 rounded-md bg-green-700 text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={deleteAccount}
            disabled={deleting}
            className="w-full h-11 rounded-md bg-red-600 text-white font-semibold disabled:opacity-60"
          >
            {deleting ? "Deactivating..." : "Deactivate account"}
          </button>
          <p className="text-xs mt-2 opacity-80">
            This will deactivate your account. You can contact support to restore it.
          </p>
        </div>
      </div>
    </div>
  );
}
