//src/pages/SuperfoodsPage.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { routeMap } from "../routes/routeMap";
import { useCart } from "../contexts/CartContext";
import superfoodsCatalog from "../shared/superfoodsCatalogData";
import { CurrencySelect } from "../shared/ui/CurrencyProvider";
import PaginationBar from "../shared/ui/PaginationBar";
import { nameT, descT } from "../utils/i18nProductHelpers";
import PriceTag from "../components/PriceTag";
import { IconBadge, LeafIcon } from "../shared/ui/Badge";
import ProductImageCarousel from "../components/ProductImageCarousel";
import CloseButton from "../components/CloseButton";
import LikeButton from "../components/LikeButton";
import ProductReviews from "../components/ProductReviews";

export default function SuperfoodsPage() {
  const { t, i18n } = useTranslation(["superfoods", "common"]);
  const { addToCart } = useCart();

  const lang2 = (i18n.language || "en").slice(0, 2);
  const getSuperfoodsDetailPath = (slugOrId) =>
    `/${lang2}/${routeMap.superfoodsDetail[lang2]}/${slugOrId}`;

  const items = useMemo(() => Object.values(superfoodsCatalog || {}), []);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [quantities, setQuantities] = useState({});
  const [selected, setSelected] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const PAGE_SIZE = 9;

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    const hay = (p) =>
      `${p.name} ${p.description || ""} ${(p.ingredients || []).join(",")}`.toLowerCase();
    return items.filter((p) => (text ? hay(p).includes(text) : true));
  }, [items, q]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const add = (p) => {
    const qty = quantities[p.id] || 1;
    const basePrice = p.prices?.SEK ?? p.price ?? 0;

    addToCart({
      id: p.id,
      label: p.name,
      image: p.image,
      price: basePrice,
      quantity: qty,
    });

    setToastMsg(
      t("addedToCart", {
        defaultValue: "{{name}} added to cart!",
        name: p.name,
      })
    );
    setTimeout(() => setToastMsg(""), 2000);
  };

  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto [color-scheme:light] dark:[color-scheme:dark]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          {t("title", { defaultValue: "🌱 Superfoods" })}
        </h1>
        <CurrencySelect />
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {t("subtitle", {
          defaultValue:
            "Natural staples from Africa and the Pacific: clean energy and daily balance without additives.",
        })}
      </p>

      {toastMsg && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-4">
          {toastMsg}
        </div>
      )}

      <div className="mb-6">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder={t("searchPlaceholder", { defaultValue: "Search powders and blends…" })}
          className="w-full md:w-1/2 px-3 py-2 rounded border dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pageItems.map((p) => {
          const basePrice = p.prices?.SEK ?? p.price ?? 0;
          const detailHref = getSuperfoodsDetailPath(p.slug || p.id);

          return (
            <article
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow p-4"
            >
              <button onClick={() => setSelected(p)} className="block w-full text-left">
                <ProductImageCarousel
                  images={p.images || [p.image || "/images/placeholder.jpg"]}
                  alt={p.name}
                  className="h-48 mb-4"
                />
              </button>

              <div className="flex items-start justify-between gap-3 mt-3">
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  {nameT(t, "products.superfoods", p.id, p.name)}
                </h2>
                <div className="flex items-center gap-2">
                  {p.naturallyGrown && (
                    <IconBadge tooltip={t("badges.natural", { defaultValue: "Naturally Grown" })}>
                      <LeafIcon />
                    </IconBadge>
                  )}
                  <LikeButton productId={p.id} size="sm" />
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
                {descT(t, "products.superfoods", p.id, p.description)}
              </p>

              <div className="flex items-center justify-between">
                <PriceTag product={{ ...p, price: basePrice, prices: p.prices }} />

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={quantities[p.id] || 1}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [p.id]: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-16 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    onClick={() => add(p)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    {t("addToCart", { ns: "common", defaultValue: "Add to Cart" })}
                  </button>

                  {/* ✅ Learn more */}
                  <Link
                    to={detailHref}
                    className="text-sm text-green-700 hover:underline dark:text-green-300 whitespace-nowrap"
                  >
                    {t("learnMore", { ns: "common", defaultValue: "Learn more" })}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <PaginationBar page={page} setPage={setPage} total={filtered.length} pageSize={PAGE_SIZE} />

      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 grid place-items-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              onClick={() => setSelected(null)}
              label={t("close", { ns: "common", defaultValue: "Close" })}
            />

            <ProductImageCarousel
              images={selected.images || [selected.image || "/images/placeholder.jpg"]}
              alt={selected.name}
              containerClassName="mb-4"
              className="h-60"
            />

            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-bold">
                {nameT(t, "products.superfoods", selected.id, selected.name)}
              </h2>
              <LikeButton productId={selected.id} size="sm" />
            </div>

            <p className="text-sm mb-3">
              {descT(t, "products.superfoods", selected.id, selected.description)}
            </p>

            <ProductReviews productId={selected.id} />

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={quantities[selected.id] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [selected.id]: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-16 p-2 border rounded text-center dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  onClick={() => {
                    add(selected);
                    setSelected(null);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {t("addToCart", { ns: "common", defaultValue: "Add to Cart" })}
                </button>

                {/* ✅ Learn more (modal) */}
                <Link
                  to={getSuperfoodsDetailPath(selected.slug || selected.id)}
                  className="text-sm text-green-700 hover:underline dark:text-green-300 whitespace-nowrap"
                >
                  {t("learnMore", { ns: "common", defaultValue: "Learn more" })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
