import React from "react";

/**
 * props:
 * - suggestions: Array<{
 *     productId: string;
 *     slug: string;
 *     name: string;
 *     category?: string;
 *     subcategory?: string | null;
 *     approxPriceSek?: number;
 *   }>
 * - onAddToCart: (productId: string, quantity?: number) => void
 * - language: "sv" | "en" | ...
 */
export default function ChatProductSuggestions({
  suggestions,
  onAddToCart,
  language = "en",
}) {
  if (!suggestions || !suggestions.length) return null;

  const t = (key, fallback) => {
    // Tiny inline i18n helper for this component
    if (language.startsWith("sv")) {
      const sv = {
        addToCart: "Lägg i kundvagn",
        from: "ca",
        sek: "kr",
      };
      return sv[key] || fallback || key;
    }
    const en = {
      addToCart: "Add to cart",
      from: "from",
      sek: "SEK",
    };
    return en[key] || fallback || key;
  };

  return (
    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
      {suggestions.map((p) => (
        <div
          key={p.productId}
          className="min-w-[180px] max-w-[220px] flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white/90 dark:bg-gray-900/80 dark:border-emerald-900/60 shadow-sm px-3 py-2"
        >
          <div>
            <div className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              {p.category || "Product"}
            </div>
            <div className="mt-1 font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
              {p.name}
            </div>
            {typeof p.approxPriceSek === "number" && p.approxPriceSek > 0 && (
              <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                {t("from")} {p.approxPriceSek} {t("sek")}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(p.productId, 1)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900"
          >
            <span className="mr-1">🛒</span>
            {t("addToCart")}
          </button>
        </div>
      ))}
    </div>
  );
}
