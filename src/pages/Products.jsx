// src/pages/Products.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import productImages from "../data/productImages";
import "react-toastify/dist/ReactToastify.css";
import PriceTag from "../components/PriceTag";

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const { t, i18n } = useTranslation(["products", "common"]);
  const lang = i18n.resolvedLanguage || "en";

  const field = (key, def) =>
    t(`fieldLabels.${key}`, { ns: "products", defaultValue: def || key });

  const categoryTitle = (catKey) =>
    t(`categories.${catKey}`, { ns: "products", defaultValue: catKey });

  const subcategoryTitle = (subKey) =>
    t(`subcategories.${subKey}`, { ns: "products", defaultValue: subKey });

  const getLocalizedTitle = (product) => {
    if (product.id) {
      const v = t(`byId.${product.id}.label`, {
        ns: "products",
        defaultValue: "",
      });
      if (v) return v;
    }
    return product.label;
  };

  const getLocalizedDescription = (product) => {
    if (product.id) {
      const v = t(`byId.${product.id}.description`, {
        ns: "products",
        defaultValue: "",
      });
      if (v) return v;
    }
    return product.description;
  };

  const handleQuantityChange = (key, value) => {
    const n = Math.max(1, Number(value || 1));
    setQuantities((prev) => ({ ...prev, [key]: n }));
  };

  const handleAddToCart = (product, quantity) => {
    if (!quantity || quantity < 1) return;
    addToCart({ ...product, quantity: Number(quantity) });
    const readable = getLocalizedTitle(product) || product.label || "Item";
    toast.success(
      t("order.addedToCart", {
        ns: "products",
        defaultValue: "{{item}} (x{{qty}}) added to cart!",
        item: readable,
        qty: quantity,
      }),
      { position: "top-right", autoClose: 2500 }
    );
  };

  const handleProductClick = (slug) => {
    if (!slug) return;
    navigate(`/${lang}/products/detail/${slug}`, {
      state: { from: `/${lang}/products` },
    });
  };

  return (
    <main className="pt-28">
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 min-h-screen">
        <ToastContainer />
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-700 text-center">
          {t("pageHeading", {
            ns: "products",
            defaultValue: "Explore Our Products",
          })}
        </h1>

        {Object.entries(productImages).map(([groupName, subcategories]) => (
          <div key={groupName} className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-amber-600 mb-4 capitalize border-b pb-2">
              {categoryTitle(groupName)}
            </h2>

            {Object.entries(subcategories).map(([subName, items]) => (
              <div key={`${groupName}-${subName}`} className="mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-3 capitalize">
                  {subcategoryTitle(subName)}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((product, index) => {
                    const { label, image, price, slug, description } = product;
                    const cardKey = `${groupName}-${subName}-${
                      label ?? `item-${index}`
                    }`;
                    const quantity = quantities[cardKey] || 1;

                    const localizedTitle = getLocalizedTitle(product);
                    const localizedDescription =
                      getLocalizedDescription(product);

                    const hasPrice =
                      typeof price === "number" ||
                      (typeof price === "string" && price.trim() !== "");

                    return (
                      <div
                        key={cardKey}
                        className="border p-4 rounded-lg shadow bg-white dark:bg-gray-800 flex flex-col justify-between cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={
                          (localizedTitle || label || "Product") +
                          " – view details"
                        }
                        onClick={(e) => {
                          const tag = e.target.tagName;
                          if (
                            tag !== "BUTTON" &&
                            tag !== "INPUT" &&
                            tag !== "A"
                          ) {
                            handleProductClick(slug);
                          }
                        }}
                        onKeyDown={(e) => {
                          const tag = e.target.tagName;
                          if (
                            tag === "BUTTON" ||
                            tag === "INPUT" ||
                            tag === "A"
                          )
                            return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleProductClick(slug);
                          }
                        }}
                      >
                        <img
                          src={image}
                          alt={localizedTitle || label || "Unnamed Product"}
                          className="w-full h-40 object-cover mb-3 rounded"
                          loading="lazy"
                        />

                        <h3 className="text-base sm:text-lg font-semibold mb-1 text-black dark:text-white">
                          {localizedTitle ||
                            label ||
                            t("product.notFound", {
                              ns: "products",
                              defaultValue: "Product",
                            })}
                        </h3>

                        {(localizedDescription || description) && (
                          <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-h-48 overflow-y-auto mb-3">
                            <p>
                              <strong>
                                {field("description", "Description")}:
                              </strong>{" "}
                              {localizedDescription || description}
                            </p>
                          </div>
                        )}

                        {hasPrice ? (
                          <div
                            className="mb-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <PriceTag
                              product={{
                                ...product,
                                price, // base price from your catalog (SEK)
                              }}
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-green-500 italic mb-2">
                            {t("product.contactAdmin", {
                              ns: "products",
                              defaultValue: "admin@tropinord.com",
                            })}
                          </p>
                        )}

                        {/* Quantity + Add to cart */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex flex-col sm:flex-row items-center gap-3 mt-auto"
                        >
                          <label htmlFor={`qty-${cardKey}`} className="sr-only">
                            {t("order.quantity", {
                              ns: "products",
                              defaultValue: "Quantity",
                            })}
                          </label>
                          <input
                            id={`qty-${cardKey}`}
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              handleQuantityChange(cardKey, e.target.value)
                            }
                            className="w-full sm:w-20 px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                            aria-label={t("order.quantity", {
                              ns: "products",
                              defaultValue: "Quantity",
                            })}
                          />
                          <button
                            className="w-full sm:flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={() => handleAddToCart(product, quantity)}
                          >
                            {t("order.addToCart", {
                              ns: "products",
                              defaultValue: "Add to Cart",
                            })}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Products;
