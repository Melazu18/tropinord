import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";

const allSoaps = [
  {
    id: "bath-bar-01",
    nameKey: "blackSoap.name",
    descriptionKey: "blackSoap.description",
    ingredientsKey: "blackSoap.ingredients",
    price: 0,
    image: "/images/blog/blacksoap01.jpg",
    category: "bath",
    type: "bar",
    origin: "West Africa",
    scent: "lavender",
    skinType: "sensitive",
  },
  {
    id: "bath-liquid-01",
    nameKey: "blackSoapLiquid.name",
    descriptionKey: "blackSoapLiquid.description",
    ingredientsKey: "blackSoapLiquid.ingredients",
    price: 0,
    image: "/images/blog/LiquidSoap01.png",
    category: "bath",
    type: "liquid",
    origin: "West Africa",
    scent: "eucalyptus",
    skinType: "dry",
  },
  {
    id: "hand-bar-01",
    nameKey: "blackSoapOriginal.name",
    descriptionKey: "blackSoapOriginal.description",
    ingredientsKey: "blackSoapOriginal.ingredients",
    price: 0,
    image: "/images/blog/BlackSoapOriginal01.png",
    category: "hand",
    type: "bar",
    origin: "West Africa",
    scent: "unscented",
    skinType: "normal",
  },
  {
    id: "hand-liquid-01",
    nameKey: "blackSoapLiquid.name",
    descriptionKey: "blackSoapLiquid.description",
    ingredientsKey: "blackSoapLiquid.ingredients",
    price: 0,
    image: "/images/blog/LiquidSoap01.png",
    category: "hand",
    type: "liquid",
    origin: "West Africa",
    scent: "citrus",
    skinType: "oily",
  },
];

export default function NaturalSoapsPage() {
  const { t } = useTranslation("naturalSoaps");
  const { addToCart } = useCart();

  const [selectedSoap, setSelectedSoap] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    origin: "all",
    scent: "all",
    skinType: "all",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ define the filter meta once
  const filterDefs = [
    {
      key: "category",
      labelKey: "filters.category.all",
      options: ["bath", "hand"],
    },
    { key: "type", labelKey: "filters.type.all", options: ["bar", "liquid"] },
    {
      key: "origin",
      labelKey: "filters.origin.all",
      options: ["West Africa", "Nordic", "Western Europe", "Central Europe"],
    },
    {
      key: "scent",
      labelKey: "filters.scent.all",
      options: ["lavender", "eucalyptus", "citrus", "unscented"],
    },
    {
      key: "skinType",
      labelKey: "filters.skinType.all",
      options: ["sensitive", "dry", "normal", "oily"],
    },
  ];

  const filteredSoaps = allSoaps.filter((soap) => {
    return (
      (filters.category === "all" || soap.category === filters.category) &&
      (filters.type === "all" || soap.type === filters.type) &&
      (filters.origin === "all" || soap.origin === filters.origin) &&
      (filters.scent === "all" || soap.scent === filters.scent) &&
      (filters.skinType === "all" || soap.skinType === filters.skinType)
    );
  });

  const handleAddToCart = (soap) => {
    const quantity = quantities[soap.id] || 1;
    addToCart({
      id: soap.id,
      label: t(soap.nameKey),
      image: soap.image,
      price: soap.price,
      quantity,
    });
    setSelectedSoap(null);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-green-400">
        {t("title", { defaultValue: "Natural Soaps Collection" })}
      </h1>
      <p className="mb-6 text-yellow-300 font-semibold">
        {t("subtitle", {
          defaultValue: "Gentle, nourishing soaps for hands and body.",
        })}
      </p>
      {/* Added poetic tagline */}
      <p className="mb-6 text-green-500 italic text-lg">
        {t("branding.tagline", {
          ns: "common",
          defaultValue: "Nature remembers — and so do we.",
        })}
      </p>

      {/* Filters */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {filterDefs.map(({ key, labelKey, options }) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            className="p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white"
          >
            {/* header/All option (translated) */}
            <option value="all">{t(labelKey)}</option>

            {/* the rest (translated) */}
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {t(`filters.${key}.${opt}`, { defaultValue: opt })}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSoaps.map((soap) => (
          <div
            key={soap.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition cursor-pointer text-gray-800 dark:text-gray-100"
            onClick={() => setSelectedSoap(soap)}
          >
            <img
              src={soap.image}
              alt={t(soap.nameKey)}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold">{t(soap.nameKey)}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t(soap.descriptionKey)}
            </p>
            <p className="mt-2 font-bold text-green-700">{soap.price} kr</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={quantities[soap.id] || 1}
                onChange={(e) =>
                  setQuantities((prev) => ({
                    ...prev,
                    [soap.id]: Math.max(1, parseInt(e.target.value)),
                  }))
                }
                className="w-16 p-1 border rounded text-center text-black dark:text-white dark:bg-gray-800"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(soap);
                }}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                {t("buttons.addToCart", { defaultValue: "Add to Cart" })}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSoap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative text-gray-800 dark:text-white">
            <button
              onClick={() => setSelectedSoap(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold"
            >
              ✕
            </button>
            <img
              src={selectedSoap.image}
              alt={t(selectedSoap.nameKey)}
              className="w-full h-60 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">
              {t(selectedSoap.nameKey)}
            </h2>
            <p className="mb-2">{t(selectedSoap.descriptionKey)}</p>

            <h3 className="font-semibold mt-4">Ingredients</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {t(selectedSoap.ingredientsKey)}
            </p>

            <p className="font-semibold text-green-800 dark:text-green-300">
              {selectedSoap.price} kr
            </p>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={quantities[selectedSoap.id] || 1}
                onChange={(e) =>
                  setQuantities((prev) => ({
                    ...prev,
                    [selectedSoap.id]: Math.max(1, parseInt(e.target.value)),
                  }))
                }
                className="w-20 p-2 border rounded text-center text-black dark:text-white dark:bg-gray-800"
              />
              <button
                onClick={() => handleAddToCart(selectedSoap)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t("buttons.addToCart", { defaultValue: "Add to Cart" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
