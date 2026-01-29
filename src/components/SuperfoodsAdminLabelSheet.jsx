import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import superfoodsCatalog from "../shared/superfoodsCatalogData";

export default function SuperfoodsAdminLabelSheet({ ids = null }) {
  const { t } = useTranslation(["superfoods", "common"]);

  const items = useMemo(() => {
    const all = Object.values(superfoodsCatalog || {});
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
          {t("adminLabels.title", {
            defaultValue: "Superfoods Admin Label Sheet",
          })}
        </h1>
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          {t("adminLabels.print", { defaultValue: "Print" })}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="border border-gray-300 rounded p-3 break-inside-avoid"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold text-base leading-tight">{p.name}</div>
              <div className="text-[11px] text-gray-700 text-right">
                <div>
                  ID: <span className="font-medium">{p.id}</span>
                </div>
                {p.articleNo && (
                  <div>
                    {t("modal.articleNoLabel", { defaultValue: "Article No." })}
                    : <span className="font-medium">{p.articleNo}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-700 mt-1">{p.description}</div>

            <div className="mt-2 text-xs space-y-0.5">
              {p.originCountry && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-700">originCountry</span>
                  <span className="font-medium">{p.originCountry}</span>
                </div>
              )}
              {p.productionYear && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-700">productionYear</span>
                  <span className="font-medium">{p.productionYear}</span>
                </div>
              )}
              {p.bestBefore && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-700">bestBefore</span>
                  <span className="font-medium">{p.bestBefore}</span>
                </div>
              )}
              {p.naturallyGrown != null && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-700">naturallyGrown</span>
                  <span className="font-medium">
                    {String(p.naturallyGrown)}
                  </span>
                </div>
              )}
            </div>

            {p.ingredients && (
              <div className="mt-2 text-xs">
                <div className="font-semibold mb-1">ingredients</div>
                <div className="text-gray-800">
                  {Array.isArray(p.ingredients)
                    ? p.ingredients.join(", ")
                    : p.ingredients}
                </div>
              </div>
            )}

            {Array.isArray(p.benefits) && p.benefits.length > 0 && (
              <div className="mt-2 text-xs">
                <div className="font-semibold mb-1">benefits</div>
                <div className="text-gray-800">{p.benefits.join(" • ")}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
