import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import productImages from "../data/productImages";

const countries = [
  "Sweden",
  ...[
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
  ].sort(),
];

const translations = {
  en: {
    title: "Place Your Order",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    street: "Street Address",
    postal: "Postal Code",
    city: "City",
    selectCountry: "Select Country",
    currencyLabel: "Currency:",
    categoryLabel: "Filter by Category:",
    orderSummary: "📋 Order Summary",
    proceedButton: "Proceed to Payment",
  },
  sv: {
    title: "Lägg din beställning",
    fullName: "Fullständigt namn",
    email: "E-post",
    phone: "Telefonnummer",
    street: "Gatuadress",
    postal: "Postnummer",
    city: "Stad",
    selectCountry: "Välj land",
    currencyLabel: "Valuta:",
    categoryLabel: "Filtrera efter kategori:",
    orderSummary: "📋 Orderöversikt",
    proceedButton: "Fortsätt till betalning",
  },
};

const swedishLabels = {
  "Lavender Oil": "Lavendelolja",
  "Lemon Oil": "Citronolja",
  "Mint Essential Oil": "Myntha eterisk olja",
  "Avocado Oil": "Avokadoolja",
  "Frankincense & Myrrh Essential Oil": "Rökelse & Myrra eterisk olja",
  "Native African Pear Oil": "Inhemsk afrikansk päronolja",
  "Neem Oil": "Neemolja",
  "Eucalyptus Citriodora Essential Oil": "Eukalyptus Citriodora eterisk olja",
  "Argan Oil": "Arganolja",
  "Castor Oil": "Ricinolja",
  "Coconut Oil": "Kokosolja",
  "Grape Oil": "Druvolja",
  "Moringa Oil": "Moringaolja",
  "Tumeric Oil": "Gurkmejaolja",
  "Shea Oil": "Sheasmörolja",
  "Herbal Liquid Soap": "Växtbaserad flytande tvål",
  "Moisturizing Liquid Cleanser": "Fuktgivande rengöring",
  "Raw African Black Soap": "Rå afrikansk svart tvål",
  "Floral Infused Soap Bar": "Blominfuserad tvålbar",
  "Kanel Soap": "Kaneltvål",
  "Shea Butter": "Sheasmör",
};

export default function OrderForm({ defaultCategory = "all" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    postal: "",
    city: "",
    country: "",
    language: "en",
    products: [],
  });

  const [quantities, setQuantities] = useState({});
  const [filter, setFilter] = useState("all");
  const [currency, setCurrency] = useState("EUR");
  const t = translations[formData.language];

  const conversionRates = {
    EUR: 1,
    SEK: 11,
  };

  useEffect(() => {
    if (location.state?.preselect) {
      const { label, quantity } = location.state.preselect;

      setFormData((prev) => ({
        ...prev,
        products: prev.products.includes(label)
          ? prev.products
          : [...prev.products, label],
      }));

      setQuantities((prev) => ({
        ...prev,
        [label]: quantity || 1,
      }));

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    setCurrency(formData.language === "sv" ? "SEK" : "EUR");
  }, [formData.language]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updated = checked
        ? [...formData.products, value]
        : formData.products.filter((p) => p !== value);
      setFormData((prev) => ({ ...prev, products: updated }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (label, value) => {
    setQuantities((prev) => ({ ...prev, [label]: value }));
  };

  const getProductPrice = (label) => {
    for (let group in productImages) {
      const found = productImages[group].find((p) => p.label === label);
      if (found) return found.price || 0;
    }
    return 0;
  };

  const getTranslatedLabel = (label) => {
    return formData.language === "sv" ? swedishLabels[label] || label : label;
  };

  const calculateTotal = () => {
    const euroTotal = formData.products.reduce((total, p) => {
      const qty = parseInt(quantities[p] || 1);
      const price = getProductPrice(p);
      return total + qty * price;
    }, 0);
    return (euroTotal * conversionRates[currency]).toFixed(2);
  };

  const proceedToPayment = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const items = formData.products.map((p) => ({
      id: p,
      quantity: parseInt(quantities[p] || 1),
    }));

    try {
      const response = await fetch(
        "http://localhost:3001/api/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, items, currency }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("⚠️ No URL returned:", data);
      }
    } catch (err) {
      console.error("❌ Invalid JSON response or request failed:", err);
    }
  };

  const productGroups = Object.entries(productImages).filter(
    ([key]) => filter === "all" || key === filter
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 text-black dark:text-black shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-green-700">{t.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder={t.fullName}
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t.email}
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          id="phone"
          name="phone"
          autoComplete="tel"
          placeholder={t.phone}
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          id="street"
          name="street"
          autoComplete="street-address"
          placeholder={t.street}
          value={formData.street}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          id="postal"
          name="postal"
          autoComplete="postal-code"
          placeholder={t.postal}
          value={formData.postal}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          id="city"
          name="city"
          autoComplete="address-level2"
          placeholder={t.city}
          value={formData.city}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          id="country"
          name="country"
          autoComplete="country-name"
          value={formData.country}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">{t.selectCountry}</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="en">English</option>
          <option value="sv">Svenska</option>
        </select>
      </div>

      <div className="mb-4 w-fit">
        <label
          htmlFor="filter"
          className="block font-semibold mb-2 text-amber-500"
        >
          {t.categoryLabel}
        </label>
        <select
          id="filter"
          name="filter"
          className="border rounded p-2 pr-8 text-sm w-40"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          {Object.keys(productImages).map((group) => (
            <option key={group} value={group}>
              {group.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {productGroups.flatMap(([group, items]) =>
          items.map(({ label, image, price }) => (
            <div
              key={label}
              className="border p-3 rounded-md shadow-sm flex flex-col items-center"
            >
              <img
                src={image}
                alt={label}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <div className="text-center font-semibold mb-1 text-black dark:text-amber-500">
                {getTranslatedLabel(label)}
              </div>

              <div className="text-sm mb-2">
                {currency === "EUR" ? "€" : "kr"}
                {(price * conversionRates[currency]).toFixed(2)}
              </div>

              <input
                id={`check-${label}`}
                name={`check-${label}`}
                type="checkbox"
                value={label}
                checked={formData.products.includes(label)}
                onChange={handleChange}
              />
              <input
                id={`quantity-${label}`}
                name={`quantity-${label}`}
                type="number"
                min="1"
                value={quantities[label] || 1}
                onChange={(e) => handleQuantityChange(label, e.target.value)}
                className="mt-2 w-16 text-center border rounded"
              />
            </div>
          ))
        )}
      </div>

      {formData.products.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2 dark:text-white">
            {t.orderSummary}
          </h3>
          <ul className="text-sm space-y-1">
            {formData.products.map((p) => (
              <li key={p} className="dark:text-yellow-500">
                {getTranslatedLabel(p)} × {quantities[p] || 1} ={" "}
                {currency === "EUR" ? "€" : "kr"}
                {(
                  getProductPrice(p) *
                  (quantities[p] || 1) *
                  conversionRates[currency]
                ).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold text-right text-green-700 dark:text-green-400">
            Total: {currency === "EUR" ? "€" : "kr"}
            {calculateTotal()}
          </div>
          <button
            onClick={proceedToPayment}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            {t.proceedButton}
          </button>
        </div>
      )}
    </div>
  );
}
