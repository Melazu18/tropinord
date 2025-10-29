// src/pages/ApplyToSell.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMe } from "../hooks/useMe";
import ArtisanApplication from "../components/artisan/ArtisanApplication";
import { useNavigate, useLocation } from "react-router-dom";
import { getLocalizedPath } from "../utils/getLocalizedPath";

const ApplyToSell = () => {
  const [submitted, setSubmitted] = useState(false);

  // ✅ Load the 'artisan' namespace so page-level copy translates
  const { t, i18n } = useTranslation("artisan");

  const { me, loading } = useMe();
  const navigate = useNavigate();
  const location = useLocation();

  // Only redirect unauthenticated users AFTER loading completes
  useEffect(() => {
    if (loading) return;
    if (!me) {
      const lang = (i18n.language || "en").slice(0, 2);
      const loginPath = getLocalizedPath("login", lang);
      const currentFull =
        (location?.pathname || "") +
        (location?.search || "") +
        (location?.hash || "");
      navigate(
        {
          pathname: loginPath,
          search: `?next=${encodeURIComponent(currentFull)}`,
        },
        { replace: true }
      );
    }
  }, [
    me,
    loading,
    navigate,
    i18n.language,
    location?.pathname,
    location?.search,
    location?.hash,
  ]);

  const handleSuccess = () => setSubmitted(true);

  // While resolving auth / or redirecting, render nothing
  if (loading || !me) return null;

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <h2 className="text-2xl font-bold mb-2">
          {t("apply.successTitle", {
            defaultValue: "Application Submitted Successfully! 🎉",
          })}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {t("apply.successMessage", {
            defaultValue:
              "Your artisan application has been received and is under review. We'll notify you once it has been processed.",
          })}
        </p>
        <button
          onClick={() =>
            navigate(getLocalizedPath("dashboard", i18n.language || "en"))
          }
          className="mt-6 inline-flex px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("apply.viewStatus", { defaultValue: "View Application Status" })}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-bold mb-2">
        {t("apply.title", { defaultValue: "Become a TropiNord Artisan" })}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        {t("apply.description", {
          defaultValue:
            "Join our community of local artisans and showcase your handmade products to the world.",
        })}
      </p>

      <ArtisanApplication onSuccess={handleSuccess} />
    </div>
  );
};

export default ApplyToSell;
