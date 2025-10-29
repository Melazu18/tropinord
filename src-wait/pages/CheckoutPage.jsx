import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";

export default function CheckoutForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    postal: "",
    city: "",
    country: "",
    currency: "SEK",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("checkout-form"));
    const currencyFromProducts = location.state?.currency;
    if (saved) {
      setFormData((prev) => ({
        ...prev,
        ...saved,
        currency: currencyFromProducts || saved.currency,
      }));
    } else if (currencyFromProducts) {
      setFormData((prev) => ({ ...prev, currency: currencyFromProducts }));
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem("checkout-form", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      alert(t("checkout.emptyCartWarning", { defaultValue: "Your cart is empty. Please add items before proceeding." }));
      return;
    }

    localStorage.setItem("checkout-form", JSON.stringify(formData));
    localStorage.setItem("cart", JSON.stringify(cart));

    navigate("/payment", { state: { ...formData } });
  };

  const countries = [
    "Sweden",
    "Austria",
    "Belgium",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Netherlands",
    "Norway",
    "Poland",
    "Portugal",
    "Spain",
    "Switzerland",
  ];

  return (
    <main className="pt-32 px-4 py-8 max-w-5xl mx-auto prose dark:prose-invert">
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-green-700">
          {t("checkout.title", { defaultValue: "Checkout" })}
        </h2>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          onSubmit={handleSubmit}
          aria-label="Checkout information form"
        >
          <div className="flex flex-col">
            <label htmlFor="checkout-name" className="mb-1 font-medium">
              {t("checkout.fullName", { defaultValue: "Full Name" })}
            </label>
            <input
              id="checkout-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={t("checkout.fullName", { defaultValue: "Full Name" })}
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="checkout-email" className="mb-1 font-medium">
              {t("checkout.email", { defaultValue: "Email" })}
            </label>
            <input
              id="checkout-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("checkout.email", { defaultValue: "Email" })}
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="checkout-phone" className="mb-1 font-medium">
              {t("checkout.phone", { defaultValue: "Phone Number" })}
            </label>
            <input
              id="checkout-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t("checkout.phone", { defaultValue: "Phone Number" })}
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="checkout-street" className="mb-1 font-medium">
              {t("checkout.street", { defaultValue: "Street Address" })}
            </label>
            <input
              id="checkout-street"
              name="street"
              type="text"
              autoComplete="street-address"
              placeholder={t("checkout.street", { defaultValue: "Street Address" })}
              value={formData.street}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="checkout-postal" className="mb-1 font-medium">
              {t("checkout.postal", { defaultValue: "Postal Code" })}
            </label>
            <input
              id="checkout-postal"
              name="postal"
              type="text"
              autoComplete="postal-code"
              placeholder={t("checkout.postal", { defaultValue: "Postal Code" })}
              value={formData.postal}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="checkout-city" className="mb-1 font-medium">
              {t("checkout.city", { defaultValue: "City" })}
            </label>
            <input
              id="checkout-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              placeholder={t("checkout.city", { defaultValue: "City" })}
              value={formData.city}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label htmlFor="checkout-country" className="mb-1 font-medium">
              {t("checkout.selectCountry", { defaultValue: "Select Country" })}
            </label>
            <select
              id="checkout-country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">{t("checkout.selectCountry", { defaultValue: "Select Country" })}</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:col-span-2">
            <label htmlFor="checkout-currency" className="mb-1 font-medium">
              {t("checkout.currencyLabel", { defaultValue: "Currency:" })}
            </label>
            <select
              id="checkout-currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
              aria-label="Currency selection"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="SEK">SEK (kr)</option>
            </select>
          </div>

          <div className="sm:col-span-2 text-right mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {t("checkout.proceedButton", { defaultValue: "Proceed to Payment" })}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
