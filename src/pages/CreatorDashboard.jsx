import React, { useEffect, useState } from "react";
import CreatorGate from "../components/creator/CreatorGate";

export default function CreatorDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    images: [""],
    price: 0,
    isAuction: true,
  });
  const [mine, setMine] = useState([]);

  async function loadMine() {
    const res = await fetch("/api/products/mine", { credentials: "include" });
    const data = await res.json();
    setMine(data.items || []);
  }

  useEffect(() => {
    loadMine();
  }, []);

  async function submit(e) {
    e.preventDefault();
    const body = {
      ...form,
      price: Math.round(Number(form.price) * 100), // to öre
      images: form.images.filter(Boolean),
    };
    const res = await fetch("/api/products", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setForm({
        title: "",
        description: "",
        images: [""],
        price: 0,
        isAuction: true,
      });
      loadMine();
      alert("Submitted for review");
    } else {
      const err = await res.json();
      alert(err.error || "Failed");
    }
  }

  function setImage(i, v) {
    const next = [...form.images];
    next[i] = v;
    setForm((f) => ({ ...f, images: next }));
  }

  return (
    <CreatorGate>
      <div className="max-w-3xl mx-auto pt-6 space-y-8">
        <h1 className="text-2xl font-bold">Creator Dashboard</h1>

        {/* Upload form */}
        <form
          onSubmit={submit}
          className="p-4 rounded border bg-white dark:bg-gray-900 space-y-3"
        >
          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Description (min 20 chars)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium">Image URLs</label>
            {form.images.map((url, i) => (
              <input
                key={i}
                className="w-full border p-2 rounded"
                placeholder="https://..."
                value={url}
                onChange={(e) => setImage(i, e.target.value)}
              />
            ))}
            <button
              type="button"
              className="px-2 py-1 rounded bg-gray-100"
              onClick={() =>
                setForm((f) => ({ ...f, images: [...f.images, ""] }))
              }
            >
              + Add image
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <input
              className="border p-2 rounded"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <span>SEK</span>
            <label className="ml-auto flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAuction}
                onChange={(e) =>
                  setForm({ ...form, isAuction: e.target.checked })
                }
              />
              Weekly auction
            </label>
          </div>

          <button className="px-4 py-2 rounded bg-green-600 text-white">
            Submit for review
          </button>
        </form>

        {/* My products */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">My products</h2>
          {mine.length === 0 ? (
            <p className="text-sm text-gray-500">No products yet.</p>
          ) : (
            <ul className="space-y-2">
              {mine.map((p) => (
                <li
                  key={p.id}
                  className="p-3 rounded border bg-white dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-gray-500">
                        {p.status}
                        {p.isAuction && p.auctionEnd
                          ? ` · ends ${new Date(p.auctionEnd).toLocaleString()}`
                          : ""}
                      </div>
                    </div>
                    <div className="text-sm">
                      {p.isAuction ? (
                        <span>
                          High bid:{" "}
                          {((p.bids?.[0]?.amount || 0) / 100).toFixed(2)} SEK
                        </span>
                      ) : (
                        <span>Price: {(p.price / 100).toFixed(2)} SEK</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </CreatorGate>
  );
}
