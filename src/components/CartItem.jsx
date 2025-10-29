import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function toInt(v, fallback = 1) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : fallback;
}

export default function CartItem({ item, updateQuantity, removeFromCart }) {
  const { t } = useTranslation(["cart", "products"]);

  const [localQty, setLocalQty] = useState(
    item?.quantity ? String(toInt(item.quantity)) : "1"
  );

  useEffect(() => {
    const safe = item?.quantity ? String(toInt(item.quantity)) : "1";
    if (safe !== localQty) setLocalQty(safe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.quantity]);

  function handleChange(e) {
    const raw = e.target.value;
    if (raw === "") {
      setLocalQty("");
      return;
    }
    setLocalQty(raw);

    const parsed = toInt(raw, null);
    if (parsed !== null) {
      updateQuantity(item.id, parsed);
      toast.success(
        t("toast.updated", { ns: "cart", defaultValue: "Quantity updated" })
      );
    }
  }

  function handleBlur() {
    const finalQty = localQty === "" ? 1 : toInt(localQty, 1);
    const finalStr = String(finalQty);
    if (finalStr !== localQty) setLocalQty(finalStr);
    updateQuantity(item.id, finalQty);
  }

  return (
    <div className="flex items-center border-b pb-4 gap-4 shadow-sm bg-white dark:bg-gray-900 rounded p-2 transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
      <img
        src={item.image || "/images/fallback.jpg"}
        alt={item.label}
        className="w-24 h-24 object-cover rounded shadow"
      />

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-300">
          {item.slug
            ? t(`agro.items.${item.slug}.title`, {
                ns: "products",
                defaultValue: item.label || "Unnamed Product",
              })
            : t(`${item.id}.label`, {
                ns: "products",
                defaultValue: item.label || "Unnamed Product",
              })}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {item.slug
            ? t(`agro.items.${item.slug}.description`, {
                ns: "products",
                defaultValue: item.description || "",
              })
            : t(`${item.id}.description`, {
                ns: "products",
                defaultValue: item.description || "",
              })}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <label htmlFor={`qty-${item.id}`} className="text-sm dark:text-white">
            {t("qty", { ns: "cart", defaultValue: "Qty:" })}
          </label>

          {/* string or "" — never NaN */}
          <input
            id={`qty-${item.id}`}
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            pattern="[0-9]*"
            value={localQty}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
            }}
            className="w-16 border px-2 py-1 rounded bg-white dark:bg-gray-200 dark:text-black transition duration-200 text-center"
            aria-label={t("qty", { ns: "cart", defaultValue: "Qty:" })}
          />

          <button
            onClick={() => {
              removeFromCart(item.id);
              toast.success(
                t("toast.removed", { ns: "cart", defaultValue: "Item removed" })
              );
            }}
            className="ml-auto text-red-600 hover:text-red-800 transition"
            title={t("confirm", { ns: "cart", defaultValue: "Yes, Clear" })}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
