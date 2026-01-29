import React, { useEffect, useState } from "react";

/** Simple admin-only CRUD with image upload and external import */
export default function AdminProductsManager() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const blank = {
    id: null,
    title: "",
    description: "",
    category: "",
    priceSEK: 0,
    images: [],
  };
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/products", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setList(data.items || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ✅ Refresh after dashboard sync completes
  useEffect(() => {
    const handler = () => load();
    window.addEventListener("admin-products-sync-done", handler);
    return () =>
      window.removeEventListener("admin-products-sync-done", handler);
  }, []);

  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const body = {
        title: form.title,
        description: form.description,
        category: form.category || null,
        // keep cents integer contract with API
        price: Math.round(Number(form.priceSEK || 0) * 100),
      };
      const method = form.id ? "PUT" : "POST";
      const url = form.id
        ? `/api/admin/products/${form.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      // Images (optional)
      if (form.images?.length) {
        const fd = new FormData();
        for (const f of form.images) fd.append("images", f);
        const up = await fetch(
          `/api/admin/products/${data.product.id}/images`,
          {
            method: "POST",
            credentials: "include",
            body: fd,
          }
        );
        if (!up.ok) {
          const j = await up.json().catch(() => ({}));
          console.warn("Image upload failed:", j.error || up.status);
        }
      }

      setForm(blank);
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function del(id) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) alert("Delete failed");
    else load();
  }

  async function importExternal() {
    const extId = prompt("External ID (from external DB/source):");
    if (!extId) return;
    const res = await fetch(
      `/api/admin/products/import/${encodeURIComponent(extId)}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const j = await res.json();
    if (!res.ok) alert(j.error || "Import failed");
    else load();
  }

  return (
    <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800"
          >
            Refresh
          </button>
          <button
            onClick={importExternal}
            className="px-3 py-1 rounded bg-amber-600 text-white"
          >
            Import by External ID
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <form onSubmit={save} className="grid md:grid-cols-2 gap-3 mt-3">
        <input
          className="border rounded p-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => upd("title", e.target.value)}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => upd("category", e.target.value)}
        />
        <textarea
          className="md:col-span-2 border rounded p-2"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) => upd("description", e.target.value)}
        />
        <label className="block">
          <span className="text-sm">Price (SEK)</span>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={form.priceSEK}
            onChange={(e) => upd("priceSEK", Number(e.target.value || 0))}
            min={0}
          />
        </label>
        <label className="block">
          <span className="text-sm">Images (0–6)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => upd("images", e.target.files)}
          />
        </label>
        <div className="md:col-span-2 flex gap-2">
          <button
            disabled={busy}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            {form.id ? "Update" : "Create"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(blank)}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="mt-6 divide-y divide-gray-200 dark:divide-gray-800">
        {list.map((p) => (
          <li key={p.id} className="py-3 flex items-center gap-3">
            {p.images?.[0] && (
              <img
                src={p.images[0]}
                alt=""
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="min-w-0">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-sm text-gray-500">
                {p.category || "—"} • {(p.price / 100).toFixed(2)} SEK
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() =>
                  setForm({
                    id: p.id,
                    title: p.title,
                    description: p.description || "",
                    category: p.category || "",
                    priceSEK: Math.round((p.price || 0) / 100),
                    images: [],
                  })
                }
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                Edit
              </button>
              <button
                onClick={() => del(p.id)}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
