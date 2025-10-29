import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import productImages from "../data/productImages";

const subCategoryImages = {
  CrownRituals: "/images/haircare.png",
  GlowRoots: "/images/skin02.png",
  EssenceEchoes: "/images/perfume.png",
  BotanicBrews: "/images/tea001.png",
  LiquidGolds: "/images/organicoil01.jpg",
  SoulSeasonings: "/images/spices.jpg",
};

export default function Explore() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const initialCategory = location.state?.category;
  const initialSub = location.state?.sub;

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

  const filteredAgro = productImages.agro.Items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-green-800 mb-4">
            {t("explore.title", { defaultValue: "Explore Our Products" })}
          </h1>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("explore.searchPlaceholder", { defaultValue: "Search products..." })}
            className="mt-2 px-5 py-3 rounded-lg w-full sm:w-1/2 border border-gray-300 shadow text-sm text-gray-900 bg-white"
          />
        </header>

        {/* COSMETIC PRODUCTS */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            {t("categories.cosmetics", { defaultValue: "Cosmetic Products" })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              {
                label: t("subcategories.crownRituals", { defaultValue: "Crown Rituals" }),
                key: "Hair",
                img: "CrownRituals",
              },
              {
                label: t("subcategories.glowRoots", { defaultValue: "Glow Roots" }),
                key: "Skin",
                img: "GlowRoots",
              },
              {
                label: t("subcategories.essenceEchoes", { defaultValue: "Essence Echoes" }),
                key: "Perfume",
                img: "EssenceEchoes",
              },
            ].map(({ label, key, img }) => (
              <button
                key={key}
                onClick={() => handleSelect("cosmetics", key)}
                className="bg-white border shadow hover:shadow-lg rounded-xl p-4 text-center text-green-800 font-semibold flex flex-col items-center"
              >
                <img
                  src={subCategoryImages[img]}
                  alt={label}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                {label} ({productImages.cosmetics[key].length})
              </button>
            ))}
          </div>
        </section>

        {/* HEALING BOTANICALS */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            {t("categories.healingBotanicals", { defaultValue: "Healing Botanicals" })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              {
                label: t("subcategories.botanicBrews", { defaultValue: "Botanic Brews" }),
                key: "Tea",
                img: "BotanicBrews",
              },
              {
                label: t("subcategories.liquidGolds", { defaultValue: "Liquid Golds" }),
                key: "Oils",
                img: "LiquidGolds",
              },
              {
                label: t("subcategories.soulSeasonings", { defaultValue: "Soul Seasonings" }),
                key: "Spices",
                img: "SoulSeasonings",
              },
            ].map(({ label, key, img }) => (
              <button
                key={key}
                onClick={() => handleSelect("food", key)}
                className="bg-white border shadow hover:shadow-lg rounded-xl p-4 text-center text-green-800 font-semibold flex flex-col items-center"
              >
                <img
                  src={subCategoryImages[img]}
                  alt={label}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                {label} ({productImages.food[key].length})
              </button>
            ))}
          </div>
        </section>

        {/* AGRO TRADE & RAW MATERIALS */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            {t("categories.agroTrade", { defaultValue: "Agro-Trade & Raw Materials" })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAgro.map((item, index) => {
              const slugKey = item.slug;
              const translatedTitle = t(
                `products.agro.items.${slugKey}.title`,
                item.label
              );
              const translatedDescription = t(
                `products.agro.items.${slugKey}.description`,
                item.description
              );

              return (
                <div
                  key={index}
                  className="border p-4 rounded-xl bg-white shadow hover:shadow-md flex flex-col"
                >
                  <img
                    src={item.image}
                    alt={translatedTitle}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold text-green-800">
                    {translatedTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    {translatedDescription}
                  </p>
                  <a
                    href="https://wa.me/+46700711713"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    <img
                      src="/WhatsApp.svg"
                      alt="WhatsApp"
                      className="w-5 h-5"
                    />
                    {t("buttons.contact", { defaultValue: "Contact TropiNord" })}
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
