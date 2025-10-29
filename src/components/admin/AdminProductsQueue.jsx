// src/components/admin/AdminProductsQueue.jsx
import React, { useEffect, useState } from "react";

export default function AdminProductsQueue() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/products/pending", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "load_failed");
      setItems(data.items || []);
    } catch (e) {
      setItems([]);
      setErr("Failed to load products queue.");
    } finally {
      setLoading(false);
    }
  }

  async function review(id, status) {
    try {
      const path =
        status === "APPROVED"
          ? `/api/products/${encodeURIComponent(id)}/approve`
          : `/api/products/${encodeURIComponent(id)}/reject`;

      const res = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `${status.toLowerCase()}_failed`);
      }
      await load();
    } catch (e) {
      alert(e.message || "Action failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Products Queue</h2>
        <button
          onClick={load}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>

      {loading && <div className="text-sm text-gray-600">Loading…</div>}
      {err && <div className="text-sm text-red-600">{err}</div>}
      {!loading && !err && items.length === 0 && (
        <div className="text-sm text-gray-600">None</div>
      )}

      <ul className="mt-2 space-y-2">
        {items.map((p) => (
          <li
            key={p.id}
            className="p-3 border rounded flex items-center justify-between"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-xs text-gray-500">
                By {p.owner?.email || p.ownerId} • SEK{" "}
                {(p.price / 100).toFixed(2)} • {p.images?.length || 0} image(s)
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => review(p.id, "APPROVED")}
                className="px-3 py-1 rounded bg-green-600 text-white"
              >
                Approve
              </button>
              <button
                onClick={() => review(p.id, "REJECTED")}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
