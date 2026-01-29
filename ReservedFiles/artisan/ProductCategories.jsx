import React from "react";
import { useTranslation } from "react-i18next";

const ProductCategories = ({ selectedCategories, onCategoryChange }) => {
  const { t } = useTranslation("artisan");

  const productOptions = [
    "pottery",
    "ceramics",
    "jewelry",
    "textiles",
    "woodwork",
    "metalwork",
    "glass",
    "painting",
    "sculpture",
    "home-decor",
    "clothing",
    "accessories",
    "natural-products",
    "food",
    "cosmetics",
    "basketry",
    "leatherwork",
    "candles",
    "soaps",
    "essential-oils",
    "it-tech", // 👈 NEW: Programming & Coding (IT & Technology)
  ];

  const handleCategoryChange = (category) => {
    onCategoryChange(category);
  };

  return (
    <div className="product-categories">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("apply.form.productCategories")} *
      </label>

      <div className="categories-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {productOptions.map((category) => (
          <label
            key={category}
            className={`category-checkbox flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedCategories.includes(category)
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            <span className="ml-2 text-sm font-medium">
              {t(`apply.categories.${category}`)}
            </span>
          </label>
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {t("apply.form.selectedCategories")}: {selectedCategories.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {t(`apply.categories.${category}`)}
                <button
                  type="button"
                  className="ml-1.5 inline-flex rounded-full p-0.5 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => handleCategoryChange(category)}
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    className="h-2 w-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
