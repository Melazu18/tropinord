// src/components/Tagline.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function Tagline({ className = "" }) {
  // hero first (where your key lives), then header/common as fallback
  const { t } = useTranslation(["hero", "header", "common"]);
  return (
    <p
      className={`text-green-600 dark:text-green-300 italic mt-2 ${className}`}
    >
      {t("tagline", { defaultValue: "Nature remembers — and so do we." })}
    </p>
  );
}
