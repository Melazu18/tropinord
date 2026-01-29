// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PriceTag from "./PriceTag";

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
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  contactLabel,
  productUrl, // optional: pass a fully built localized URL from parent
}) {
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);

  // Optional “bulk only” fallback
  const isBulkOnly =
    Boolean(product.bulkOnly) ||
    /bulk only|contact to order/i.test(product.description || "");

  const handleContact = (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hello! I'm interested in ordering: ${product.label || product.title}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product, quantity); // ← pass product + quantity
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const quantityInputId = `qty-${product.id || product.slug || "x"}`;

  return (
    <div className="border p-3 rounded-md shadow-sm flex flex-col items-center bg-white dark:bg-gray-800 hover:scale-105 transition-transform duration-200">
      <Link
        to={
          productUrl || `/products/detail/${encodeURIComponent(product.slug)}`
        }
      >
        <img
          src={product.image || product.images?.[0] || "/images/fallback.jpg"}
          alt={product.label || product.title}
          className="w-full h-32 object-cover mb-2 rounded"
        />
        <div className="font-semibold mb-1 text-black dark:text-amber-500">
          {product.label || product.title}
        </div>
      </Link>

      {product.tags?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-1">
          {product.tags.map((tag, idx) => (
            <span
              key={`${product.id || product.slug}-tag-${idx}`}
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

      {/* FX-aware price (handled entirely inside PriceTag via CurrencyProvider) */}
      <PriceTag
        product={{
          ...product,
          // ensure there is a base price field for CurrencyProvider / priceToDisplay
          price: product.price,
          prices: product.prices,
        }}
      />

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <label htmlFor={quantityInputId} className="sr-only">
          {t("order.quantity", { defaultValue: "Quantity" })}
        </label>
        <input
          id={quantityInputId}
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange?.(Number(e.target.value || 1))}
          className="w-16 text-center border rounded bg-white dark:bg-gray-600 dark:text-white"
        />
      </div>

      {/* Action */}
      {isBulkOnly ? (
        <button
          className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          onClick={handleContact}
        >
          {contactLabel ||
            t("order.contactToOrder", { defaultValue: "Contact to order" })}
        </button>
      ) : (
        <button
          className="mt-2 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onClick={handleAddToCart}
        >
          {t("order.addToCart", { defaultValue: "Add to cart" })}
        </button>
      )}

      {showMessage && (
        <div className="mt-2 text-sm text-green-700 bg-green-100 border border-green-300 px-3 py-1 rounded w-full text-center">
          ✅{" "}
          {t("order.addedToCart", {
            defaultValue: "Item added to cart!",
          })}
        </div>
      )}
    </div>
  );
}
