import React from "react";
import { Link } from "react-router-dom";

export default function ShopProductCTA({ productSlug = "", label = "" }) {
  if (!productSlug) return null;

  return (
    <div className="mt-12 p-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl text-center">
      <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
        {label || "Interested in this product?"}
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Visit the shop to learn more or place your order.
      </p>
      <Link
        to={`/products/${productSlug}`}
        className="inline-block px-5 py-2 bg-green-700 text-white rounded-full hover:bg-green-600 transition"
      >
        Shop Now
      </Link>
    </div>
  );
}
