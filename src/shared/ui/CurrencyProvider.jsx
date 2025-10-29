// src/shared/ui/CurrencyProvider.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Simple currency context for UI display only.
 * If a product has prices[currency] > 0 we use that.
 * Otherwise we fall back to SEK and convert with static UI rates.
 */
const CurrencyContext = createContext();

const DEFAULT = "SEK";
// UI-only demo rates vs SEK (tweak anytime)
const UI_RATES = { SEK: 1, EUR: 0.088, USD: 0.095, GBP: 0.075 };

export function CurrencyProvider({ children, initial = DEFAULT }) {
  const [currency, setCurrency] = useState(initial);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      format(amount, cur = currency) {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: cur,
          maximumFractionDigits: 0,
        }).format(amount ?? 0);
      },
      /**
       * Return product price in current currency.
       * Priority: item.prices[currency] -> item.prices.SEK * rate
       */
      priceFor(item, cur = currency) {
        const p = item?.prices || {};
        if (p[cur] && p[cur] > 0) return p[cur];
        const sek = p.SEK ?? item?.price ?? 0;
        return Math.round(sek * (UI_RATES[cur] / UI_RATES.SEK));
      },
      currencies: Object.keys(UI_RATES),
    }),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

/** Small dropdown you can drop in your toolbar/header */
export function CurrencySelect({ className = "" }) {
  const { currency, setCurrency, currencies } = useCurrency();
  return (
    <select
      className={`px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700 ${className}`}
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
    >
      {currencies.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
