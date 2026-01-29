import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import teaCatalogData from "@shared/teaCatalogData";
import { useCart } from "../contexts/CartContext";
import ProductImageCarousel from "../components/ProductImageCarousel";
import PriceTag from "../components/PriceTag";
import LikeButton from "../components/LikeButton";
import ProductReviews from "../components/ProductReviews";
import BackButton from "../components/BackButton";
import { teaProductNameT, teaProductDescT } from "../utils/i18nProductHelpers";
import ProductQRCode from "../components/ProductQRCode";

const isImperialLocale = (lang = "") => /^en-US/i.test(lang);
const cToF = (c) => (c * 9) / 5 + 32;
const mlToFlOz = (ml) => ml / 29.5735295625;

const formatNumber = (n, { maxDecimals = 1 } = {}) => {
  const factor = Math.pow(10, maxDecimals);
  return Math.round(n * factor) / factor;
};

const formatDosage = (t, i18n, d) => {
  if (!d) return null;
  const imperial = isImperialLocale(i18n?.language || "en");
  if (!imperial) {
    return t("brew.dosageMetric", {
      ns: "teas",
      amount: d.amount,
      unit: d.unit,
      volume: d.volumeMl,
    });
  }
  const flOz = formatNumber(mlToFlOz(d.volumeMl));
  return t("brew.dosageImperial", {
    ns: "teas",
    amount: d.amount,
    unit: d.unit,
    volume: flOz,
  });
};

const formatBrewingTime = (t, bt) => {
  if (!bt) return null;
  if (bt.min && bt.max) {
    return t("brew.timeRange", {
      ns: "teas",
      min: bt.min,
      max: bt.max,
      unit: bt.unit,
    });
  }
  return t("brew.timeSingle", {
    ns: "teas",
    value: bt.min,
    unit: bt.unit,
  });
};

const formatTemperature = (t, i18n, temp) => {
  if (!temp) return null;
  const imperial = isImperialLocale(i18n?.language || "en");
  if (!imperial) {
    return t("brew.temperatureC", {
      ns: "teas",
      value: temp.value,
    });
  }
  const f = formatNumber(cToF(temp.value), { maxDecimals: 0 });
  return t("brew.temperatureF", {
    ns: "teas",
    value: f,
  });
};

const getSafetyKey = (tea) => {
  const type = tea?.safetyNotice?.type;
  return type ? `safety.${type}` : null;
};

export default function TeaProductDetail() {
  const { slug } = useParams();

  // includes products namespace if you use it elsewhere
  const { t, i18n } = useTranslation(["teas", "buttons", "common", "products"]);

  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const tea = useMemo(() => {
    return (
      teaCatalogData?.[slug] ||
      Object.values(teaCatalogData || {}).find((x) => x.slug === slug) ||
      null
    );
  }, [slug]);

  if (!tea) {
    return (
      <main className="pt-24 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-red-600">
          {t("products.notFound", {
            ns: "common",
            defaultValue: "Product not found.",
          })}
        </div>
      </main>
    );
  }

  const basePrice = tea.prices?.SEK ?? tea.price ?? 0;

  const dosageStr = formatDosage(t, i18n, tea.dosage);
  const timeStr = formatBrewingTime(t, tea.brewingTime);
  const tempStr = formatTemperature(t, i18n, tea.brewTemperature);
  const safetyKey = getSafetyKey(tea);

  const add = () => {
    addToCart({
      id: tea.id,
      label: tea.name,
      image: tea.image,
      price: basePrice,
      quantity: qty,
    });
  };

  return (
    <main className="pt-24 px-4 py-10 max-w-5xl mx-auto">
      <div className="mb-4">
        <BackButton fallbackRouteKey="tea" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ProductImageCarousel
            images={tea.images || [tea.image]}
            alt={tea.name}
            className="h-80"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold">
                {teaProductNameT(t, tea.slug, tea.name)}
              </h1>

              {/* ✅ Product Code visible to users */}
              {tea.productCode && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t("productCode", { defaultValue: "Product code" })}:{" "}
                  <span className="font-medium">{tea.productCode}</span>
                </div>
              )}
            </div>

            {tea.productCode && (
              <div className="mt-3">
                <ProductQRCode
                  value={tea.productCode}
                  size={110}
                  label={tea.productCode}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("scanHint", {
                    defaultValue: "Scan to open in the Tea page search.",
                  })}
                </div>
              </div>
            )}

            <LikeButton productId={tea.id} size="md" />
          </div>

          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {teaProductDescT(t, tea.slug, tea.description)}
          </p>

          <div className="mt-4">
            <PriceTag product={{ ...tea, price: basePrice }} />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="font-semibold">
              {t("detail.preparation", {
                ns: "teas",
                defaultValue: "Preparation",
              })}
            </div>

            {dosageStr && (
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">
                  {t("modal.dosageLabel", {
                    ns: "teas",
                    defaultValue: "Dosage",
                  })}
                </span>
                <span className="font-medium">{dosageStr}</span>
              </div>
            )}

            {timeStr && (
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">
                  {t("modal.brewingTimeLabel", {
                    ns: "teas",
                    defaultValue: "Brewing time",
                  })}
                </span>
                <span className="font-medium">{timeStr}</span>
              </div>
            )}

            {tempStr && (
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 dark:text-gray-400">
                  {t("modal.brewTemperatureLabel", {
                    ns: "teas",
                    defaultValue: "Temperature",
                  })}
                </span>
                <span className="font-medium">{tempStr}</span>
              </div>
            )}
          </div>

          {safetyKey && (
            <div className="mt-4 rounded border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20 p-3">
              <div className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                {t("safety.heading", {
                  ns: "teas",
                  defaultValue: "Important notice",
                })}
              </div>
              <div className="text-sm mt-1">{t(safetyKey, { ns: "teas" })}</div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 p-2 border rounded text-center"
            />
            <button
              onClick={add}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {t("addToCart", { ns: "buttons", defaultValue: "Add to Cart" })}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold">
          {t("detail.reviews", { ns: "teas", defaultValue: "Reviews" })}
        </h2>
        <ProductReviews productId={tea.id} />
      </section>
    </main>
  );
}
