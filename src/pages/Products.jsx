// src/pages/Products.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import productImages from "../data/productImages";
import AgroContactForm from "../components/AgroContactForm";
import "react-toastify/dist/ReactToastify.css";
import { getRegionFromHost } from "../utils/getRegion";
import { buildWhatsAppUrl } from "../utils/whatsapp";

const excludedProductsByRegion = {
  se: [
    "charcoal",
    "bone",
    "dry-bones",
    "plantain-leaves",
    "coconut-pods",
    "coconut-bark",
  ],
};

const formatPrice = (region, eur) => {
  if (region === "se") {
    // simple EUR→SEK example rate; replace with your real rate/provider
    const sek = Math.round(eur * 11.5);
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(sek);
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(eur);
};

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const { t, i18n } = useTranslation(["products", "common"]);
  const lang = i18n.resolvedLanguage || "en";

  // ✅ Memoize region and exclusions
  const region = useMemo(() => getRegionFromHost(), []);
  const excludedSlugs = useMemo(
    () => excludedProductsByRegion[region] || [],
    [region]
  );

  const normalizeSlug = (slug) =>
    String(slug || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "");

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
    const slugKey = normalizeSlug(product.slug);
    const agro = t(`agro.items.${slugKey}.title`, {
      ns: "products",
      defaultValue: "",
    });
    if (agro) return agro;
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
    const slugKey = normalizeSlug(product.slug);
    const agro = t(`agro.items.${slugKey}.description`, {
      ns: "products",
      defaultValue: "",
    });
    if (agro) return agro;
    return product.description;
  };

  const getLocalizedField = (product, key) => {
    if (product.id) {
      const v = t(`byId.${product.id}.${key}`, {
        ns: "products",
        defaultValue: "",
      });
      if (v) return v;
    }
    const slugKey = normalizeSlug(product.slug);
    const agro = t(`agro.items.${slugKey}.${key}`, {
      ns: "products",
      defaultValue: "",
    });
    if (agro) return agro;
    return product[key];
  };

  const handleQuantityChange = (key, value) => {
    setQuantities((prev) => ({ ...prev, [key]: Number(value) }));
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
      {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };

  const handleProductClick = (slug) => {
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
                  {items
                    .filter(
                      (product) =>
                        !excludedSlugs.includes(normalizeSlug(product.slug))
                    )
                    .map((product, index) => {
                      const { label, image, price, slug, description } =
                        product;

                      const key = `${groupName}-${subName}-${
                        label ?? `item-${index}`
                      }`;
                      const quantity = quantities[key] || 1;

                      const localizedTitle = getLocalizedTitle(product);
                      const localizedDescription =
                        getLocalizedDescription(product);

                      const locOrigin = getLocalizedField(product, "origin");
                      const locHistory = getLocalizedField(product, "history");
                      const locUsage = getLocalizedField(product, "usage");
                      const locBenefits = getLocalizedField(
                        product,
                        "benefits"
                      );
                      const locSideEffects = getLocalizedField(
                        product,
                        "sideEffects"
                      );
                      const locProductionDate = getLocalizedField(
                        product,
                        "productionDate"
                      );
                      const locBestBefore = getLocalizedField(
                        product,
                        "bestBefore"
                      );
                      const locBotanicalName = getLocalizedField(
                        product,
                        "botanicalName"
                      );
                      const locFamily = getLocalizedField(product, "family");

                      const isAgro =
                        groupName === "agro" ||
                        subName.toLowerCase() === "items";
                      const hasPrice = typeof price === "number";

                      return (
                        <div
                          key={key}
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
                          />

                          <h3 className="text-base sm:text-lg font-semibold mb-1 text-black dark:text-white">
                            {localizedTitle ||
                              label ||
                              t("product.notFound", {
                                ns: "products",
                                defaultValue: "Product",
                              })}
                          </h3>

                          <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-h-48 overflow-y-auto mb-3">
                            {(localizedDescription || description) && (
                              <p>
                                <strong>
                                  {field("description", "Description")}:
                                </strong>{" "}
                                {localizedDescription || description}
                              </p>
                            )}
                            {locOrigin && (
                              <p>
                                <strong>{field("origin", "Origin")}:</strong>{" "}
                                {locOrigin}
                              </p>
                            )}
                            {locHistory && (
                              <p>
                                <strong>{field("history", "History")}:</strong>{" "}
                                {locHistory}
                              </p>
                            )}
                            {locBotanicalName && (
                              <p>
                                <strong>
                                  {field("botanicalName", "Botanical Name")}:
                                </strong>{" "}
                                {locBotanicalName}
                              </p>
                            )}
                            {locFamily && (
                              <p>
                                <strong>{field("family", "Family")}:</strong>{" "}
                                {locFamily}
                              </p>
                            )}
                            {locBenefits && (
                              <p>
                                <strong>
                                  {field("benefits", "Benefits")}:
                                </strong>{" "}
                                {locBenefits}
                              </p>
                            )}
                            {locUsage && (
                              <p>
                                <strong>{field("usage", "Usage")}:</strong>{" "}
                                {locUsage}
                              </p>
                            )}
                            {locSideEffects && (
                              <p>
                                <strong>
                                  {field("sideEffects", "Side Effects")}:
                                </strong>{" "}
                                {locSideEffects}
                              </p>
                            )}
                            {locProductionDate && (
                              <p>
                                <strong>
                                  {field(
                                    "productionDate",
                                    "Date of Production"
                                  )}
                                  :
                                </strong>{" "}
                                {locProductionDate}
                              </p>
                            )}
                            {locBestBefore && (
                              <p>
                                <strong>
                                  {field("bestBefore", "Best Before")}:
                                </strong>{" "}
                                {locBestBefore}
                              </p>
                            )}
                          </div>

                          {hasPrice ? (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {field("price", "Price")}:{" "}
                              {formatPrice(region, price)}
                            </p>
                          ) : (
                            <p className="text-sm text-green-500 italic mb-2">
                              {t("product.contactAdmin", {
                                ns: "products",
                                defaultValue: "admin@tropinord.com",
                              })}
                            </p>
                          )}

                          {isAgro && !hasPrice ? (
                            <>
                              <a
                                href={buildWhatsAppUrl(
                                  `Hello, I'm interested in ${
                                    localizedTitle || label || ""
                                  } from your agro products`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()} // keep card click from firing
                                className="mt-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                              >
                                <img
                                  src="/WhatsApp.svg"
                                  alt="WhatsApp"
                                  className="w-5 h-5"
                                />
                                {t("contact", { ns: "buttons" })}
                              </a>

                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2"
                              >
                                <AgroContactForm product={product} />
                              </div>
                            </>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col sm:flex-row items-center gap-3 mt-auto"
                            >
                              <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                  handleQuantityChange(key, e.target.value)
                                }
                                className="w-full sm:w-20 px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                aria-label={t("order.quantity", {
                                  ns: "products",
                                  defaultValue: "Quantity",
                                })}
                              />
                              <button
                                className="w-full sm:flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                onClick={() =>
                                  handleAddToCart(product, quantity)
                                }
                              >
                                {t("order.addToCart", {
                                  ns: "products",
                                  defaultValue: "Add to Cart",
                                })}
                              </button>
                            </div>
                          )}
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
