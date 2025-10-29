// src/components/CategoryTiles.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getLocalizedPath } from "../utils/getLocalizedPath";

type Tile = {
  key: string;
  img: string;
  labelKey: string; // header.nav.*
  descKey: string; // tiles.*
  labelDefault: string;
  descDefault: string;
  badge?: string;
};

const TILES: Tile[] = [
  {
    key: "products",
    img: "/images/all-products.jpg",
    labelKey: "nav.products",
    labelDefault: "All Products",
    descKey: "allProducts",
    descDefault: "Browse everything",
  },
  {
    key: "naturalSoaps",
    img: "/images/blacksoap01.jpg",
    labelKey: "nav.naturalSoaps",
    labelDefault: "Natural Soaps",
    descKey: "naturalSoaps",
    descDefault: "Gentle, handmade",
  },
  {
    key: "oils",
    img: "/images/coconutoil01.jpg",
    labelKey: "nav.oil", // keep existing key
    labelDefault: "Oils",
    descKey: "oils",
    descDefault: "Cold-pressed wellness",
  },
  {
    key: "tea",
    img: "/images/TropiNordTeaProduct003.png",
    labelKey: "nav.tea",
    labelDefault: "Tea",
    descKey: "tea",
    descDefault: "Herbal & premium blends",
  },
  {
    key: "agro",
    img: "/images/driedCassavaPeel02.jpg",
    labelKey: "nav.agro",
    labelDefault: "Agro Products",
    descKey: "agro",
    descDefault: "Agro commodities",
  },
  {
    key: "offers",
    img: "/images/offers.jpg",
    labelKey: "nav.offers",
    labelDefault: "Offers",
    descKey: "offers",
    descDefault: "Deals this week",
    badge: "-20%",
  },
];

export default function CategoryTiles() {
  const { t } = useTranslation(["header", "tiles"]);
  const lang = i18n.language || "en";

  return (
    <section
      aria-label={t("shopByCategory", {
        ns: "tiles",
        defaultValue: "Shop by category",
      })}
      className="max-w-7xl mx-auto px-4"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        {t("shopByCategory", { ns: "tiles", defaultValue: "Shop by category" })}
      </h2>

      {/* Match EXTRA SHOPPING BLOCKS visual style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {TILES.map((tile) => {
          const to = getLocalizedPath(tile.key, lang);
          const label = t(tile.labelKey, {
            ns: "header",
            defaultValue: tile.labelDefault,
          });
          const desc = t(tile.descKey, {
            ns: "tiles",
            defaultValue: tile.descDefault,
          });

          return (
            <Link
              key={tile.key}
              to={to}
              className="block group rounded-xl overflow-hidden shadow hover:shadow-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
              aria-label={label}
            >
              {/* Image area — same proportions/behavior as EXTRA SHOPPING BLOCKS */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={tile.img}
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/images/fallback-tile.jpg";
                  }}
                />
                {tile.badge && (
                  <span className="absolute top-3 left-3 z-20 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {tile.badge}
                  </span>
                )}
              </div>

              {/* Caption — same spacing/typography as EXTRA SHOPPING BLOCKS */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
