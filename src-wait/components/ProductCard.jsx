import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function getTagColor(tag) {
  const map = {
    New: "bg-green-200 text-green-800",
    Bestseller: "bg-blue-200 text-blue-800",
    Limited: "bg-red-200 text-red-800",
    Natural: "bg-emerald-200 text-emerald-800",
  };
  return map[tag] || "bg-gray-200 text-gray-800";
}

export default function ProductCard({
  category,
  product,
  currency,
  quantity,
  isChecked,
  onQuantityChange,
  onCheckboxChange,
  onAddToCart,
}) {
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);

  const conversionRates = {
    EUR: 1,
    SEK: 11,
    USD: 1.12,
    GBP: 0.85,
  };

  const symbol = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    SEK: "kr",
  }[currency];

  const isBulkOnly =
    category === "agro" ||
    product.description?.toLowerCase().includes("bulk only") ||
    product.description?.toLowerCase().includes("contact to order");

  const handleContact = () => {
    const message = encodeURIComponent(
      `Hello! I'm interested in ordering: ${product.label}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(e);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <div className="border p-3 rounded-md shadow-sm flex flex-col items-center bg-white dark:bg-gray-800 hover:scale-105 transition-transform duration-200">
      <Link to={`/products/detail/${encodeURIComponent(product.slug)}`}>
        <img
          src={product.image || "/images/fallback.jpg"}
          alt={product.label}
          className="w-full h-32 object-cover mb-2 rounded"
        />
        <div className="font-semibold mb-1 text-black dark:text-amber-500">
          {t(`products.${product.label}`, product.label)}
        </div>
      </Link>

      {product.tags?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-1">
          {product.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {product.description && (
        <p className="text-xs text-center text-gray-600 dark:text-gray-300 mb-1">
          {product.description}
        </p>
      )}

      {category !== "agro" && (
        <div className="text-sm mb-2 text-black dark:text-white">
          {symbol}
          {(product.price * conversionRates[currency] || 0).toFixed(2)}
        </div>
      )}

      {category !== "agro" && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            value={product.label}
            checked={isChecked}
            onChange={onCheckboxChange}
            className="cursor-pointer"
          />
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            className="w-16 text-center border rounded bg-white dark:bg-gray-600 dark:text-white"
            disabled={!isChecked}
          />
        </div>
      )}

      {isBulkOnly ? (
        <button
          className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          onClick={handleContact}
        >
          {t("order.contactToOrder", { defaultValue: "Contact to order" })}
        </button>
      ) : (
        <button
          className={`mt-2 text-sm px-3 py-1 rounded text-white ${
            isChecked
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleAddToCart}
          disabled={!isChecked}
        >
          {t("order.addToCart", { defaultValue: "Add to cart" })}
        </button>
      )}

      {showMessage && (
        <div className="mt-2 text-sm text-green-700 bg-green-100 border border-green-300 px-3 py-1 rounded w-full text-center">
          ✅ {t("order.addedToCart", { defaultValue: "Item added to cart!" })}
        </div>
      )}
    </div>
  );
}
