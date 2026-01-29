// src/pages/AdminProducts.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = ["TEA", "OIL", "COFFEE", "SUPERFOOD", "OTHER"];
const STATUS_OPTIONS = ["DRAFT", "PUBLISHED"];

// Simple SEK formatting (adjust if you support multi-currency later)
const formatCurrency = (n) => {
  const val = Number(n ?? 0);
  try {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(val);
  } catch {
    return `${val.toFixed ? val.toFixed(2) : val} kr`;
  }
};

// Small utility for calling API with cookies
async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...opts,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { ok: false, error: "invalid_json", raw: text };
  }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ---------- Modal ----------
function ProductFormModal({ open, initial, onClose, onSave }) {
  const isEdit = Boolean(initial && initial.id);
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(
    initial?.price != null ? String(initial.price) : ""
  );
  const [category, setCategory] = useState(initial?.category || "OTHER");
  const [inventory, setInventory] = useState(
    initial?.inventory != null ? String(initial.inventory) : "0"
  );
  const [status, setStatus] = useState(initial?.status || "DRAFT");
  const [images, setImages] = useState(
    Array.isArray(initial?.images) ? initial.images.join(", ") : ""
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setPrice(initial?.price != null ? String(initial.price) : "");
    setCategory(initial?.category || "OTHER");
    setInventory(initial?.inventory != null ? String(initial.inventory) : "0");
    setStatus(initial?.status || "DRAFT");
    setImages(Array.isArray(initial?.images) ? initial.images.join(", ") : "");
    setSaving(false);
    setErr("");
  }, [open, initial]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    // basic validation
    const priceNum = Number(price);
    const invNum = Number(inventory);
    if (!title.trim()) return setErr("Title is required.");
    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return setErr("Price must be a positive number.");
    if (!Number.isInteger(invNum) || invNum < 0)
      return setErr("Inventory must be a non-negative integer.");

    const payload = {
      title: title.trim(),
      description: description?.trim() || null,
      price: priceNum,
      category,
      inventory: invNum,
      images: images
        ? images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      status, // server will ignore/require admin if needed; this page is admin.
    };

    try {
      setSaving(true);
      await onSave(payload);
      onClose();
    } catch (e) {
      const detail =
        e?.data?.error ||
        e?.message ||
        "Failed to save. Please check fields and try again.";
      setErr(String(detail));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-4">
          {err && (
            <div className="p-2 rounded bg-red-50 text-red-700 border border-red-200 text-sm">
              {err}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Title</span>
              <input
                className="mt-1 w-full rounded border dark:border-slate-700 dark:bg-slate-900 px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Category</span>
              <select
                className="mt-1 w-full rounded border dark:border-slate-700 dark:bg-slate-900 px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Price (SEK)</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="mt-1 w-full rounded border dark:border-slate-700 dark:bg-slate-900 px-3 py-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Inventory</span>
              <input
                type="number"
                step="1"
                min="0"
                className="mt-1 w-full rounded border dark:border-slate-700 dark:bg-slate-900 px-3 py-2"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Status</span>
              <select
                className="mt-1 w-full rounded border dark:border-slate-700 dark:bg-slate-900 px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium">Image URLs</span>
              <textarea
                rows={2}
                placeholder="https://... , https://..."
                className="mt-1 w-full rounded border dark:border-slate-700 dark:bg-slate-900 px-3 py-2"
                value={images}
                onChange={(e) => setImages(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Comma-separated list of image URLs.
              </p>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <textarea
                rows={4}
                className="mt-1 w-full rounded border dark:border-slate-700 dark:bg-slate-900 px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded text-white ${
                saving
                  ? "bg-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function AdminProducts() {
  const { t, i18n } = useTranslation(["admin"]);
  const navigate = useNavigate();
  const lang = (i18n.language || "en").slice(0, 2);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // fetch all (simple; you can add pagination later)
  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchJSON("/api/admin/products");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setErr(
        e?.data?.error || e?.message || "Failed to load admin products list."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    const hay = (p) =>
      `${p.title} ${p.description ?? ""} ${p.category} ${p.status} ${
        p.externalId ?? ""
      }`.toLowerCase();
    return items.filter((p) => hay(p).includes(q));
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setModalOpen(true);
  };

  const createProduct = async (payload) => {
    const data = await fetchJSON("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // optimistic: prepend
    setItems((s) => [data.product, ...s]);
  };

  const updateProduct = async (id, payload) => {
    const data = await fetchJSON(
      `/api/admin/products/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    setItems((s) => s.map((it) => (it.id === id ? data.product : it)));
  };

  const removeProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetchJSON(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setItems((s) => s.filter((it) => it.id !== id));
  };

  const doSync = async () => {
    setSyncing(true);
    setErr("");
    try {
      await fetchJSON("/api/admin/products/sync", { method: "POST" });
      await load();
      alert("Sync complete.");
    } catch (e) {
      setErr(
        e?.data?.error ||
          e?.message ||
          "Sync failed. Ensure server job and catalogs exist."
      );
    } finally {
      setSyncing(false);
    }
  };

  const columns = [
    "Image",
    "Title",
    "Category",
    "Price",
    "Inventory",
    "Status",
    "Created",
    "ExternalId",
    "Actions",
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin • Products</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(getLocalizedPath("admin", lang))}
            className="px-3 py-2 rounded border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={doSync}
            disabled={syncing}
            className={`px-3 py-2 rounded text-white ${
              syncing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            title="Sync from external source"
          >
            {syncing ? "Syncing…" : "Sync External"}
          </button>
          <button
            onClick={openCreate}
            className="px-3 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, status, category…"
          className="w-full md:w-2/3 px-3 py-2 rounded border dark:border-slate-700 dark:bg-slate-900"
        />
        <span className="text-sm text-slate-500">
          Showing {filtered.length} / {items.length}
        </span>
      </div>

      {/* Errors */}
      {err && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200 text-sm">
          {err}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto border rounded-xl dark:border-slate-700">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-3 py-2 border-b dark:border-slate-700 whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-slate-500"
                  colSpan={columns.length}
                >
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-slate-500"
                  colSpan={columns.length}
                >
                  No products yet.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-3 py-2 align-middle">
                    {Array.isArray(p.images) && p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-14 h-14 object-cover rounded"
                        onError={(e) =>
                          (e.currentTarget.style.visibility = "hidden")
                        }
                      />
                    ) : (
                      <div className="w-14 h-14 rounded bg-slate-100 dark:bg-slate-800" />
                    )}
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1 max-w-[42ch]">
                      {p.description || "—"}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-3 py-2 align-middle">{p.inventory ?? 0}</td>
                  <td className="px-3 py-2 align-middle">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        p.status === "PUBLISHED"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 align-middle text-xs text-slate-500">
                    {p.externalId || "—"}
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="px-2 py-1 rounded border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="px-2 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ProductFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={(payload) =>
          editing ? updateProduct(editing.id, payload) : createProduct(payload)
        }
      />
    </main>
  );
}
