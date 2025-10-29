import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import productImages from "../data/productImages";
import AgroContactForm from "../components/AgroContactForm";

export default function AgroProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("agro");
  const lang = i18n.language || "en";

  const allAgroItems = productImages.agro?.Items || [];
  const product = allAgroItems.find((item) => item.slug === slug);

  if (!product) {
    return (
      <div className="pt-36 text-center text-red-600 text-xl font-semibold">
        {t("items.notFound", {
          defaultValue: "Product not found",
        })}
      </div>
    );
  }

  const {
    image,
    label,
    description,
    botanicalName,
    family,
    origin,
    history,
    usage,
    benefits,
    sideEffects,
    productionDate,
    bestBefore,
  } = product;

  const title = t(`items.${slug}.title`, {
    defaultValue: label,
  });

  const localizedDescription = t(`items.${slug}.description`, {
    defaultValue:
      description ||
      t("items.noDescription", {
        defaultValue: "No detailed description available.",
      }),
  });

  const backTo = location?.state?.from || `/${lang}/agro`;

  return (
    <main className="pt-36 pb-20 px-4 max-w-6xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={image}
            alt={label}
            className="w-full h-auto object-cover rounded-lg shadow"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-3">{title}</h1>

          {localizedDescription && (
            <p className="text-lg mb-4">{localizedDescription}</p>
          )}
          {botanicalName && (
            <p className="mb-2">
              <strong>
                {t("fields.botanicalName", { defaultValue: "Botanical Name" })}:
              </strong>{" "}
              {botanicalName}
            </p>
          )}
          {family && (
            <p className="mb-2">
              <strong>{t("fields.family", { defaultValue: "Family" })}:</strong>{" "}
              {family}
            </p>
          )}
          {origin && (
            <p className="mb-2">
              <strong>{t("fields.origin", { defaultValue: "Origin" })}:</strong>{" "}
              {origin}
            </p>
          )}
          {history && (
            <p className="mb-2">
              <strong>
                {t("fields.history", { defaultValue: "History" })}:
              </strong>{" "}
              {history}
            </p>
          )}
          {usage && (
            <p className="mb-2">
              <strong>{t("fields.usage", { defaultValue: "Usage" })}:</strong>{" "}
              {usage}
            </p>
          )}
          {benefits && (
            <p className="mb-2">
              <strong>
                {t("fields.benefits", { defaultValue: "Benefits" })}:
              </strong>{" "}
              {benefits}
            </p>
          )}
          {sideEffects && (
            <p className="mb-2">
              <strong>
                {t("fields.sideEffects", { defaultValue: "Side Effects" })}:
              </strong>{" "}
              {sideEffects}
            </p>
          )}
          {productionDate && (
            <p className="mb-2">
              <strong>
                {t("fields.productionDate", {
                  defaultValue: "Production Date",
                })}
                :
              </strong>{" "}
              {productionDate}
            </p>
          )}
          {bestBefore && (
            <p className="mb-2">
              <strong>
                {t("fields.bestBefore", { defaultValue: "Best Before" })}:
              </strong>{" "}
              {bestBefore}
            </p>
          )}

          <p className="text-green-600 font-semibold my-6">
            {t("priceLabel", { defaultValue: "Price" })}:{" "}
            {t("contactForPricing", {
              defaultValue: "Contact for pricing",
            })}
          </p>

          <button
            onClick={() => navigate(backTo)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition mb-6"
          >
            ←{" "}
            {t("buttons.backToProducts", { defaultValue: "Back to Products" })}
          </button>

          {/* Inquiry Form */}
          <AgroContactForm product={product} />
        </div>
      </div>
    </main>
  );
}
