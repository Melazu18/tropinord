// src/shared/ui/CurrencyProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * CurrencyProvider
 * ----------------
 * - Backend /api/fx returns: { base: "EUR", rates: { EUR:1, SEK:11.3, USD:1.08, ... } }
 *   → each rate is "units of that currency per 1 EUR"
 * - Here we normalize everything to be "SEK per 1 unit of currency"
 *   so that:
 *     - SEK always has rate 1
 *     - convert(amountInSEK, "EUR") = amountInSEK / rate["EUR"]
 */

const CurrencyContext = createContext(null);

/**
 * FALLBACK
 * --------
 * Shape: "SEK per 1 unit of that currency"
 * Examples (approximate, just so UI works if API fails):
 *  - EUR: 11.3  → 1 EUR ≈ 11.3 SEK
 *  - USD: 10.5  → 1 USD ≈ 10.5 SEK
 *  - NGN: 0.0066 → 1 NGN ≈ 0.0066 SEK
 */
const FALLBACK = {
  base: "SEK",
  rates: {
    SEK: 1,

    // Europe / majors
    EUR: 11.3,
    USD: 10.5,
    GBP: 13.0,
    CHF: 11.0,
    CAD: 7.8,
    AUD: 7.0,
    NZD: 6.5,
    NOK: 1.1,
    DKK: 1.5,
    PLN: 2.6,
    CZK: 0.47,
    HUF: 0.029,

    // Africa (approximate SEK per unit)
    NGN: 0.0066, // 1 NGN ≈ 0.0066 SEK
    ZAR: 0.55,   // 1 ZAR ≈ 0.55 SEK
    EGP: 0.30,
    KES: 0.075,
    GHS: 0.85,
    MAD: 1.0,
    TZS: 0.004,
    XOF: 0.017,

    // Asia
    CNY: 1.5,
    JPY: 0.065,
    INR: 0.13,
    KRW: 0.008,
    SGD: 8.0,
    HKD: 1.4,
    TWD: 0.35,
    THB: 0.30,
    MYR: 2.5,
    IDR: 0.0007,
    PHP: 0.18,

    // Middle East
    AED: 3.0,
    SAR: 2.8,
    QAR: 3.0,

    // Americas
    BRL: 2.2,
    MXN: 0.65,
  },
  updatedAt: null,
};

const STORAGE_KEY = "tn_fx_v1";
const STORAGE_CUR = "tn_currency_v1";

