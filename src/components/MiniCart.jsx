import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MiniCart({ show = true }) {
  const { t } = useTranslation();
  const { cart, getCartCount } = useCart();

  if (!show || getCartCount() === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-4 w-72">
      <h4 className="text-sm font-semibold mb-2 text-green-700">
        🛒 {t("cartPreview", { defaultValue: "Cart Preview" })}
      </h4>
      <ul className="text-sm max-h-40 overflow-y-auto space-y-1">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.label}</span>
            <span className="text-right">x{item.quantity}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/cart"
        className="block mt-3 text-center text-sm font-medium bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {t("goToCart", { defaultValue: "Go to Cart" })}
      </Link>
    </div>
  );
}
