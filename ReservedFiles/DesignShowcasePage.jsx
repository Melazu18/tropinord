import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import catalog from "@shared/productCatalog";

export default function DesignShowcasePage() {
  const { t, i18n } = useTranslation(["products", "buttons"]);
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  const items = useMemo(() => {
    const ids = ["hand-knit-wool-scarf"];
    return ids.map((id) => catalog[id]).filter(Boolean);
  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-green-800 dark:text-green-400">
        {i18n.language?.startsWith("sv") ? "Design" : "Design"}
      </h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        {i18n.language?.startsWith("sv")
          ? "Hantverk, stickning & textil."
          : "Crafts, paintings, knitting & textile."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <article
            key={p.id}
            className="bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition p-4"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-48 object-cover rounded cursor-pointer"
              onClick={() => {
                setSelected(p);
                setQty(1);
              }}
            />
            <h2 className="text-lg font-semibold mt-3">{p.name}</h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
              {p.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value || "1", 10)))
                }
                className="w-16 p-1 border rounded text-center text-black dark:text-white dark:bg-gray-800"
              />
              <button
                onClick={() =>
                  addToCart({
                    id: p.id,
                    label: p.name,
                    image: p.image,
                    price: p.price || 0,
                    quantity: qty,
                  })
                }
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                {t("buttons:addToCart", { defaultValue: "Add to Cart" })}
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            <img
              src={selected.image}
              alt={selected.name}
              className="w-full h-56 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <p className="text-gray-700 dark:text-gray-200 mb-3">
              {selected.description}
            </p>
            {!!selected.history?.length && (
              <>
                <h4 className="font-semibold mb-1">
                  {t("fieldLabels.history", { defaultValue: "History" })}
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 space-y-1">
                  {selected.history.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
