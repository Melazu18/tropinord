import React from "react";
import { useTranslation } from "react-i18next";

const Shipping = () => {
  const { t } = useTranslation();

  const shippingPoints = t("shipping.points", { returnObjects: true });
  const returnPoints = t("shipping.returnPoints", { returnObjects: true });

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">{t("shipping.title")}</h1>

      <h2 className="text-xl font-semibold mt-4 mb-2">
        {t("shipping.policyTitle")}
      </h2>
      <p className="mb-4">{t("shipping.intro")}</p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        {Array.isArray(shippingPoints) &&
          shippingPoints.map((point, idx) => <li key={idx}>{point}</li>)}
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">
        {t("shipping.returnsTitle")}
      </h2>
      <p className="mb-4">{t("shipping.returnsIntro")}</p>
      <ul className="list-disc list-inside space-y-2">
        {Array.isArray(returnPoints) &&
          returnPoints.map((point, idx) => <li key={idx}>{point}</li>)}
      </ul>

      <p className="mt-6">{t("shipping.closing")}</p>
    </div>
  );
};

export default Shipping;
