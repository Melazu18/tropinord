// src/pages/Explore.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useCart } from "../contexts/CartContext";
import teaCatalog from "@shared/teaCatalogData";
import oilCatalog from "../shared/oilCatalogData";
import coffeeCatalog from "../shared/coffeeCatalogData";
import superfoodsCatalog from "../shared/superfoodsCatalogData";

import { CurrencySelect, useCurrency } from "../shared/ui/CurrencyProvider";
import PaginationBar from "../shared/ui/PaginationBar";
import { nameT, descT } from "../utils/i18nProductHelpers";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import { IconBadge, LeafIcon, CupIcon, ShieldIcon } from "../shared/ui/Badge";
import PriceTag from "../components/PriceTag";
import ProductImageCarousel from "../components/ProductImageCarousel";
import LikeButton from "../components/LikeButton";
import ProductReviews from "../components/ProductReviews";
import { useWishlist } from "../contexts/WishlistContext";
import CloseButton from "../components/CloseButton";

// ---------- helpers ----------
const normalize = (obj, _cat) =>
  Object.values(obj || {}).map((p) => ({
    ...p,
    id: p.id,
    slug: p.slug || p.id,
    name: p.name,
    image: p.image || "/images/placeholder.jpg",
    images: p.images || (p.image ? [p.image] : []),
    description: p.description || "",
    prices: p.prices || { SEK: 0 },
    _cat,
  }));

const nsFor = (cat) =>
  cat === "tea"
    ? "products.tea"
    : cat === "oils"
    ? "products.oils"
    : cat === "coffee"
    ? "products.coffee"
    : "products.superfoods";

const getBadgesForProduct = (product, t) => {
  const badges = [];

  if (product._cat === "tea") {
    if (product.naturallyGrown) {
      badges.push({
        icon: <LeafIcon />,
        tooltip: t("badges.organic", { defaultValue: "Organic" }),
      });
    }
    if (product.category === "herbal") {
      badges.push({
        icon: <CupIcon />,
        tooltip: t("badges.caffeineFree", { defaultValue: "Caffeine-Free" }),
      });
    }
    if (["green", "white"].includes(product.category)) {
      badges.push({
        icon: <ShieldIcon />,
        tooltip: t("badges.antioxidants", {
          defaultValue: "Rich in Antioxidants",
        }),
      });
    }
  }

  if (product._cat === "oils") {
    if (product.naturallyGrown) {
      badges.push({
        icon: <LeafIcon />,
        tooltip: t("badges.natural", { defaultValue: "Natural" }),
      });
    }
  }

  if (product._cat === "coffee") {
    if (product.naturallyGrown) {
      badges.push({
        icon: <LeafIcon />,
        tooltip: t("badges.natural", { defaultValue: "Naturally Grown" }),
      });
    }
    badges.push({
      icon: <CupIcon />,
      tooltip: t("badges.caffeinated", { defaultValue: "Caffeinated" }),
    });
  }

  if (product._cat === "superfoods" && product.naturallyGrown) {
    badges.push({
      icon: <LeafIcon />,
      tooltip: t("badges.natural", { defaultValue: "Naturally Grown" }),
    });
  }

  return badges;
};

