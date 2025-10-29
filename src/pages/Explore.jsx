// src/pages/Explore.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import productCatalog from "@shared/productCatalog";
import productImages from "../data/productImages";
import agroProducts from "../data/agroProducts.json";
import { getRegionFromHost } from "../utils/getRegion";
import { buildWhatsAppUrl } from "../utils/whatsapp";

const subCategoryImages = {
  CrownRituals: "/images/haircare.png",
  GlowRoots: "/images/skin02.png",
  EssenceEchoes: "/images/perfume.png",
  BotanicBrews: "/images/hibiscusDrink02.jpg",
  LiquidGolds: "/images/organicoil01.jpg",
  SoulSeasonings: "/images/spices.jpg",
};

const excludedProductsByRegion = {
  se: [
    "charcoal",
    "bone",
    "dry-bones",
    "plantain-leaves",
    "coconut-pods",
    "coconut-bark",
  ],
};

export default function Explore() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const region = getRegionFromHost();
  const excludedSlugs = excludedProductsByRegion[region] || [];
  const showAgro = region !== "se"; // ← show Agro for international, hide for se

  const initialCategory = location.state?.category;
  const initialSub = location.state?.sub;

  const normalizeSlug = (slug) =>
    slug.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "");

  const handleSelect = (category, subcategory) => {
    navigate("/order", {
      state: { category, sub: subcategory },
    });
  };

  useEffect(() => {
    if (initialCategory && initialSub) {
      handleSelect(initialCategory, initialSub);
    }
  }, [initialCategory, initialSub]);

  const filteredAgro = productImages.agro.Items.filter((item) => {
    const slug = normalizeSlug(item.slug);
    return (
      !excludedSlugs.includes(slug) &&
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <main className="pt-24 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-12">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800 mb-4">
            {t("explore.title", { defaultValue: "Explore Our Products" })}
          </h1>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("explore.searchPlaceholder", {
              defaultValue: "Search products...",
            })}
            className="mt-2 px-4 py-2 text-sm sm:text-base rounded-lg w-full sm:w-2/3 md:w-1/2 border border-gray-300 shadow text-gray-900 bg-white"
          />
        </header>
        <p className="mb-6 text-green-500 italic text-lg">
          {t("branding.tagline", {
            ns: "common",
            defaultValue: "Nature remembers — and so do we.",
          })}
        </p>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">
            {t("categories.cosmetics", { defaultValue: "Cosmetic Products" })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {["Hair", "Skin", "Perfume"].map((key) => {
              const label = t(`subcategories.${key}`, { defaultValue: key });
              return (
                <button
                  key={key}
                  onClick={() => handleSelect("cosmetics", key)}
                  className="bg-white border shadow hover:shadow-lg rounded-xl p-3 sm:p-4 text-center text-green-800 font-semibold flex flex-col items-center"
                >
                  <img
                    src={subCategoryImages[key]}
                    alt={label}
                    className="w-full h-28 sm:h-32 object-cover rounded mb-2"
                  />
                  <span className="text-sm sm:text-base">
                    {label} ({productImages.cosmetics?.[key]?.length || 0})
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">
            {t("categories.healingBotanicals", {
              defaultValue: "Healing Botanicals",
            })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {["Tea", "Oils", "Spices"].map((key) => {
              const label = t(`subcategories.${key}`, { defaultValue: key });
              return (
                <button
                  key={key}
                  onClick={() => handleSelect("healingBotanicals", key)}
                  className="bg-white border shadow hover:shadow-lg rounded-xl p-3 sm:p-4 text-center text-green-800 font-semibold flex flex-col items-center"
                >
                  <img
                    src={subCategoryImages[key]}
                    alt={label}
                    className="w-full h-28 sm:h-32 object-cover rounded mb-2"
                  />
                  <span className="text-sm sm:text-base">
                    {label} (
                    {productImages.healingBotanicals?.[key]?.length || 0})
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {showAgro && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">
              {t("categories.agro", {
                defaultValue: "Agro-Trade & Raw Materials",
              })}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredAgro.map((item, index) => {
                const slugKey = normalizeSlug(item.slug);
                const translatedTitle = t(`agro.items.${slugKey}.title`, {
                  ns: "products",
                  defaultValue: item.label,
                });
                const translatedDescription = t(
                  `agro.items.${slugKey}.description`,
                  {
                    ns: "products",
                    defaultValue: item.description,
                  }
                );

                return (
                  <div
                    key={index}
                    className="border p-3 sm:p-4 rounded-xl bg-white shadow hover:shadow-md flex flex-col"
                  >
                    <img
                      src={item.image}
                      alt={translatedTitle}
                      className="w-full h-36 sm:h-40 object-cover rounded mb-2"
                    />
                    <h3 className="text-base sm:text-lg font-bold text-green-800">
                      {translatedTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-4">
                      {translatedDescription}
                    </p>
                    <a
                      href={buildWhatsAppUrl(
                        `Hello, I'm interested in ${translatedTitle} from your agro products`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                    >
                      <img
                        src="/WhatsApp.svg"
                        alt="WhatsApp"
                        className="w-5 h-5"
                      />
                      {t("contact", { ns: "buttons" })}
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
