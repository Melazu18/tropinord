import React from "react";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">{t("privacy.title")}</h1>

      <p className="mb-4">{t("privacy.effectiveDate")}</p>
      <p className="mb-4">{t("privacy.intro")}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section1.title")}
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>{t("privacy.section1.personalInfo")}</li>
        <li>{t("privacy.section1.technicalData")}</li>
        <li>{t("privacy.section1.thirdPartyData")}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section2.title")}
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        {t("privacy.section2.uses", { returnObjects: true }).map(
          (item, idx) => (
            <li key={idx}>{item}</li>
          )
        )}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section3.title")}
      </h2>
      <p
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: t("privacy.section3.description") }}
      />

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section4.title")}
      </h2>
      <p className="mb-4">{t("privacy.section4.description")}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section5.title")}
      </h2>
      <p className="mb-4">{t("privacy.section5.intro")}</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        {t("privacy.section5.rights", { returnObjects: true }).map(
          (item, idx) => (
            <li key={idx}>{item}</li>
          )
        )}
      </ul>
      <p className="mb-4">
        {t("privacy.section5.contact")}{" "}
        <a
          href="mailto:privacy@tropinord.com"
          className="text-blue-600 underline"
        >
          privacy@tropinord.com
        </a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section6.title")}
      </h2>
      <p className="mb-4">{t("privacy.section6.description")}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section7.title")}
      </h2>
      <p className="mb-4">{t("privacy.section7.description")}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section8.title")}
      </h2>
      <p className="mb-4">{t("privacy.section8.description")}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        {t("privacy.section9.title")}
      </h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("privacy.section9.contact"),
        }}
      />
    </div>
  );
};

export default Privacy;