export default function Explore() {
  const { t, i18n } = useTranslation(["explore", "common", "search"]);
  const { addToCart } = useCart();
  const { priceFor } = useCurrency();
  const { likedIds } = useWishlist();
  const lang = (i18n.language || "en").slice(0, 2);

  const allItems = useMemo(() => {
    return [
      ...normalize(teaCatalog, "tea"),
      ...normalize(oilCatalog, "oils"),
      ...normalize(coffeeCatalog, "coffee"),
      ...normalize(superfoodsCatalog, "superfoods"),
    ];
  }, []);

  const counts = useMemo(() => {
    const c = { tea: 0, oils: 0, coffee: 0, superfoods: 0 };
    allItems.forEach((p) => (c[p._cat] = (c[p._cat] || 0) + 1));
    return c;
  }, [allItems]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [page, setPage] = useState(1);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const PAGE_SIZE = 12;

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    const hay = (p) => `${p.name} ${p.description} ${p.slug}`.toLowerCase();

    return allItems
      .filter((p) => (cat === "all" ? true : p._cat === cat))
      .filter((p) => (text ? hay(p).includes(text) : true));
  }, [allItems, q, cat]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const add = (p) => {
    const qty = quantities[p.id] || 1;
    addToCart({
      id: p.id,
      label: p.name,
      image: p.image,
      price: priceFor(p),
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

  const catLabel = (c) =>
    t(`categories.${c}`, {
      ns: "search",
      defaultValue:
        c === "tea"
          ? "Tea"
          : c === "oils"
          ? "Oils"
          : c === "coffee"
          ? "Coffee"
          : c === "superfoods"
          ? "Superfoods"
          : "All",
    });

  const listingPath = (c) =>
    c === "tea"
      ? getLocalizedPath("tea", lang)
      : c === "oils"
      ? getLocalizedPath("oils", lang)
      : c === "coffee"
      ? getLocalizedPath("coffee", lang)
      : c === "superfoods"
      ? getLocalizedPath("superfoods", lang)
      : getLocalizedPath("products", lang);

  const suggestions = useMemo(() => {
    if (!likedIds.length) return [];
    const likedSet = new Set(likedIds);
    const likedProducts = allItems.filter((p) => likedSet.has(p.id));
    const likedCats = new Set(likedProducts.map((p) => p._cat));

    const pool = allItems.filter(
      (p) => likedCats.has(p._cat) && !likedSet.has(p.id)
    );

    return pool.slice(0, 8);
  }, [allItems, likedIds]);

  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto [color-scheme:light] dark:[color-scheme:dark]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          {t("title", { defaultValue: "Explore Our Products" })}
        </h1>
        <CurrencySelect />
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {t("subtitle", {
          defaultValue:
            "Discover teas, natural oils, coffee and superfoods crafted for balance and daily wellness.",
        })}
      </p>

      {toastMsg && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-4">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder={t("search.searchPlaceholder", {
            defaultValue: "Search products…",
          })}
          className="w-full md:w-1/2 px-3 py-2 rounded border dark:border-slate-700 dark:bg-slate-900"
        />

        <div className="flex flex-wrap gap-2">
          {["all", "tea", "oils", "coffee", "superfoods"].map((c) => {
            const active = c === cat;
            const count = c === "all" ? allItems.length : counts[c] || 0;
            return (
              <button
                key={c}
                onClick={() => {
                  setCat(c);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                }`}
                title={catLabel(c)}
              >
                {catLabel(c)} • {count}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["tea", "oils", "coffee", "superfoods"].map((c) => (
          <Link
            key={c}
            to={listingPath(c)}
            className="px-3 py-1.5 rounded border text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {t("browseCat", { defaultValue: "Browse " })} {catLabel(c)}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center border rounded-xl dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-300">
            {t("empty", {
              defaultValue: "No products match your search.",
            })}
          </p>
        </div>
      ) : (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageItems.map((p) => {
            const badges = getBadgesForProduct(p, t);

            return (
              <article
                key={`${p._cat}-${p.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow p-4"
              >
                {/* FIXED: no nested <button>, but still clickable */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedProduct(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProduct(p);
                    }
                  }}
                  className="block w-full text-left cursor-pointer"
                >
                  <ProductImageCarousel
                    images={p.images || [p.image]}
                    alt={p.name}
                    className="h-48 mb-4"
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                    {nameT(t, nsFor(p._cat), p.id, p.name)}
                  </h2>
                  <div className="flex items-center gap-1">
                    {badges.map((badge, index) => (
                      <IconBadge key={index} tooltip={badge.tooltip}>
                        {badge.icon}
                      </IconBadge>
                    ))}
                    <LikeButton productId={p.id} size="sm" />
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {p._cat.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
                  {descT(t, nsFor(p._cat), p.id, p.description)}
                </p>

                {(p.originCountry ||
                  p.productionYear ||
                  p.bestBefore ||
                  p.naturallyGrown) && (
                  <dl className="mt-1 text-xs text-gray-600 dark:text-gray-300 space-y-1 mb-3">
                    {p.originCountry && (
                      <div className="flex justify-between gap-3">
                        <dt>
                          {t("card.originLabel", {
                            defaultValue: "Origin",
                          })}
                        </dt>
                        <dd className="text-right">{p.originCountry}</dd>
                      </div>
                    )}
                    {p.productionYear && (
                      <div className="flex justify-between gap-3">
                        <dt>
                          {t("card.productionYearLabel", {
                            defaultValue: "Production year",
                          })}
                        </dt>
                        <dd className="text-right">{p.productionYear}</dd>
                      </div>
                    )}
                    {p.bestBefore && (
                      <div className="flex justify-between gap-3">
                        <dt>
                          {t("card.bestBeforeLabel", {
                            defaultValue: "Best before",
                          })}
                        </dt>
                        <dd className="text-right">{p.bestBefore}</dd>
                      </div>
                    )}
                    {p.naturallyGrown && (
                      <div className="flex justify-between gap-3">
                        <dt>
                          {t("card.naturallyGrownLabel", {
                            defaultValue: "Cultivation",
                          })}
                        </dt>
                        <dd className="flex items-center justify-end gap-1 text-emerald-700 dark:text-emerald-300">
                          <LeafIcon className="w-4 h-4" />
                          <span>
                            {t("card.naturallyGrown", {
                              defaultValue: "Naturally grown",
                            })}
                          </span>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                <div className="flex items-center justify-between">
                  <PriceTag
                    product={{
                      ...p,
                      price: priceFor(p),
                      prices: p.prices,
                    }}
                  />
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
                      {t("addToCart", {
                        ns: "common",
                        defaultValue: "Add to Cart",
                      })}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <PaginationBar
        page={page}
        setPage={setPage}
        total={filtered.length}
        pageSize={PAGE_SIZE}
      />

      {suggestions.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {t("suggestions.heading", {
              ns: "common",
              defaultValue: "Because you enjoyed similar products",
            })}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {suggestions.map((p) => (
              <div
                key={p.id}
                className="min-w-[180px] max-w-[220px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex-shrink-0"
              >
                <ProductImageCarousel
                  images={p.images || [p.image]}
                  alt={p.name}
                  className="h-28 mb-2"
                />
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {nameT(t, nsFor(p._cat), p.id, p.name)}
                  </h3>
                  <LikeButton productId={p.id} size="sm" />
                </div>
                <PriceTag
                  product={{
                    ...p,
                    price: priceFor(p),
                    prices: p.prices,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 z-50 grid place-items-center px-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              onClick={() => setSelectedProduct(null)}
              label={t("close", { ns: "common", defaultValue: "Close" })}
            />

            <ProductImageCarousel
              images={selectedProduct.images || [selectedProduct.image]}
              alt={selectedProduct.name}
              containerClassName="mb-4"
              className="h-60"
            />

            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-bold">
                {nameT(
                  t,
                  nsFor(selectedProduct._cat),
                  selectedProduct.id,
                  selectedProduct.name
                )}
              </h2>
              <LikeButton productId={selectedProduct.id} size="sm" />
            </div>

            <p className="text-sm mb-3">
              {descT(
                t,
                nsFor(selectedProduct._cat),
                selectedProduct.id,
                selectedProduct.description
              )}
            </p>

            {(selectedProduct.originCountry ||
              selectedProduct.productionYear ||
              selectedProduct.bestBefore ||
              selectedProduct.naturallyGrown) && (
              <>
                <h3 className="font-semibold mt-4 mb-2">
                  {t("modal.detailsHeading", {
                    defaultValue: "Product details",
                  })}
                </h3>
                <dl className="text-sm mb-3 space-y-1">
                  {selectedProduct.originCountry && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500 dark:text-gray-400">
                        {t("modal.originLabel", {
                          defaultValue: "Origin (country of production)",
                        })}
                      </dt>
                      <dd className="text-right text-gray-800 dark:text-gray-100">
                        {selectedProduct.originCountry}
                      </dd>
                    </div>
                  )}
                  {selectedProduct.productionYear && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500 dark:text-gray-400">
                        {t("modal.productionYearLabel", {
                          defaultValue: "Production year",
                        })}
                      </dt>
                      <dd className="text-right text-gray-800 dark:text-gray-100">
                        {selectedProduct.productionYear}
                      </dd>
                    </div>
                  )}
                  {selectedProduct.bestBefore && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500 dark:text-gray-400">
                        {t("modal.bestBeforeLabel", {
                          defaultValue: "Best before",
                        })}
                      </dt>
                      <dd className="text-right text-gray-800 dark:text-gray-100">
                        {selectedProduct.bestBefore}
                      </dd>
                    </div>
                  )}
                  {selectedProduct.naturallyGrown && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500 dark:text-gray-400">
                        {t("modal.naturallyGrownLabel", {
                          defaultValue: "Cultivation",
                        })}
                      </dt>
                      <dd className="flex items-center justify-end gap-1 text-emerald-700 dark:text-emerald-300">
                        <LeafIcon className="w-4 h-4" />
                        <span>
                          {t("modal.naturallyGrown", {
                            defaultValue: "Naturally grown",
                          })}
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </>
            )}

            {selectedProduct.history && (
              <>
                <h3 className="font-semibold mt-4 mb-2">
                  {t("modal.historyHeading", { defaultValue: "History" })}
                </h3>
                <p className="text-sm mb-3">{selectedProduct.history}</p>
              </>
            )}

            {selectedProduct.benefits &&
              selectedProduct.benefits.length > 0 && (
                <>
                  <h3 className="font-semibold mt-4 mb-2">
                    {t("modal.benefitsHeading", {
                      defaultValue: "Health Benefits",
                    })}
                  </h3>
                  <ul className="list-disc list-inside text-sm mb-3 space-y-1">
                    {selectedProduct.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}

            {selectedProduct.ingredients && (
              <>
                <h3 className="font-semibold mt-4 mb-2">
                  {t("modal.ingredientsHeading", {
                    defaultValue: "Ingredients",
                  })}
                </h3>
                <p className="text-sm mb-3">
                  {Array.isArray(selectedProduct.ingredients)
                    ? selectedProduct.ingredients.join(", ")
                    : selectedProduct.ingredients}
                </p>
              </>
            )}

            {/* Reviews */}
            <ProductReviews productId={selectedProduct.id} />

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={quantities[selectedProduct.id] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [selectedProduct.id]: Math.max(
                        1,
                        parseInt(e.target.value) || 1
                      ),
                    }))
                  }
                  className="w-16 p-2 border rounded text-center dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  onClick={() => {
                    add(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {t("addToCart", {
                    ns: "common",
                    defaultValue: "Add to Cart",
                  })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
