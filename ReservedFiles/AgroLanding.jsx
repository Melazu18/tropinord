// src/pages/AgroLanding.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import productImages from "../data/productImages";
import { Link } from "react-router-dom";

export default function AgroLanding() {
  // Use both namespaces: products (labels) + common (tagline)
  const { t, i18n } = useTranslation(["products", "common"]);
  const agroProducts = productImages.agro || {};

  // normalize to match translation keys like agro.items.<slugKey>.*
  const normalizeSlug = (slug) =>
    String(slug || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "");

  return (
    <main className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        {t("categories.agro", {
          ns: "products",
          defaultValue: "Agro-Trade & Raw Materials",
        })}
      </h1>

      {/* Translated poetic tagline from common.json */}
      <p className="mb-6 text-green-500 italic text-lg">
        {t("branding.tagline", {
          ns: "common",
          defaultValue: "Nature remembers — and so do we.",
        })}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(agroProducts).flatMap(([subgroup, items]) =>
          items.map((item) => {
            const slugKey = normalizeSlug(item.slug);
            const title = t(`agro.items.${slugKey}.title`, {
              ns: "products",
              defaultValue: item.label,
            });
            const description = t(`agro.items.${slugKey}.description`, {
              ns: "products",
              defaultValue: item.description,
            });

            return (
              <Link
                key={item.slug}
                to={`/${i18n.language}/products/detail/${item.slug}`}
                className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}
