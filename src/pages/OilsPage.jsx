// src/pages/OilsPage.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { routeMap } from "../routes/routeMap";
import { useCart } from "../contexts/CartContext";
import oilCatalogData from "../shared/oilCatalogData";
import { CurrencySelect } from "../shared/ui/CurrencyProvider";
import FilterControls from "../shared/ui/FilterControls";
import PaginationBar from "../shared/ui/PaginationBar";
import { IconBadge, LeafIcon } from "../shared/ui/Badge";
import PressIcon from "../components/icons/PressIcon";
import { nameT, descT } from "../utils/i18nProductHelpers";
import PriceTag from "../components/PriceTag";
import ProductImageCarousel from "../components/ProductImageCarousel";
import CloseButton from "../components/CloseButton";
import LikeButton from "../components/LikeButton";
import ProductReviews from "../components/ProductReviews";

const meta = {
  "oil-coconut": { scent: "coconut", skinType: "normal", organic: true, coldPressed: true, typeOfUse: "both" },
  "oil-coconut-heat": { scent: "coconut", skinType: "normal", organic: true, coldPressed: false, typeOfUse: "both" },
  "oil-castor": { scent: "neutral", skinType: "all", organic: true, coldPressed: true, typeOfUse: "external" },
  "oil-moringa-seed": { scent: "neutral", skinType: "dry", organic: true, coldPressed: true, typeOfUse: "external" },
  "oil-palm-kernel": { scent: "nutty", skinType: "very-dry", organic: true, coldPressed: true, typeOfUse: "both" },
  "oil-avocado": { scent: "neutral", skinType: "dry", organic: true, coldPressed: true, typeOfUse: "both" },
  "butter-shea": { scent: "nutty", skinType: "dry", organic: true, coldPressed: false, typeOfUse: "external" },
  "oil-black-seed": { scent: "neutral", skinType: "all", organic: true, coldPressed: true, typeOfUse: "external" },
  "oil-lavender": { scent: "neutral", skinType: "all", organic: true, coldPressed: false, typeOfUse: "external" },
  "oil-rosemary": { scent: "neutral", skinType: "all", organic: true, coldPressed: false, typeOfUse: "external" },
  "oil-mint": { scent: "minty", skinType: "sensitive", organic: true, coldPressed: false, typeOfUse: "external" },
  "moringa-balm": { scent: "minty", skinType: "sensitive", organic: true, coldPressed: false, typeOfUse: "external" },
};

