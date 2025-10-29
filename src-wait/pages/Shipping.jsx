import React from "react";
import { useTranslation } from "react-i18next";

const Shipping = () => {
  const { t } = useTranslation();

  const shippingPoints = t("shipping.points", { returnObjects: true });
  const returnPoints = t("shipping.returnPoints", { returnObjects: true });
  const serviceProviders = t("shipping.serviceProviders", {
    returnObjects: true,
  });
  const faqList = t("shipping.faqList", { returnObjects: true });

  return (
    <main className="pt-36 px-4 pb-8 max-w-5xl mx-auto text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6">
        {t("shipping.title", { defaultValue: "Shipping & Returns Policy" })}
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          {t("shipping.policyTitle", { defaultValue: "Shipping Policy" })}
        </h2>
        <p className="mb-4">{t("shipping.intro", { defaultValue: "We strive to process and ship all orders within 1-2 business days. Here's what you need to know about our shipping:" })}</p>
        <ul className="list-disc list-inside space-y-2">
          {Array.isArray(shippingPoints) &&
            shippingPoints.map((point, idx) => <li key={idx}>{point}</li>)}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          {t("shipping.servicesTitle", { defaultValue: "Shipping Services" })}
        </h2>
        <p className="mb-4">{t("shipping.servicesIntro", { defaultValue: "We partner with reliable logistics providers to ensure safe and timely deliveries:" })}</p>
        <ul className="list-disc list-inside space-y-2">
          {Array.isArray(serviceProviders) &&
            serviceProviders.map((provider, idx) => (
              <li key={idx}>{provider}</li>
            ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          {t("shipping.returnsTitle", { defaultValue: "Returns & Refunds" })}
        </h2>
        <p className="mb-4">{t("shipping.returnsIntro", { defaultValue: "We want you to be fully satisfied with your purchase. Our return policy:" })}</p>
        <ul className="list-disc list-inside space-y-2">
          {Array.isArray(returnPoints) &&
            returnPoints.map((point, idx) => <li key={idx}>{point}</li>)}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          {t("shipping.faqTitle", { defaultValue: "Frequently Asked Questions" })}
        </h2>
        <p className="mb-4">{t("shipping.faqIntro", { defaultValue: "Common questions about shipping and returns:" })}</p>
        <ul className="list-disc list-inside space-y-2">
          {Array.isArray(faqList) &&
            faqList.map((faq, idx) => <li key={idx}>{faq}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
          {t("shipping.contactTitle", { defaultValue: "Need Help? Contact Us" })}
        </h2>
        <p className="mb-2">
          {t("shipping.emailLabel", { defaultValue: "Email" })}:{" "}
          <a
            href={`mailto:${t("shipping.supportEmail", { defaultValue: "support@tropinord.com" })}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("shipping.supportEmail", { defaultValue: "support@tropinord.com" })}
          </a>
        </p>
        <p className="mb-2">
          {t("shipping.phoneLabel", { defaultValue: "Phone/WhatsApp" })}: {t("shipping.phoneNumber", { defaultValue: "+46700711713" })}
        </p>
        <p>{t("shipping.supportHours", { defaultValue: "Customer support available Monday-Friday, 9AM-5PM CET" })}</p>
      </section>
    </main>
  );
};

export default Shipping;
