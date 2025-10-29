// src/components/creator/ProductUpload.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { productsAPI, artisanAPI, authAPI } from "../../services/api";

export default function ProductUpload({ onCreated }) {
  const { t } = useTranslation(["artisan", "products", "dashboard"]);

  const [me, setMe] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileErr, setProfileErr] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priceCents: 0,
    isAuction: false,
    startingBidCents: 0,
    images: [],
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // who am I?
        const meRes = await authAPI.getMe();
        const user = meRes?.data?.user ?? null;
        if (!alive) return;
        setMe(user);

        // load artisan application (if any)
        const st = await artisanAPI.getStatus().catch((e) => {
          if (e?.response?.status === 404)
            return { data: { application: null } };
          throw e;
        });
        const app = st?.data?.application ?? null;
        if (!alive) return;
        setProfile(app);

        // ADMIN can always upload; others must be APPROVED
        const admin = user?.role === "ADMIN";
        const approved = app?.status === "APPROVED";
        setAllowed(Boolean(admin || approved));
      } catch (e) {
        if (!alive) return;
        setProfileErr("LOAD_FAIL");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data: createRes } = await productsAPI.create({
        title: form.title,
        description: form.description,
        category: form.category,
        priceCents: Number(form.priceCents || 0),
        isAuction: !!form.isAuction,
        startingBidCents: form.isAuction
          ? Number(form.startingBidCents || 0)
          : undefined,
      });

      if (form.images?.length) {
        await productsAPI.uploadImages(createRes.product.id, form.images);
      }

      onCreated?.(createRes.product);
      setForm({
        title: "",
        description: "",
        category: "",
        priceCents: 0,
        isAuction: false,
        startingBidCents: 0,
        images: [],
      });
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return null;

  if (!allowed) {
    // keep the original messages
    return (
      <div className="p-4 rounded border bg-yellow-50 text-yellow-900">
        {profile?.status === "PENDING"
          ? t("status.pendingNotice", {
              ns: "artisan",
              defaultValue:
                "Your application is under review. We'll notify you once it's processed.",
            })
          : t("upload.approvalNeeded", {
              ns: "products",
              defaultValue:
                "You need to be approved before uploading products.",
            })}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 p-4 rounded border bg-white dark:bg-gray-900"
    >
      <h3 className="text-lg font-semibold">Upload a Product</h3>

      <input
        className="w-full border rounded p-2"
        placeholder="Title"
        value={form.title}
        onChange={(e) => upd("title", e.target.value)}
        required
        minLength={3}
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Description"
        value={form.description}
        onChange={(e) => upd("description", e.target.value)}
        required
        minLength={20}
        rows={4}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Category"
        value={form.category}
        onChange={(e) => upd("category", e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm">Price (SEK)</span>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={form.priceCents / 100}
            onChange={(e) =>
              upd("priceCents", Math.round(Number(e.target.value || 0) * 100))
            }
            min={0}
          />
        </label>

        <label className="block">
          <span className="text-sm">Auction?</span>
          <select
            className="w-full border rounded p-2"
            value={form.isAuction ? "yes" : "no"}
            onChange={(e) => upd("isAuction", e.target.value === "yes")}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        {form.isAuction && (
          <label className="block">
            <span className="text-sm">Starting bid (SEK)</span>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={form.startingBidCents / 100}
              onChange={(e) =>
                upd(
                  "startingBidCents",
                  Math.round(Number(e.target.value || 0) * 100)
                )
              }
              min={1}
            />
          </label>
        )}
      </div>

      <label className="block">
        <span className="text-sm">Images (up to 6)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => upd("images", e.target.files)}
        />
      </label>

      {error && (
        <div className="p-2 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        disabled={busy}
        className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
      >
        {busy ? "Saving…" : "Submit for Review"}
      </button>
    </form>
  );
}
