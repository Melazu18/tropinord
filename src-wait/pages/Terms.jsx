import React from "react";
import { useTranslation } from "react-i18next";

const TermsOfService = () => {
  const { t } = useTranslation();

  const sections = t("terms.sections", { returnObjects: true });

  return (
    <main className="pt-36 px-4 pb-8 max-w-5xl mx-auto text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6">
        {t("terms.title", { defaultValue: "Terms of Service" })}
      </h1>

      <section className="mb-8">
        <p
          className="mb-6"
          dangerouslySetInnerHTML={{ __html: t("terms.intro", { defaultValue: "Welcome to TropiNord. By accessing or using our services, you agree to comply with and be bound by the following terms and conditions." }) }}
        />
      </section>

      {Object.entries(sections).map(([key, section]) => (
        <section key={key} className="mb-8">
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
            {section.title}
          </h2>

          {section.intro && (
            <p
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: section.intro }}
            />
          )}

          {section.content && !Array.isArray(section.content) && (
            <p
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}

          {Array.isArray(section.content) && (
            <ul className="list-disc list-inside space-y-2 mb-4">
              {section.content.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          )}

          {section.paymentMethods && (
            <>
              <h3 className="text-lg font-semibold mb-2">
                {t("terms.paymentMethodsTitle", { defaultValue: "Accepted Payment Methods" })}
              </h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                {section.paymentMethods.map((method, idx) => (
                  <li key={idx}>{method}</li>
                ))}
              </ul>
            </>
          )}

          {(section.email || section.phone) && (
            <div className="mt-4">
              {section.email && (
                <p className="mb-2">
                  <span className="font-semibold">
                    {t("terms.contact.emailLabel", { defaultValue: "Email" })}:
                  </span>{" "}
                  <a
                    href={`mailto:${section.email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {section.email}
                  </a>
                </p>
              )}
              {section.phone && (
                <p>
                  <span className="font-semibold">
                    {t("terms.contact.phoneLabel", { defaultValue: "Phone" })}:
                  </span>{" "}
                  {section.phone}
                </p>
              )}
            </div>
          )}
        </section>
      ))}
    </main>
  );
};

export default TermsOfService;
