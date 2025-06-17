import React from "react";
import { useTranslation } from "react-i18next";

const FAQPage = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("faq.whatIsTropinord.q"),
      answer: t("faq.whatIsTropinord.a"),
    },
    {
      question: t("faq.productsOffered.q"),
      answer: t("faq.productsOffered.a"),
    },
    {
      question: t("faq.organicSourcing.q"),
      answer: t("faq.organicSourcing.a"),
    },
    {
      question: t("faq.plantMilk.q"),
      answer: t("faq.plantMilk.a"),
    },
    {
      question: t("faq.shipsFrom.q"),
      answer: t("faq.shipsFrom.a"),
    },
    {
      question: t("faq.shippingPolicy.q"),
      answer: t("faq.shippingPolicy.a"),
    },
    {
      question: t("faq.returnPolicy.q"),
      answer: t("faq.returnPolicy.a"),
    },
    {
      question: t("faq.contactSupport.q"),
      answer: t("faq.contactSupport.a"),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#146b39] dark:text-white">
        {t("faq.title")}
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow bg-white dark:bg-gray-800 transition-colors"
          >
            <h2 className="font-bold text-[#146b39] dark:text-white mb-2 text-lg">
              {faq.question}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
