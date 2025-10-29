import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const infoCollected = t("privacy.section1", { returnObjects: true });
  const infoUsage = t("privacy.section2.uses", { returnObjects: true });
  const userRights = t("privacy.section5.rights", { returnObjects: true });

  return (
    <main className="pt-36 px-4 pb-8 max-w-5xl mx-auto text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6">
        {t("privacy.title", { defaultValue: "Privacy Policy" })}
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        {t("privacy.effectiveDate")}
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {infoCollected.title}
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>{infoCollected.personalInfo}</li>
          <li>{infoCollected.technicalData}</li>
          <li>{infoCollected.thirdPartyData}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section2.title")}
        </h2>
        <ul className="list-disc list-inside space-y-2">
          {Array.isArray(infoUsage) &&
            infoUsage.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section3.title")}
        </h2>
        <p>{t("privacy.section3.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section4.title")}
        </h2>
        <p>{t("privacy.section4.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section5.title")}
        </h2>
        <p className="mb-4">{t("privacy.section5.intro")}</p>
        <ul className="list-disc list-inside space-y-2">
          {Array.isArray(userRights) &&
            userRights.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
        <p className="mt-4">{t("privacy.section5.contact")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section6.title")}
        </h2>
        <p>{t("privacy.section6.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section7.title")}
        </h2>
        <p>{t("privacy.section7.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section8.title")}
        </h2>
        <p>{t("privacy.section8.description")}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
          {t("privacy.section9.title")}
        </h2>
        <p dangerouslySetInnerHTML={{ __html: t("privacy.section9.contact") }} />
      </section>
    </main>
  );
};

export default PrivacyPolicy;
