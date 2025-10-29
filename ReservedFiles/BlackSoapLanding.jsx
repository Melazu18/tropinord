// src/pages/BlackSoapLanding.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeMap } from "../routes/routeMap";
import { useCart } from "../contexts/CartContext";

const blackSoapProducts = [
  {
    id: "blackSoap",
    nameKey: "products.blackSoap.name",
    descKey: "products.blackSoap.description",
    price: 0,
    image: "/images/blog/blacksoap01.jpg",
  },
  {
    id: "original",
    nameKey: "products.original.name",
    descKey: "products.original.description",
    price: 0,
    image: "/images/blog/BlackSoapOriginal01.png",
  },
  {
    id: "liquid",
    nameKey: "products.liquid.name",
    descKey: "products.liquid.description",
    price: 0,
    image: "/images/blog/LiquidSoap01.png",
  },
];

export default function BlackSoapLanding() {
  // same namespaces style as TeaPage
  const { t, i18n } = useTranslation(["blackSoap", "buttons", "products"]);
  const lang = i18n.resolvedLanguage || i18n.language || "en";

  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto prose dark:prose-invert">
      {/* lightweight toast like TeaPage */}
      {toastVisible && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-6">
          {toastMessage}
        </div>
      )}

      <h1 className="text-4xl font-bold text-green-800 dark:text-green-300 mb-2">
        🌿{" "}
        {t("title", {
          ns: "blackSoap",
          defaultValue: "African Black Soap Collection",
        })}
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
        {t("intro", {
          ns: "blackSoap",
          defaultValue:
            "Discover our range of authentic African Black Soaps — hand-crafted using natural ingredients, ideal for cleansing, exfoliating, and protecting skin year-round.",
        })}
      </p>

      <p className="mb-6 text-green-500 italic text-lg">
        {t("tagline", {
          ns: "blackSoap",
          defaultValue: "Nature remembers — and so do we.",
        })}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {blackSoapProducts.map((p) => {
          const name = t(p.nameKey, { ns: "blackSoap" });
          const desc = t(p.descKey, { ns: "blackSoap" });
          const qty = quantities[p.id] || 1;

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-md p-4"
            >
              <img
                src={p.image}
                alt={name || p.id}
                className="rounded-lg w-full object-cover mb-4 h-48"
              />
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                {name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {desc}
              </p>

              <p className="font-bold text-green-800 dark:text-green-200 mb-4">
                kr{p.price}
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [p.id]: Math.max(1, parseInt(e.target.value || "1", 10)),
                    }))
                  }
                  className="w-16 p-1 border rounded text-center text-black dark:text-white dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    const quantity = quantities[p.id] || 1;

                    addToCart({
                      id: p.id,
                      label: name, // localized name (like TeaPage)
                      image: p.image,
                      price: p.price || 0,
                      quantity,
                    });

                    setToastMessage(
                      t("order.addedToCart", {
                        ns: "products",
                        item: name,
                        qty: quantity,
                        defaultValue: "{{item}} (x{{qty}}) added to cart!",
                      })
                    );
                    setToastVisible(true);
                    setTimeout(() => setToastVisible(false), 2000);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  {t("buttons:addToCart", { defaultValue: "Add to Cart" })}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link
          to={`/${lang}/${routeMap.blog[lang]}/african-black-soap`}
          className="inline-block mt-4 text-green-700 dark:text-green-400 hover:underline"
        >
          {t("readMore", {
            ns: "blackSoap",
            defaultValue: "Read more about African Black Soap →",
          })}
        </Link>
      </div>
    </main>
  );
}
