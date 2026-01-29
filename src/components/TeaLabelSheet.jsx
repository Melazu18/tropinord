// src/components/TeaLabelSheet.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import teaCatalogData from "@shared/teaCatalogData";
import ProductQRCode from "./ProductQRCode";

// --- unit logic (same behavior as TeaPage) ---
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
      amount: d.amount,
      unit: d.unit,
      volume: d.volumeMl,
      defaultValue: "{{amount}} {{unit}} (per {{volume}} ml)",
    });
  }
  const flOz = formatNumber(mlToFlOz(d.volumeMl), { maxDecimals: 1 });
  return t("brew.dosageImperial", {
    amount: d.amount,
    unit: d.unit,
    volume: flOz,
    defaultValue: "{{amount}} {{unit}} (per {{volume}} fl oz)",
  });
};

const formatBrewingTime = (t, bt) => {
  if (!bt) return null;
  if (bt.min && bt.max) {
    return t("brew.timeRange", {
      min: bt.min,
      max: bt.max,
      unit: bt.unit,
      defaultValue: "{{min}}–{{max}} {{unit}}",
    });
  }
  return t("brew.timeSingle", {
    value: bt.min,
    unit: bt.unit,
    defaultValue: "{{value}} {{unit}}",
  });
};

const formatTemperature = (t, i18n, temp) => {
  if (!temp) return null;
  const imperial = isImperialLocale(i18n?.language || "en");
  if (!imperial) {
    return t("brew.temperatureC", {
      value: temp.value,
      defaultValue: "{{value}}°C",
    });
  }
  const f = formatNumber(cToF(temp.value), { maxDecimals: 0 });
  return t("brew.temperatureF", { value: f, defaultValue: "{{value}}°F" });
};

export default function TeaLabelSheet({ ids = null }) {
  const { t, i18n } = useTranslation(["teas"]);

  const items = useMemo(() => {
    const all = Object.values(teaCatalogData || {});
    const filtered =
      Array.isArray(ids) && ids.length
        ? all.filter((x) => ids.includes(x.id))
        : all;
    return filtered;
  }, [ids]);

  return (
    <div className="bg-white text-black">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print flex items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold">
          {t("labels.title", { defaultValue: "Tea Label Sheet" })}
        </h1>
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          {t("labels.print", { defaultValue: "Print" })}
        </button>
      </div>

      {/* A4-friendly label grid */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((tea) => {
          const dosageStr = formatDosage(t, i18n, tea.dosage);
          const timeStr = formatBrewingTime(t, tea.brewingTime);
          const tempStr = formatTemperature(t, i18n, tea.brewTemperature);

          // ✅ Encode productCode (best). Fallback if missing.
          const qrValue = tea.productCode || tea.id || tea.slug;

          return (
            <div
              key={tea.id}
              className="border border-gray-300 rounded p-3 break-inside-avoid"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-base leading-tight">
                    {tea.name}
                  </div>

                  {/* ✅ show product code as text too */}
                  {tea.productCode && (
                    <div className="text-[11px] text-gray-700 mt-0.5">
                      {t("productCode", { defaultValue: "Product code" })}:{" "}
                      <span className="font-medium">{tea.productCode}</span>
                    </div>
                  )}
                </div>

                {/* ✅ QR code */}
                <ProductQRCode
                  value={qrValue}
                  size={74}
                  label={tea.productCode || tea.id}
                />
              </div>

              <div className="text-xs text-gray-700 mt-2">
                {tea.description}
              </div>

              <div className="mt-2 text-xs">
                <div className="font-semibold mb-1">
                  {t("labels.preparation", { defaultValue: "Preparation" })}
                </div>
                <div className="space-y-0.5">
                  {dosageStr && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-700">
                        {t("modal.dosageLabel", { defaultValue: "Dosage" })}
                      </span>
                      <span className="font-medium">{dosageStr}</span>
                    </div>
                  )}
                  {timeStr && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-700">
                        {t("modal.brewingTimeLabel", {
                          defaultValue: "Brewing Time",
                        })}
                      </span>
                      <span className="font-medium">{timeStr}</span>
                    </div>
                  )}
                  {tempStr && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-700">
                        {t("modal.brewTemperatureLabel", {
                          defaultValue: "Brew Temperature",
                        })}
                      </span>
                      <span className="font-medium">{tempStr}</span>
                    </div>
                  )}
                  {tea.flavouring && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-700">
                        {t("modal.flavouringLabel", {
                          defaultValue: "Flavouring",
                        })}
                      </span>
                      <span className="font-medium">{tea.flavouring}</span>
                    </div>
                  )}
                  {tea.flavour && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-700">
                        {t("modal.flavourLabel", { defaultValue: "Flavour" })}
                      </span>
                      <span className="font-medium">
                        {Array.isArray(tea.flavour)
                          ? tea.flavour.join(", ")
                          : tea.flavour}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {tea.ingredients && (
                <div className="mt-2 text-xs">
                  <div className="font-semibold mb-1">
                    {t("modal.ingredientsHeading", {
                      defaultValue: "Ingredients",
                    })}
                  </div>
                  <div className="text-gray-800">
                    {Array.isArray(tea.ingredients)
                      ? tea.ingredients.join(", ")
                      : tea.ingredients}
                  </div>
                </div>
              )}

              {tea.importantNotice && (
                <div className="mt-2 text-xs border border-gray-300 rounded p-2">
                  <div className="font-semibold">
                    {t("modal.importantNoticeHeading", {
                      defaultValue: "Important Notice",
                    })}
                  </div>
                  <div className="text-gray-800 mt-0.5">
                    {tea.importantNotice}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
