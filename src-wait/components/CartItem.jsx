import React from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function CartItem({ item, updateQuantity, removeFromCart }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center border-b pb-4 gap-4 shadow-sm bg-white dark:bg-gray-900 rounded p-2 transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
      <img
        src={item.image || "/images/fallback.jpg"}
        alt={item.label}
        className="w-24 h-24 object-cover rounded shadow"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-300">
          {item.label}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t("price", { defaultValue: "Price" })}: €{item.price.toFixed(2)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor={`qty-${item.id}`} className="text-sm dark:text-white">
            {t("qty", { defaultValue: "Qty:" })}
          </label>
          <input
            id={`qty-${item.id}`}
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
              updateQuantity(item.id, parseInt(e.target.value));
              toast.success(t("toast.updated", { defaultValue: "Quantity updated" }));
            }}
            className="w-16 border px-2 py-1 rounded bg-white dark:bg-gray-200 dark:text-black transition duration-200"
          />
          <button
            onClick={() => {
              removeFromCart(item.id);
              toast.success(t("toast.removed", { defaultValue: "Item removed" }));
            }}
            className="ml-auto text-red-600 hover:text-red-800 transition"
            title={t("confirm", { defaultValue: "Yes, Clear" })}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
