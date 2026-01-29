// src/components/TeaAdminLabelSheet.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import teaCatalogData from "@shared/teaCatalogData";
import ProductQRCode from "./ProductQRCode";

const getSafetyKey = (tea) => {
  const type = tea?.safetyNotice?.type;
  return type ? `safety.${type}` : null;
};

export default function TeaAdminLabelSheet({ ids = null }) {
  const { t } = useTranslation(["teas"]);

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
          {t("adminLabels.title", { defaultValue: "Tea Admin Label Sheet" })}
        </h1>
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          {t("adminLabels.print", { defaultValue: "Print" })}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((tea) => {
          const safetyKey = getSafetyKey(tea);
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

                  {tea.productCode && (
                    <div className="text-[11px] text-gray-700 mt-0.5">
                      {t("productCode", { defaultValue: "Product code" })}:{" "}
                      <span className="font-medium">{tea.productCode}</span>
                    </div>
                  )}

                  {tea.articleNo && (
                    <div className="text-xs text-gray-700 mt-0.5">
                      {t("modal.articleNoLabel", { defaultValue: "Article No." })}
                      : <span className="font-medium">{tea.articleNo}</span>
                    </div>
                  )}
                </div>

                <ProductQRCode
                  value={qrValue}
                  size={74}
                  label={tea.productCode || tea.id}
                />
              </div>

              <div className="text-xs text-gray-700 mt-2">
                {tea.description}
              </div>

              <div className="mt-2 text-xs space-y-0.5">
                {tea.originCountry && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("modal.originLabel", {
                        defaultValue: "Origin (country of production)",
                      })}
                    </span>
                    <span className="font-medium">{tea.originCountry}</span>
                  </div>
                )}
                {tea.productionYear && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("modal.productionYearLabel", {
                        defaultValue: "Production year",
                      })}
                    </span>
                    <span className="font-medium">{tea.productionYear}</span>
                  </div>
                )}
                {tea.bestBefore && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("modal.bestBeforeLabel", {
                        defaultValue: "Best before",
                      })}
                    </span>
                    <span className="font-medium">{tea.bestBefore}</span>
                  </div>
                )}
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
