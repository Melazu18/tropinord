// src/components/gallery/GalleryItemModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../utils/api";
import catalog from "../../shared/productCatalog"; // <-- shared FE catalog

export default function GalleryItemModal({ id, onClose }) {
  const { t } = useTranslation(["gallery", "products"]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/gallery/${encodeURIComponent(id)}`
        );
        const data = await res.json();
        if (!cancelled) {
          setItem(data?.item || null);
        }
      } catch (_e) {
        if (!cancelled) setItem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Try to map this gallery item to a product in the shared catalog
  const matchedProduct = useMemo(() => {
    if (!item) return null;

    // 1) direct id match
    if (catalog[item.id]) return catalog[item.id];

    // 2) match by slug if present
    if (item.slug && catalog[item.slug]) return catalog[item.slug];

    // 3) fuzzy by title words
    const title = (item.title || "").toLowerCase();
    const entries = Object.values(catalog);
    const hit =
      entries.find((p) => p.slug && title.includes(p.slug.toLowerCase())) ||
      entries.find((p) => p.name && title.includes(p.name.toLowerCase()));
    return hit || null;
  }, [item]);

  function stop(e) {
    e.stopPropagation();
  }

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-lg p-6"
          onClick={stop}
        >
          {t("loading", { defaultValue: "Loading..." })}
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-lg p-6"
          onClick={stop}
        >
          {t("notFound", { defaultValue: "Item not found." })}
        </div>
      </div>
    );
  }

  const img = item.images?.[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl"
        onClick={stop}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">
            {item.title || t("detail", { defaultValue: "Detail" })}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-black/5 dark:bg-white/5">
            {img ? (
              <img
                src={img}
                alt={item.title || "Gallery image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="p-5 space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {item.description ||
                t("noDescription", { defaultValue: "No description." })}
            </div>

            <div className="text-xs text-gray-500">
              {t("by", { defaultValue: "by" })}{" "}
              <span className="font-medium">
                {item.author?.handle || item.author?.name || "—"}
              </span>
            </div>

            {/* Product History if we matched something in catalog */}
            {matchedProduct?.history?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold mb-2">
                  {t("historyTitle", { defaultValue: "Product History" })}
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {matchedProduct.history.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Basic product facts if available */}
            {matchedProduct && (
              <div className="mt-3 text-sm">
                {matchedProduct.description && (
                  <p className="text-gray-700 dark:text-gray-200">
                    {matchedProduct.description}
                  </p>
                )}
                {typeof matchedProduct.price === "number" && (
                  <p className="mt-1 text-gray-500">
                    {t("price", { ns: "products", defaultValue: "Price" })}:{" "}
                    {matchedProduct.price === 0
                      ? t("contactAdmin", {
                          ns: "products",
                          defaultValue: "Contact admin@tropinord.com",
                        })
                      : matchedProduct.price}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            {t("close", { defaultValue: "Close" })}
          </button>
        </div>
      </div>
    </div>
  );
}
