import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import productImages from "../data/productImages";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

export default function SelectProducts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [formData, setFormData] = useState({ currency: "SEK", products: [] });
  const [quantities, setQuantities] = useState({});
  const [currencyLocked, setCurrencyLocked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const tLabels = {
    title: t("order.title", { defaultValue: "Order products" }),
    currencyLabel: t("order.currencyLabel", { defaultValue: "Currency" }),
    currencyWarning: t("order.currencyWarning", { defaultValue: "Note: Swish and Bankgiro only support SEK. Currency will be auto-set." }),
    addedToCart: t("order.addedToCart", { defaultValue: "Item added to cart!" }),
    proceedToCheckout: t("order.proceedToCheckout", { defaultValue: "Proceed to checkout" }),
    categoryLabel: t("order.categoryLabel", { defaultValue: "Category" }) || "Filter by Category:",
    searchPlaceholder:
      t("order.searchPlaceholder", { defaultValue: "Search by product name..." }) || "Search by product name...",
  };

  const conversionRates = {
    EUR: 1,
    SEK: 11,
    USD: 1.12,
    GBP: 0.85,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (label, value) => {
    setQuantities((prev) => ({ ...prev, [label]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...formData.products, value]
      : formData.products.filter((p) => p !== value);
    setFormData((prev) => ({ ...prev, products: updated }));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("checkout-form"));
    if (saved) setFormData(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("checkout-form", JSON.stringify(formData));
  }, [formData]);

  const getProductPrice = (label) => {
    for (const category of Object.values(productImages)) {
      for (const subgroup of Object.values(category)) {
        for (const product of subgroup) {
          if (product.label === label) return product.price || 0;
        }
      }
    }
    return 0;
  };

  const calculateTotal = () => {
    return (
      formData.products.reduce((total, label) => {
        const qty = parseInt(quantities[label] || 1);
        const price = getProductPrice(label);
        return total + qty * price;
      }, 0) * conversionRates[formData.currency]
    );
  };

  const productGroups =
    selectedCategory === "all"
      ? Object.entries(productImages)
      : [[selectedCategory, productImages[selectedCategory]]];

  const getTranslatedCategoryName = (key) => {
    if (key === "cosmetics") return t("categories.cosmetics", { defaultValue: "Cosmetic Products" });
    if (key === "food") return t("categories.food", { defaultValue: "Healing Botanicals" });
    if (key === "agro") return t("categories.agro");
    return key;
  };

  return (
    <main className="pt-36">
      <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          {tLabels.title}
        </h2>

        <form className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1">{tLabels.currencyLabel}</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white"
              disabled={currencyLocked}
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="SEK">SEK (kr)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">{tLabels.categoryLabel}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="all">{t("categories.all", { defaultValue: "All Categories" })}</option>
              {Object.keys(productImages).map((category) => (
                <option key={category} value={category}>
                  {getTranslatedCategoryName(category)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">{t("order.searchLabel", { defaultValue: "Search" })}</label>
            <input
              type="text"
              placeholder={tLabels.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
        </form>

        {currencyLocked && (
          <p className="text-sm text-yellow-600 mb-4">
            {tLabels.currencyWarning}
          </p>
        )}

        {toastVisible && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-4">
            {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {productGroups.flatMap(([category, subgroups]) =>
            Object.entries(subgroups).flatMap(([subgroup, products]) =>
              products
                .filter((product) =>
                  product.label
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((product, idx) => (
                  <ProductCard
                    key={`${category}-${subgroup}-${product.label}-${idx}`}
                    category={category}
                    product={{
                      ...product,
                      label: t(`products.${product.label}`, product.label),
                    }}
                    currency={formData.currency}
                    quantity={quantities[product.label] || 1}
                    isChecked={formData.products.includes(product.label)}
                    onQuantityChange={(value) =>
                      handleQuantityChange(product.label, value)
                    }
                    onCheckboxChange={handleCheckboxChange}
                    onAddToCart={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: product.label,
                        label: product.label,
                        image: product.image,
                        price: product.price || 0,
                        quantity: parseInt(quantities[product.label] || 1),
                      });
                      setToastMessage(
                        `✅ ${t(`products.${product.label}`, product.label)} ${
                          tLabels.addedToCart
                        }`
                      );
                      setToastVisible(true);
                      setTimeout(() => setToastVisible(false), 2000);
                    }}
                  />
                ))
            )
          )}
        </div>

        {formData.products.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              {t("order.selectedItems")}
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-100">
              {formData.products.map((label) => (
                <li key={label}>
                  {t(`products.${label}`, label)} × {quantities[label] || 1}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-medium text-gray-900 dark:text-white">
              Total:{" "}
              {formData.currency === "EUR"
                ? "€"
                : formData.currency === "USD"
                ? "$"
                : formData.currency === "GBP"
                ? "£"
                : "kr"}
              {calculateTotal().toFixed(2)}
            </p>
          </div>
        )}

        <div className="text-right">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => {
              formData.products.forEach((label) => {
                for (const category of Object.values(productImages)) {
                  for (const subgroup of Object.values(category)) {
                    const item = subgroup.find((p) => p.label === label);
                    if (item) {
                      addToCart({
                        id: item.label,
                        label: item.label,
                        image: item.image,
                        price: item.price || 0,
                        quantity: parseInt(quantities[item.label] || 1),
                      });
                      break;
                    }
                  }
                }
              });
              navigate("/checkout");
            }}
          >
            {tLabels.proceedToCheckout}
          </button>
        </div>
      </div>
    </main>
  );
}
