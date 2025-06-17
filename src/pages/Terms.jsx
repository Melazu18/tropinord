import React from "react";
import { useTranslation } from "react-i18next";

const TermsOfService = () => {
  const { t } = useTranslation();

  const sections = t("terms.sections", { returnObjects: true });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">{t("terms.title")}</h1>

      <p
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: t("terms.intro") }}
      />

      {Object.entries(sections).map(([key, section]) => (
        <div key={key}>
          <h2 className="text-2xl font-semibold mt-6 mb-2">{section.title}</h2>

          {section.intro && <p className="mb-4">{section.intro}</p>}

          {section.content && !Array.isArray(section.content) && (
            <p
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}

          {Array.isArray(section.content) && (
            <ul className="list-disc list-inside mb-4">
              {section.content.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          )}

          {section.paymentMethods && (
            <ul className="list-disc list-inside mb-4">
              {section.paymentMethods.map((method, idx) => (
                <li key={idx}>{method}</li>
              ))}
            </ul>
          )}

          {(section.email || section.phone) && (
            <div className="mb-4">
              {section.email && (
                <p>
                  <strong>{t("terms.sections.contact.email")}</strong>
                </p>
              )}
              {section.phone && (
                <p>
                  <strong>{t("terms.sections.contact.phone")}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TermsOfService;
