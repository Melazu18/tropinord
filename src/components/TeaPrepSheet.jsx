// src/components/TeaPrepSheet.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import teaCatalogData from "@shared/teaCatalogData";

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
  if (!imperial)
    return t("brew.temperatureC", {
      value: temp.value,
      defaultValue: "{{value}}°C",
    });
  const f = formatNumber(cToF(temp.value), { maxDecimals: 0 });
  return t("brew.temperatureF", { value: f, defaultValue: "{{value}}°F" });
};

const getSafetyKey = (tea) => {
  const type = tea?.safetyNotice?.type;
  return type ? `safety.${type}` : null;
};

export default function TeaPrepSheet({ ids = null }) {
  const { t, i18n } = useTranslation(["teas"]);

  const items = useMemo(() => {
    const all = Object.values(teaCatalogData || {});
    if (Array.isArray(ids) && ids.length)
      return all.filter((x) => ids.includes(x.id));
    return all;
  }, [ids]);

  return (
    <div className="bg-white text-black">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print flex items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold">
          {t("prepSheet.title", { defaultValue: "Tea Preparation Sheet" })}
        </h1>
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          {t("prepSheet.print", { defaultValue: "Print" })}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((tea) => {
          const dosageStr = formatDosage(t, i18n, tea.dosage);
          const timeStr = formatBrewingTime(t, tea.brewingTime);
          const tempStr = formatTemperature(t, i18n, tea.brewTemperature);
          const safetyKey = getSafetyKey(tea);

          return (
            <div
              key={tea.id}
              className="border border-gray-300 rounded p-3 break-inside-avoid"
            >
              <div className="font-bold text-base leading-tight">
                {tea.name}
              </div>
              <div className="text-xs text-gray-700 mt-1">
                {tea.description}
              </div>

              <div className="mt-2 text-xs">
                <div className="font-semibold mb-1">
                  {t("prepSheet.preparation", { defaultValue: "Preparation" })}
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

              {safetyKey && (
                <div className="mt-2 text-xs border border-amber-200 bg-amber-50 rounded p-2">
                  <div className="font-semibold">
                    {t("safety.heading", { defaultValue: "Important notice" })}
                  </div>
                  <div className="mt-0.5">{t(safetyKey)}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
