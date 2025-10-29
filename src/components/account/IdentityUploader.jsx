// src/components/account/IdentityUploader.jsx
import React, { useRef, useState } from "react";
import { accountAPI } from "../../services/api";

export default function IdentityUploader({ compact = false }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const pick = () => ref.current?.click();

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setMsg("Please choose an image.");
    if (file.size > 5 * 1024 * 1024) return setMsg("Max 5 MB.");

    setBusy(true);
    setMsg("");
    try {
      await accountAPI.uploadIdentity(file);
      setMsg("Uploaded. Admin will review it.");
    } catch (err) {
      setMsg(err?.response?.data?.error || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Identity photo (private, visible to admin only)
      </div>
      <button
        type="button"
        onClick={pick}
        disabled={busy}
        className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload / Replace"}
      </button>
      {msg && <div className="text-xs text-gray-500">{msg}</div>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
