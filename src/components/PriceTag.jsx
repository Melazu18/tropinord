// src/components/PriceTag.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { priceToDisplay } from "../utils/priceDisplay";
import { useCurrency } from "../shared/ui/CurrencyProvider";

export default function PriceTag({ product, className = "" }) {
  const { currency, priceFor, format } = useCurrency();
  const { showSale, current, original } = priceToDisplay(product);
  const { t } = useTranslation(["common"]);

  const currentInCur = priceFor({ ...product, price: current }, currency);
  const originalInCur = priceFor({ ...product, price: original }, currency);

  const isComingSoon = current === 0;

  if (isComingSoon) {
    return (
      <div className={`text-sm mb-2 ${className}`}>
        <div className="flex flex-col">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            {t("comingSoon")}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t("availableSoon")}
          </span>
        </div>
      </div>
    );
  }

  if (!Number.isFinite(currentInCur)) return null;

  return (
    <div className={`text-sm mb-2 text-black dark:text-white ${className}`}>
      {showSale ? (
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {format(currentInCur, currency)}
          </span>
          <span className="line-through opacity-70">
            {format(originalInCur, currency)}
          </span>
        </div>
      ) : (
        <span className="font-medium">{format(currentInCur, currency)}</span>
      )}
    </div>
  );
}
