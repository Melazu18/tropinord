// src/pages/OilsPage.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import oilCatalogData from "../shared/oilCatalogData";

import { CurrencySelect, useCurrency } from "../shared/ui/CurrencyProvider";
import FilterControls from "../shared/ui/FilterControls";
import PaginationBar from "../shared/ui/PaginationBar";
import { IconBadge, LeafIcon, CupIcon, ShieldIcon } from "../shared/ui/Badge";
import PressIcon from "../components/icons/PressIcon";

const meta = {
  "oil-coconut": {
    scent: "coconut",
    skinType: "normal",
    organic: true,
    coldPressed: true,
  },
  "oil-castor": {
    scent: "neutral",
    skinType: "all",
    organic: true,
    coldPressed: true,
  },
  "oil-moringa-seed": {
    scent: "neutral",
    skinType: "dry",
    organic: true,
    coldPressed: true,
  },
  "oil-palm-kernel": {
    scent: "nutty",
    skinType: "very-dry",
    organic: true,
    coldPressed: true,
  },
  "oil-avocado": {
    scent: "neutral",
    skinType: "dry",
    organic: true,
    coldPressed: true,
  },
  "butter-shea": {
    scent: "nutty",
    skinType: "dry",
    organic: true,
    coldPressed: false,
  },
  "moringa-balm": {
    scent: "minty",
    skinType: "sensitive",
    organic: true,
    coldPressed: false,
  },
};

export default function OilsPage() {
  const { t } = useTranslation(["oil", "common"]);
  const { addToCart } = useCart();
  const { currency, priceFor, format } = useCurrency();

  const allowed = [
    "oil-coconut",
    "oil-castor",
    "oil-moringa-seed",
    "oil-palm-kernel",
    "oil-avocado",
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

  // filters
  const [skinFilter, setSkinFilter] = useState("all");
  const [scentFilter, setScentFilter] = useState("any");

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const m = meta[p.id] || {};
      const skinOk = skinFilter === "all" || m.skinType === skinFilter;
      const scentOk = scentFilter === "any" || m.scent === scentFilter;
      return skinOk && scentOk;
    });
  }, [products, skinFilter, scentFilter]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const [quantities, setQuantities] = useState({});
  const [selected, setSelected] = useState(null);

  const handleAdd = (p) => {
    const quantity = quantities[p.id] || 1;
    addToCart({
      id: p.id,
      name: p.name,
      image: p.image,
      price: priceFor(p),
      quantity,
    });
  };

  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          {t("title", { ns: "oil", defaultValue: "🌿 Organic Oils & Balms" })}
        </h1>
        <CurrencySelect />
      </div>

      <FilterControls
        items={[
          {
            key: "skin",
            label: t("filters.skinType", {
              ns: "oil",
              defaultValue: "Skin Type",
            }),
            value: skinFilter,
            onChange: (v) => {
              setSkinFilter(v);
              setPage(1);
            },
            options: [
              {
                value: "all",
                label: t("filters.all", { ns: "oil", defaultValue: "All" }),
              },
              {
                value: "dry",
                label: t("filters.dry", { ns: "oil", defaultValue: "Dry" }),
              },
              {
                value: "very-dry",
                label: t("filters.veryDry", {
                  ns: "oil",
                  defaultValue: "Very Dry",
                }),
              },
              {
                value: "sensitive",
                label: t("filters.sensitive", {
                  ns: "oil",
                  defaultValue: "Sensitive",
                }),
              },
              {
                value: "normal",
                label: t("filters.normal", {
                  ns: "oil",
                  defaultValue: "Normal",
                }),
              },
            ],
          },
          {
            key: "scent",
            label: t("filters.scent", { ns: "oil", defaultValue: "Scent" }),
            value: scentFilter,
            onChange: (v) => {
              setScentFilter(v);
              setPage(1);
            },
            options: [
              {
                value: "any",
                label: t("filters.any", { ns: "oil", defaultValue: "Any" }),
              },
              {
                value: "neutral",
                label: t("filters.neutral", {
                  ns: "oil",
                  defaultValue: "Neutral",
                }),
              },
              {
                value: "nutty",
                label: t("filters.nutty", { ns: "oil", defaultValue: "Nutty" }),
              },
              {
                value: "coconut",
                label: t("filters.coconut", {
                  ns: "oil",
                  defaultValue: "Coconut",
                }),
              },
              {
                value: "minty",
                label: t("filters.minty", { ns: "oil", defaultValue: "Minty" }),
              },
            ],
          },
        ]}
      />

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paged.map((p) => {
          const m = meta[p.id] || {};
          const price = priceFor(p);
          return (
            <article
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow p-4"
            >
              <button
                onClick={() => setSelected(p)}
                className="block w-full text-left"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="rounded-lg w-full object-cover mb-4 h-48"
                />
              </button>

              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  {p.name}
                </h2>
                <div className="flex items-center gap-2">
                  {m.organic && (
                    <IconBadge
                      tooltip={t("badges.organic", {
                        ns: "oil",
                        defaultValue: "Organic",
                      })}
                    >
                      <LeafIcon />
                    </IconBadge>
                  )}
                  {m.coldPressed && (
                    <IconBadge
                      tooltip={t("badges.coldPressed", {
                        ns: "oil",
                        defaultValue: "Cold-Pressed",
                      })}
                    >
                      <PressIcon />
                    </IconBadge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
                {p.description}
              </p>

              <div className="flex items-center justify-between">
                <p className="font-bold text-green-800 dark:text-green-200">
                  {format(price)}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  {m.skinType && (
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {m.skinType}
                    </span>
                  )}
                  {m.scent && (
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
                  {t("buttons.addToCart", {
                    ns: "oil",
                    defaultValue: "Add to Cart",
                  })}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <PaginationBar
        page={page}
        setPage={setPage}
        total={filtered.length}
        pageSize={PAGE_SIZE}
      />
    </main>
  );
}
