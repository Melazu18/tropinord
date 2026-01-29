import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import oilCatalogData from "../shared/oilCatalogData";
import { nameT, descT } from "../utils/i18nProductHelpers";

const meta = {
  "oil-coconut": { scent: "coconut", skinType: "normal", organic: true, coldPressed: true, typeOfUse: "both" },
  "oil-coconut-heat": { scent: "coconut", skinType: "normal", organic: true, coldPressed: false, typeOfUse: "both" },
  "oil-castor": { scent: "neutral", skinType: "all", organic: true, coldPressed: true, typeOfUse: "external" },
  "oil-moringa-seed": { scent: "neutral", skinType: "dry", organic: true, coldPressed: true, typeOfUse: "external" },
  "oil-palm-kernel": { scent: "nutty", skinType: "very-dry", organic: true, coldPressed: true, typeOfUse: "both" },
  "oil-avocado": { scent: "neutral", skinType: "dry", organic: true, coldPressed: true, typeOfUse: "both" },
  "butter-shea": { scent: "nutty", skinType: "dry", organic: true, coldPressed: false, typeOfUse: "external" },
  "oil-black-seed": { scent: "neutral", skinType: "all", organic: true, coldPressed: true, typeOfUse: "external" },
  "oil-lavender": { scent: "neutral", skinType: "all", organic: true, coldPressed: false, typeOfUse: "external" },
  "oil-rosemary": { scent: "neutral", skinType: "all", organic: true, coldPressed: false, typeOfUse: "external" },
  "oil-mint": { scent: "minty", skinType: "sensitive", organic: true, coldPressed: false, typeOfUse: "external" },
  "moringa-balm": { scent: "minty", skinType: "sensitive", organic: true, coldPressed: false, typeOfUse: "external" },
};

const typeLabel = (t, typeOfUse) => {
  if (typeOfUse === "both")
    return t("usageBadges.both", { ns: "oil", defaultValue: "Cooking & External Use" });
  if (typeOfUse === "cooking")
    return t("usageBadges.cooking", { ns: "oil", defaultValue: "Cooking Oil" });
  return t("usageBadges.external", { ns: "oil", defaultValue: "External Use Only" });
};

const skinLabel = (t, skinType) => {
  if (!skinType) return "";
  if (skinType === "very-dry") return t("filters.veryDry", { ns: "oil", defaultValue: "Very dry" });
  if (skinType === "dry") return t("filters.dry", { ns: "oil", defaultValue: "Dry" });
  if (skinType === "sensitive") return t("filters.sensitive", { ns: "oil", defaultValue: "Sensitive" });
  if (skinType === "normal") return t("filters.normal", { ns: "oil", defaultValue: "Normal" });
  if (skinType === "all") return t("filters.all", { ns: "oil", defaultValue: "All" });
  return skinType;
};

const scentLabel = (t, scent) => {
  if (!scent) return "";
  if (scent === "neutral") return t("filters.neutral", { ns: "oil", defaultValue: "Neutral" });
  if (scent === "nutty") return t("filters.nutty", { ns: "oil", defaultValue: "Nutty" });
  if (scent === "coconut") return t("filters.coconut", { ns: "oil", defaultValue: "Coconut" });
  if (scent === "minty") return t("filters.minty", { ns: "oil", defaultValue: "Minty" });
  return scent;
};

const yesNo = (t, value) =>
  value
    ? t("adminLabels.yes", { ns: "oil", defaultValue: "Yes" })
    : t("adminLabels.no", { ns: "oil", defaultValue: "No" });

export default function OilsLabelSheet({ ids = null }) {
  const { t } = useTranslation(["oil", "common", "products.oils"]);

  const items = useMemo(() => {
    const all = Object.values(oilCatalogData || {});
    if (Array.isArray(ids) && ids.length) return all.filter((x) => ids.includes(x.id));
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
          {t("adminLabels.title", { ns: "oil", defaultValue: "Public Product Labels" })}
        </h1>
        <button
          onClick={() => window.print()}
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          {t("adminLabels.print", { ns: "oil", defaultValue: "Print" })}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((p) => {
          const m = meta[p.id] || {};

          return (
            <div key={p.id} className="border border-gray-300 rounded p-3 break-inside-avoid">
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-base leading-tight">
                  {nameT(t, "products.oils", p.id, p.name)}
                </div>
                {p.articleNo && (
                  <div className="text-xs text-gray-700">
                    {t("modal.articleNoLabel", { ns: "oil", defaultValue: "Article No." })}:{" "}
                    <span className="font-medium">{p.articleNo}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-700 mt-1">
                {descT(t, "products.oils", p.id, p.description)}
              </div>

              <div className="mt-2 text-xs space-y-0.5">
                {p.productCode && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("productCode", { ns: "oil", defaultValue: "Product Code" })}
                    </span>
                    <span className="font-medium">{p.productCode}</span>
                  </div>
                )}

                {!!m.typeOfUse && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("adminLabels.usage", { ns: "oil", defaultValue: "Usage" })}
                    </span>
                    <span className="font-medium">{typeLabel(t, m.typeOfUse)}</span>
                  </div>
                )}

                {!!m.skinType && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("filters.skinType", { ns: "oil", defaultValue: "Skin Type" })}
                    </span>
                    <span className="font-medium">{skinLabel(t, m.skinType)}</span>
                  </div>
                )}

                {!!m.scent && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("filters.scent", { ns: "oil", defaultValue: "Scent" })}
                    </span>
                    <span className="font-medium">{scentLabel(t, m.scent)}</span>
                  </div>
                )}

                {m.organic != null && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("adminLabels.organic", { ns: "oil", defaultValue: "Organic" })}
                    </span>
                    <span className="font-medium">{yesNo(t, !!m.organic)}</span>
                  </div>
                )}

                {m.coldPressed != null && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("adminLabels.coldPressed", { ns: "oil", defaultValue: "Cold-pressed" })}
                    </span>
                    <span className="font-medium">{yesNo(t, !!m.coldPressed)}</span>
                  </div>
                )}

                {p.originCountry && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("modal.originLabel", { ns: "oil", defaultValue: "Origin" })}
                    </span>
                    <span className="font-medium">{p.originCountry}</span>
                  </div>
                )}

                {p.productionYear && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("modal.productionYearLabel", { ns: "oil", defaultValue: "Production year" })}
                    </span>
                    <span className="font-medium">{p.productionYear}</span>
                  </div>
                )}

                {p.bestBefore && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-700">
                      {t("modal.bestBeforeLabel", { ns: "oil", defaultValue: "Best before" })}
                    </span>
                    <span className="font-medium">{p.bestBefore}</span>
                  </div>
                )}
              </div>

              {p.ingredients && (
                <div className="mt-2 text-xs">
                  <div className="font-semibold mb-1">
                    {t("modal.ingredientsHeading", { ns: "oil", defaultValue: "Ingredients (INCI)" })}
                  </div>
                  <div className="text-gray-800">
                    {Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients}
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