export default function OilsPage() {
  const { t, i18n } = useTranslation(["oil", "common"]);
  const { addToCart } = useCart();

  const lang2 = (i18n.language || "en").slice(0, 2);
  const getOilsDetailPath = (slugOrId) =>
    `/${lang2}/${routeMap.oilsDetail[lang2]}/${slugOrId}`;

  const allowed = [
    "oil-coconut",
    "oil-coconut-heat",
    "oil-castor",
    "oil-moringa-seed",
    "oil-palm-kernel",
    "oil-avocado",
    "oil-black-seed",
    "oil-lavender",
    "oil-rosemary",
    "oil-mint",
    "butter-shea",
    "moringa-balm",
  ];

  const fullCatalog = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(oilCatalogData).filter(([id]) => allowed.includes(id))
      ),
    []
  );

  const products = useMemo(() => Object.values(fullCatalog), [fullCatalog]);

  const [typeFilter, setTypeFilter] = useState("all");
  const [skinFilter, setSkinFilter] = useState("all");
  const [scentFilter, setScentFilter] = useState("any");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const m = meta[p.id] || {};
      const typeOk =
        typeFilter === "all" ||
        m.typeOfUse === typeFilter ||
        (typeFilter === "cooking" && m.typeOfUse === "both") ||
        (typeFilter === "external" && m.typeOfUse === "both");
      const skinOk = skinFilter === "all" || m.skinType === skinFilter;
      const scentOk = scentFilter === "any" || m.scent === scentFilter;
      return typeOk && skinOk && scentOk;
    });
  }, [products, typeFilter, skinFilter, scentFilter]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const [quantities, setQuantities] = useState({});
  const [selected, setSelected] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const handleAdd = (p) => {
    const quantity = quantities[p.id] || 1;
    const basePrice = p.prices?.SEK ?? p.price ?? 0;

    const translatedName = nameT(t, "products.oils", p.id, p.name);

    addToCart({
      id: p.id,
      label: translatedName,
      image: p.image,
      price: basePrice,
      quantity,
      productCode: p.productCode,
    });

    setToastMsg(
      t("addedToCart", {
        defaultValue: "{{name}} added to cart!",
        name: translatedName,
      })
    );
    setTimeout(() => setToastMsg(""), 2000);
  };

  const filterItems = [];

  filterItems.push({
    key: "type",
    label: t("filters.typeOfOil", { defaultValue: "Type of oil" }),
    value: typeFilter,
    onChange: (v) => {
      setTypeFilter(v);
      setPage(1);
    },
    options: [
      { value: "all", label: t("filters.type.all", { defaultValue: "All" }) },
      { value: "cooking", label: t("filters.type.cooking", { defaultValue: "Cooking oil" }) },
      { value: "external", label: t("filters.type.external", { defaultValue: "External use" }) },
      { value: "both", label: t("filters.type.both", { defaultValue: "Cooking & external" }) },
    ],
  });

  if (typeFilter !== "cooking") {
    filterItems.push(
      {
        key: "skin",
        label: t("filters.skinType", { defaultValue: "Skin Type" }),
        value: skinFilter,
        onChange: (v) => {
          setSkinFilter(v);
          setPage(1);
        },
        options: [
          { value: "all", label: t("filters.all", { defaultValue: "All" }) },
          { value: "dry", label: t("filters.dry", { defaultValue: "Dry" }) },
          { value: "very-dry", label: t("filters.veryDry", { defaultValue: "Very dry" }) },
          { value: "sensitive", label: t("filters.sensitive", { defaultValue: "Sensitive" }) },
          { value: "normal", label: t("filters.normal", { defaultValue: "Normal" }) },
        ],
      },
      {
        key: "scent",
        label: t("filters.scent", { defaultValue: "Scent" }),
        value: scentFilter,
        onChange: (v) => {
          setScentFilter(v);
          setPage(1);
        },
        options: [
          { value: "any", label: t("filters.any", { defaultValue: "Any" }) },
          { value: "neutral", label: t("filters.neutral", { defaultValue: "Neutral" }) },
          { value: "nutty", label: t("filters.nutty", { defaultValue: "Nutty" }) },
          { value: "coconut", label: t("filters.coconut", { defaultValue: "Coconut" }) },
          { value: "minty", label: t("filters.minty", { defaultValue: "Minty" }) },
        ],
      }
    );
  }

  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto [color-scheme:light] dark:[color-scheme:dark]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          {t("title", { defaultValue: "Natural Oils & Balms" })}
        </h1>
        <CurrencySelect />
      </div>

      {toastMsg && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-4">
          {toastMsg}
        </div>
      )}

      <FilterControls items={filterItems} />

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
          {t("usageTypesLabel", { defaultValue: "Usage types:" })}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
          {t("usageTypes.cookingOnly", { defaultValue: "Cooking Only" })}
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm">
          {t("usageTypes.externalOnly", { defaultValue: "External Only" })}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm">
          {t("usageTypes.cookingAndExternal", { defaultValue: "Cooking & External" })}
        </span>
      </div>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paged.map((p) => {
          const m = meta[p.id] || {};
          const basePrice = p.prices?.SEK ?? p.price ?? 0;
          const isDualUse = m.typeOfUse === "both";
          const detailHref = getOilsDetailPath(p.slug || p.id);

          return (
            <article
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow p-4"
            >
              <button
                onClick={() => setSelected(p)}
                className="block w-full text-left"
              >
                <ProductImageCarousel
                  images={p.images || [p.image]}
                  alt={p.name}
                  className="h-48 mb-4"
                />
              </button>

              <div className="flex items-start justify-between gap-3 mt-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                    {nameT(t, "products.oils", p.id, p.name)}
                  </h2>

                  {p.productCode && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t("productCode", { defaultValue: "Product Code" })}:{" "}
                      <span className="font-medium">{p.productCode}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {m.organic && (
                    <IconBadge tooltip={t("badges.natural", { defaultValue: "Natural" })}>
                      <LeafIcon />
                    </IconBadge>
                  )}
                  {m.coldPressed && (
                    <IconBadge tooltip={t("badges.coldPressed", { defaultValue: "Cold-Pressed" })}>
                      <PressIcon />
                    </IconBadge>
                  )}
                  <LikeButton productId={p.id} size="sm" />
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-2">
                {descT(t, "products.oils", p.id, p.description)}
              </p>

              <div className="mb-3">
                {isDualUse ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {t("usageBadges.both", { defaultValue: "Cooking & External Use" })}
                  </span>
                ) : m.typeOfUse === "cooking" ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {t("usageBadges.cooking", { defaultValue: "Cooking Oil" })}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {t("usageBadges.external", { defaultValue: "External Use Only" })}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <PriceTag product={{ ...p, price: basePrice, prices: p.prices }} />

                <div className="flex items-center gap-2 text-xs">
                  {(typeFilter !== "cooking" || isDualUse) && m.skinType && (
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {m.skinType}
                    </span>
                  )}
                  {(typeFilter !== "cooking" || isDualUse) && m.scent && (
                    <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      {m.scent}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="number"
                  min="1"
                  value={quantities[p.id] || 1}
                  onChange={(e) => {
                    const v = Math.max(1, parseInt(e.target.value) || 1);
                    setQuantities((prev) => ({ ...prev, [p.id]: v }));
                  }}
                  className="w-16 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={() => handleAdd(p)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  {t("buttons.addToCart", { defaultValue: "Add to Cart" })}
                </button>

                <Link
                  to={detailHref}
                  className="ml-auto text-sm text-green-700 hover:underline dark:text-green-300 whitespace-nowrap"
                >
                  {t("learnMore", { ns: "common", defaultValue: "Learn more" })}
                </Link>
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
              images={selected.images || [selected.image]}
              alt={selected.name}
              containerClassName="mb-4"
              className="h-60"
            />

            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <h2 className="text-xl font-bold">
                  {nameT(t, "products.oils", selected.id, selected.name)}
                </h2>

                {selected.productCode && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("productCode", { defaultValue: "Product Code" })}:{" "}
                    <span className="font-medium">{selected.productCode}</span>
                  </div>
                )}
              </div>

              <LikeButton productId={selected.id} size="sm" />
            </div>

            <p className="text-sm mb-3">
              {descT(t, "products.oils", selected.id, selected.description)}
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
                    handleAdd(selected);
                    setSelected(null);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {t("buttons.addToCart", { defaultValue: "Add to Cart" })}
                </button>

                <Link
                  to={getOilsDetailPath(selected.slug || selected.id)}
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
