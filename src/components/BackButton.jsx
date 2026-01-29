import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "../utils/getLocalizedPath";

export default function BackButton({
  fallbackRouteKey = "tea",
  className = "text-sm text-green-700 hover:underline dark:text-green-300",
  label,
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["common"]);
  const lang2 = (i18n.language || "en").slice(0, 2);

  const onBack = () => {
    // If user actually navigated here from within the app, go back in history.
    if (window.history.length > 2) {
      navigate(-1);
      return;
    }
    // If user opened this page directly, use a localized fallback.
    navigate(getLocalizedPath(fallbackRouteKey, lang2), { replace: true });
  };

  return (
    <button type="button" onClick={onBack} className={className}>
      {label || t("back", { defaultValue: "← Back" })}
    </button>
  );
}
