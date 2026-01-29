import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import coffeeCatalogData from "../shared/coffeeCatalogData";

export default function CoffeeLabelSheet({ ids = null }) {
  const { t } = useTranslation(["coffee", "common"]);

  const items = useMemo(() => {
    const all = Object.values(coffeeCatalogData || {});
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
          {t("labels.title", {
            ns: "coffee",
            defaultValue: "Coffee Label Sheet",
          })}
        </h1>
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          {t("labels.print", { ns: "coffee", defaultValue: "Print" })}
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
              {p.articleNo && (
                <div className="text-xs text-gray-700">
                  {t("modal.articleNoLabel", {
                    ns: "coffee",
                    defaultValue: "Article No.",
                  })}
                  : <span className="font-medium">{p.articleNo}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-700 mt-1">{p.description}</div>

            {p.ingredients && (
              <div className="mt-2 text-xs">
                <div className="font-semibold mb-1">
                  {t("modal.ingredientsHeading", {
                    ns: "coffee",
                    defaultValue: "Ingredients",
                  })}
                </div>
                <div className="text-gray-800">
                  {Array.isArray(p.ingredients)
                    ? p.ingredients.join(", ")
                    : p.ingredients}
                </div>
              </div>
            )}

            {p.importantNotice && (
              <div className="mt-2 text-xs border border-gray-300 rounded p-2">
                <div className="font-semibold">
                  {t("modal.importantNoticeHeading", {
                    ns: "coffee",
                    defaultValue: "Important Notice",
                  })}
                </div>
                <div className="text-gray-800 mt-0.5">{p.importantNotice}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
