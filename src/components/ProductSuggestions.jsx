import React, { useMemo } from "react";
import { useWishlist } from "../contexts/WishlistContext";
import LikeButton from "./LikeButton";
import PriceTag from "./PriceTag";
import { nameT } from "../utils/i18nProductHelpers";
import { useTranslation } from "react-i18next";

export default function ProductSuggestions({ allProducts }) {
  const { t } = useTranslation();
  const { likedIds } = useWishlist();

  const suggestions = useMemo(() => {
    if (!allProducts?.length) return [];

    // group liked products by category
    const liked = allProducts.filter((p) => likedIds.includes(p.id));
    const likedCats = new Set(liked.map((p) => p._cat || p.category));

    // suggest products from same categories the user likes,
    // but not already liked
    const pool = allProducts.filter(
      (p) => likedCats.has(p._cat || p.category) && !likedIds.includes(p.id)
    );

    // pick up to 8, simplest logic
    return pool.slice(0, 8);
  }, [allProducts, likedIds]);

  if (!suggestions.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
        {t("suggestions.heading", {
          ns: "common",
          defaultValue: "Because you enjoy these flavors",
        })}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {suggestions.map((p) => (
          <div
            key={p.id}
            className="min-w-[180px] max-w-[220px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex-shrink-0"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-28 object-cover rounded mb-2"
            />
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold line-clamp-2">
                {nameT(t, p._ns || "teas", p.id, p.name)}
              </h3>
              <LikeButton productId={p.id} size="sm" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <PriceTag product={p} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
