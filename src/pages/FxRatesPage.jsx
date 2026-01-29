// src/pages/FxRatesPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../shared/ui/CurrencyProvider";

// Curated list of major & popular world currencies (ISO 4217)
const ALL_CURRENCIES = [
  // Major globals
  { code: "USD", name: "US Dollar", region: "Americas" },
  { code: "EUR", name: "Euro", region: "Europe" },
  { code: "GBP", name: "British Pound", region: "Europe" },
  { code: "JPY", name: "Japanese Yen", region: "Asia" },
  { code: "CNY", name: "Chinese Yuan Renminbi", region: "Asia" },
  { code: "CHF", name: "Swiss Franc", region: "Europe" },
  { code: "CAD", name: "Canadian Dollar", region: "Americas" },
  { code: "AUD", name: "Australian Dollar", region: "Oceania" },
  { code: "NZD", name: "New Zealand Dollar", region: "Oceania" },
  { code: "SEK", name: "Swedish Krona", region: "Europe" },
  { code: "NOK", name: "Norwegian Krone", region: "Europe" },
  { code: "DKK", name: "Danish Krone", region: "Europe" },

  // Popular European
  { code: "PLN", name: "Polish Zloty", region: "Europe" },
  { code: "CZK", name: "Czech Koruna", region: "Europe" },
  { code: "HUF", name: "Hungarian Forint", region: "Europe" },

  // 🔹 Africa
  { code: "NGN", name: "Nigerian Naira", region: "Africa" },
  { code: "ZAR", name: "South African Rand", region: "Africa" },
  { code: "EGP", name: "Egyptian Pound", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", region: "Africa" },
  { code: "GHS", name: "Ghanaian Cedi", region: "Africa" },
  { code: "MAD", name: "Moroccan Dirham", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", region: "Africa" },
  { code: "XOF", name: "West African CFA Franc", region: "Africa" },

  // 🔹 Asia
  { code: "INR", name: "Indian Rupee", region: "Asia" },
  { code: "KRW", name: "South Korean Won", region: "Asia" },
  { code: "SGD", name: "Singapore Dollar", region: "Asia" },
  { code: "HKD", name: "Hong Kong Dollar", region: "Asia" },
  { code: "TWD", name: "New Taiwan Dollar", region: "Asia" },
  { code: "THB", name: "Thai Baht", region: "Asia" },
  { code: "MYR", name: "Malaysian Ringgit", region: "Asia" },
  { code: "IDR", name: "Indonesian Rupiah", region: "Asia" },
  { code: "PHP", name: "Philippine Peso", region: "Asia" },

  // 🔹 Middle East
  { code: "AED", name: "UAE Dirham", region: "Middle East" },
  { code: "SAR", name: "Saudi Riyal", region: "Middle East" },
  { code: "QAR", name: "Qatari Riyal", region: "Middle East" },

  // 🔹 Americas
  { code: "BRL", name: "Brazilian Real", region: "Americas" },
  { code: "MXN", name: "Mexican Peso", region: "Americas" },
];

// Popular currencies to show in the top tiles
const POPULAR_CODES = [
  "SEK",
  "EUR",
  "USD",
  "GBP",
  "CNY",
  "NGN",
  "ZAR",
  "INR",
  "JPY",
];

export default function FxRatesPage() {
  const { t } = useTranslation(["fx", "common"]);
  const { rates = {}, updatedAt, refreshFx, loading } = useCurrency();

  // Base currency for the *explorer* (not for product pricing)
  const [baseCurrency, setBaseCurrency] = useState("SEK");
  const [amount, setAmount] = useState(100);
  const [lastUpdated, setLastUpdated] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  useEffect(() => {
    if (updatedAt) {
      setLastUpdated(new Date(updatedAt).toLocaleString());
    }
  }, [updatedAt]);

  // Supported currencies = codes that actually have a numeric, positive rate
  // rates[c] is interpreted as: SEK per 1 unit of that currency
  const supportedCurrencies = useMemo(
    () =>
      ALL_CURRENCIES.filter((c) => {
        const r = rates[c.code];
        return typeof r === "number" && Number.isFinite(r) && r > 0;
      }),
    [rates]
  );

  // Ensure baseCurrency is always in supported list
  useEffect(() => {
    if (!rates[baseCurrency]) {
      // If chosen base is not available, fall back to SEK or first supported
      if (rates["SEK"]) {
        setBaseCurrency("SEK");
      } else if (supportedCurrencies[0]) {
        setBaseCurrency(supportedCurrencies[0].code);
      }
    }
  }, [baseCurrency, rates, supportedCurrencies]);

  // Helper: SEK per 1 unit of a given currency
  const sekPer = (code) => {
    const v = Number(rates[code]);
    if (!v || !Number.isFinite(v)) return null;
    return v;
  };

  // Convert from base currency → target currency using SEK as the hidden bridge
  const convertFromBase = (amountInBase, targetCode) => {
    if (!amountInBase || !Number.isFinite(amountInBase)) return 0;
    if (targetCode === baseCurrency) return amountInBase;

    const sekPerBase = sekPer(baseCurrency);
    const sekPerTarget = sekPer(targetCode);
    if (!sekPerBase || !sekPerTarget) return 0;

    // amountInBase * (SEK per 1 base) / (SEK per 1 target) = units of target
    return (amountInBase * sekPerBase) / sekPerTarget;
  };

  // Group supported currencies by region
  const currenciesByRegion = useMemo(() => {
    return supportedCurrencies.reduce((acc, currency) => {
      if (!acc[currency.region]) acc[currency.region] = [];
      acc[currency.region].push(currency);
      return acc;
    }, {});
  }, [supportedCurrencies]);

  // Filter currencies based on search & region
  const filteredCurrencies = useMemo(() => {
    return supportedCurrencies.filter((currency) => {
      const matchesSearch =
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion =
        selectedRegion === "all" || currency.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, selectedRegion, supportedCurrencies]);

  // Popular currencies cards – only those we actually have rates for
  const popularCurrencies = useMemo(
    () => POPULAR_CODES.filter((code) => rates[code]),
    [rates]
  );

  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-4">
          {t("title", {
            defaultValue: "💱 Global Currency Exchange Explorer",
          })}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t("subtitle", {
            defaultValue:
              "Compare currencies worldwide. Choose any base currency (e.g. SEK, EUR, USD, NGN, CNY) and see how it converts to others.",
          })}
        </p>
      </div>

      {/* Last Updated & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-center sm:text-left">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("lastUpdated", { defaultValue: "Last updated:" })}
          </span>
          <span className="ml-2 text-sm font-medium">
            {lastUpdated || t("loading", { defaultValue: "Loading..." })}
          </span>
        </div>
        <button
          onClick={refreshFx}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {loading
            ? t("refreshing", { defaultValue: "Refreshing..." })
            : t("refresh", { defaultValue: "Refresh Rates" })}
        </button>
      </div>

      {/* Base & Amount Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
          {t("converter.title", {
            defaultValue: "🌐 Multi-Base Currency Converter",
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
          {/* Base currency select */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("converter.baseCurrency", {
                defaultValue: "Base currency",
              })}
            </label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              {supportedCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount in base */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("converter.amountBase", {
                defaultValue: "Amount in base currency",
              })}{" "}
              ({baseCurrency})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              min="0"
              step="1"
            />
          </div>

          {/* Info */}
          <div className="text-sm text-gray-600 dark:text-gray-300 md:text-right">
            <p>
              {t("converter.helperText", {
                defaultValue:
                  "Change the base to explore how different currencies relate to each other.",
              })}
            </p>
          </div>
        </div>

        {/* Popular Currencies – conversions from base */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {popularCurrencies.map((code) => {
            const currencyInfo = ALL_CURRENCIES.find((c) => c.code === code);
            const value = convertFromBase(amount, code);
            const oneBaseToTarget = convertFromBase(1, code);

            return (
              <div
                key={code}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {amount} {baseCurrency} =
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                  {value.toFixed(2)} {code}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  1 {baseCurrency} ≈ {oneBaseToTarget.toFixed(4)} {code}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {currencyInfo?.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              {t("search.placeholder", {
                defaultValue: "Search currencies...",
              })}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search.placeholder", {
                defaultValue: "Search by code or name...",
              })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-2">
              {t("filter.region", { defaultValue: "Filter by Region" })}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">
                {t("filter.allRegions", { defaultValue: "All Regions" })}
              </option>
              {Object.keys(currenciesByRegion).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* All Currencies Table – all relative to baseCurrency */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="text-left py-3 px-4 font-semibold">
                  {t("ratesTable.currency", { defaultValue: "Currency" })}
                </th>
                <th className="text-right py-3 px-4 font-semibold">
                  {t("ratesTable.perBase", {
                    defaultValue: `Units per 1 ${baseCurrency}`,
                  })}
                </th>
                <th className="text-right py-3 px-4 font-semibold">
                  {t("ratesTable.basePerUnit", {
                    defaultValue: `${baseCurrency} per 1 unit`,
                  })}
                </th>
                <th className="text-right py-3 px-4 font-semibold">
                  {t("ratesTable.amount", {
                    defaultValue: `${amount} ${baseCurrency} value`,
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.map((currency) => {
                const code = currency.code;

                const oneBaseToTarget = convertFromBase(1, code);
                const oneTargetToBase =
                  oneBaseToTarget > 0 ? 1 / oneBaseToTarget : 0;
                const amountValue = convertFromBase(amount, code);

                return (
                  <tr
                    key={code}
                    className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-medium w-12">{code}</span>
                        <div className="ml-3">
                          <div className="text-sm font-medium">
                            {currency.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {currency.region}
                          </div>
                        </div>
                        {code === baseCurrency && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded">
                            {t("base", { defaultValue: "Base" })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-sm">
                      {oneBaseToTarget.toFixed(6)}
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-sm">
                      {oneTargetToBase.toFixed(6)}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold font-mono">
                      {amountValue.toFixed(4)} {code}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredCurrencies.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t("noResults", {
                defaultValue: "No currencies found matching your search.",
              })}
            </div>
          )}
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
          {t("regional.title", {
            defaultValue: "🌍 Currencies by Region (relative to your base)",
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(currenciesByRegion).map(([region, currencies]) => (
            <div
              key={region}
              className="border dark:border-gray-600 rounded-lg p-4"
            >
              <h3 className="font-semibold mb-3 text-lg text-blue-600 dark:text-blue-400">
                {region}
              </h3>
              <div className="space-y-2">
                {currencies.map((currency) => {
                  const code = currency.code;
                  const oneBaseToTarget = convertFromBase(1, code);
                  return (
                    <div
                      key={code}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        <span className="font-medium">{code}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {currency.name}
                        </span>
                      </span>
                      <span className="font-mono text-green-600 dark:text-green-400">
                        1 {baseCurrency} ≈ {oneBaseToTarget.toFixed(4)} {code}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">
          {t("info.title", { defaultValue: "ℹ️ About These Rates" })}
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
          {t("info.description", {
            defaultValue:
              "These exchange rates are used to help visitors understand prices internationally. Internally, prices are set in SEK and converted using our FX feed. This tool lets you choose any base currency (like USD, EUR, NGN or CNY) and compare it to others.",
          })}
        </p>
        <div className="text-xs text-blue-600 dark:text-blue-500">
          <strong>{t("info.coverage", { defaultValue: "Coverage:" })}</strong>{" "}
          {supportedCurrencies.length}{" "}
          {t("info.currencies", {
            defaultValue: "currencies with active rates",
          })}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">
          {t("info.disclaimer", {
            defaultValue:
              "For informational purposes only. Your bank or card provider may use a different exchange rate.",
          })}
        </div>
      </div>
    </main>
  );
}