export function CurrencyProvider({ children, initial = "SEK" }) {
  // Load selected currency from localStorage
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_CUR) || initial;
    } catch {
      return initial;
    }
  });

  // Load FX from localStorage or fallback
  const [fx, setFx] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return FALLBACK;
  });

  const [loading, setLoading] = useState(false);
  const firstLoadDone = useRef(false);

  // Persist selected currency
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUR, currency);
    } catch {}
  }, [currency]);

  /**
   * Normalize backend EUR-based rates into SEK-per-unit
   *
   * Backend gives: base = "EUR", rates = { EUR:1, SEK:11.3, USD:1.08, NGN:1700, ... }
   *  - SEK_per_EUR = rates["SEK"]
   *  - For each currency C with "unitsPerEUR" = rates[C]:
   *      1 EUR = unitsPerEUR (C)
   *      1 C   = (1 / unitsPerEUR) EUR
   *      1 C   = (SEK_per_EUR / unitsPerEUR) SEK
   */
  function normalizeRatesFromBackend(json) {
    // If backend already uses SEK base & "SEK per unit", we can skip
    if (json.base === "SEK") {
      // assume json.rates already is SEK-per-unit
      const merged = { ...FALLBACK.rates, ...json.rates };
      return {
        base: "SEK",
        rates: merged,
        updatedAt: json.updatedAt || new Date().toISOString(),
      };
    }

    // If backend base is EUR with "units per 1 EUR"
    if (json.base === "EUR") {
      const unitsPerEurSEK = Number(json.rates["SEK"]);
      if (!unitsPerEurSEK || !Number.isFinite(unitsPerEurSEK)) {
        // If SEK is missing in payload, just fall back
        return FALLBACK;
      }

      const normalized = { SEK: 1 };

      for (const [code, unitsPerEur] of Object.entries(json.rates)) {
        if (!unitsPerEur || !Number.isFinite(unitsPerEur)) continue;

        if (code === "SEK") {
          continue; // already set
        }

        if (code === "EUR") {
          // 1 EUR = unitsPerEurSEK SEK
          normalized["EUR"] = unitsPerEurSEK;
          continue;
        }

        // SEK per 1 unit of currency "code"
        const sekPerUnit = unitsPerEurSEK / unitsPerEur;
        normalized[code] = sekPerUnit;
      }

      // Merge with FALLBACK so missing codes still have something
      const merged = { ...FALLBACK.rates, ...normalized };

      return {
        base: "SEK",
        rates: merged,
        updatedAt: json.updatedAt || new Date().toISOString(),
      };
    }

    // Any other base – just overlay on fallback assuming it's already SEK-per-unit
    const merged = { ...FALLBACK.rates, ...json.rates };
    return {
      base: "SEK",
      rates: merged,
      updatedAt: json.updatedAt || new Date().toISOString(),
    };
  }

  /** ------------------------------------------
   * Fetch live FX rates from /api/fx
   * ------------------------------------------ */
  async function refreshFx() {
    setLoading(true);
    try {
      const res = await fetch("/api/fx", { credentials: "include" });
      if (!res.ok) throw new Error(`FX ${res.status}`);
      const json = await res.json();

      if (!json?.rates || typeof json.rates !== "object") {
        throw new Error("Invalid FX payload");
      }

      const payload = normalizeRatesFromBackend(json);
      setFx(payload);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {}
    } catch (e) {
      console.warn("[CurrencyProvider] FX fetch failed:", e?.message);
      // keep existing fx; if it's broken, fall back
      setFx((prev) => prev || FALLBACK);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (firstLoadDone.current) return;
    firstLoadDone.current = true;
    refreshFx();
  }, []);

  /** ------------------------------------------
   * Convert from base (SEK) → target currency
   * ------------------------------------------ */
  const convert = (amountInSEK, target = currency) => {
    const sekPerUnit = Number(fx.rates[target] ?? 0);
    if (!sekPerUnit || !Number.isFinite(sekPerUnit)) {
      return amountInSEK; // can't convert → treat as SEK
    }
    // amountInSEK / (SEK per 1 unit) = units of target
    return Number(amountInSEK || 0) / sekPerUnit;
  };

  /** ------------------------------------------
   * priceFor - always converts from SEK base
   * ------------------------------------------ */
  const priceFor = (product, cur = currency) => {
    const p = product.prices || {};

    // Base amount is always SEK
    const base = Number(product.price ?? p.SEK ?? 0);

    // Case 1 — explicit non-zero price
    if (typeof p[cur] === "number" && p[cur] > 0) {
      return p[cur];
    }

    // Case 2 — explicit but zero → treat as missing → convert
    if (p[cur] === 0) {
      return convert(base, cur);
    }

    // Case 3 — missing → convert
    return convert(base, cur);
  };

  /** ------------------------------------------
   * Format currency display
   * ------------------------------------------ */
  const format = (amount, cur = currency, opts = {}) => {
    const options = {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 2,
      ...opts,
    };

    try {
      return new Intl.NumberFormat(undefined, options).format(amount ?? 0);
    } catch (error) {
      console.warn(`Formatting failed for ${cur}:`, error);
      return `${cur} ${(amount ?? 0).toFixed(2)}`;
    }
  };

  /** ------------------------------------------
   * Memoized context value
   * ------------------------------------------ */
  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      loading,
      rates: fx.rates,
      base: fx.base,
      updatedAt: fx.updatedAt,
      refreshFx,
      convert,
      priceFor,
      format,
      // Only keep currencies with a positive numeric rate
      currencies: Object.keys(fx.rates).filter(
        (c) => typeof fx.rates[c] === "number" && fx.rates[c] > 0
      ),
    }),
    [currency, fx, loading]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be inside CurrencyProvider");
  return ctx;
}

/** Dropdown UI */
export function CurrencySelect({ className = "" }) {
  const { currency, setCurrency, currencies, loading, updatedAt } =
    useCurrency();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700"
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <span className="text-xs text-gray-500 dark:text-gray-400">
        {loading
          ? "Updating…"
          : updatedAt
          ? `FX: ${new Date(updatedAt).toLocaleDateString()}`
          : ""}
      </span>
    </div>
  );
}
