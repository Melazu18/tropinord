import React from "react";
import { useTranslation } from "react-i18next";

const FAQPage = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("faq.whatisTropinord.q", { defaultValue: "What is TropiNord?" }),
      answer: t("faq.whatisTropinord.a", { defaultValue: "TropiNord is a brand that blends tropical traditions with Nordic quality, offering organic products like oils, natural skincare, and more. We will also be expanding into plant-based milk in the near future." }),
    },
    {
      question: t("faq.productsOffered.q", { defaultValue: "What kind of products do you offer?" }),
      answer: t("faq.productsOffered.a", { defaultValue: "We offer organic oils, traditional African soaps, agro-imports, and eco-packaging. All our products are ethically sourced and support small producers." }),
    },
    {
      question: t("faq.organicSourcing.q", { defaultValue: "Are your products really organic?" }),
      answer: t("faq.organicSourcing.a", { defaultValue: "Yes, we focus on cold-pressed, unrefined, and organically grown ingredients. We work with cooperatives that follow organic and sustainable farming practices." }),
    },
    {
      question: t("faq.plantMilk.q", { defaultValue: "Do you offer plant-based milk?" }),
      answer: t("faq.plantMilk.a", { defaultValue: "Not yet, but we're developing a line of tropical plant-based milk alternatives sourced from Africa, coming soon!" }),
    },
    {
      question: t("faq.shipsFrom.q", { defaultValue: "Where do you ship from?" }),
      answer: t("faq.shipsFrom.a", { defaultValue: "We ship from our logistics base in Sweden and serve customers across the EU." }),
    },
    {
      question: t("faq.shippingPolicy.q", { defaultValue: "What's your shipping policy?" }),
      answer: t("faq.shippingPolicy.a", { defaultValue: "Orders are processed in 1–3 business days. Within Sweden: delivery in 2–5 days. International: 7–21 days. Fees and tracking info are provided at checkout. International customers are responsible for duties and taxes." }),
    },
    {
      question: t("faq.returnPolicy.q", { defaultValue: "What's your return policy?" }),
      answer: t("faq.returnPolicy.a", { defaultValue: "You can return items within 14 days of delivery if unused and in original packaging. Personal care or perishable goods can't be returned unless faulty. Contact support@tropinord.com to initiate a return." }),
    },
    {
      question: t("faq.contactSupport.q", { defaultValue: "How can I contact customer support?" }),
      answer: t("faq.contactSupport.a", { defaultValue: "You can reach us via our contact form or email info@tropinord.com. We aim to respond within 24–48 hours." }),
    },
  ];

  return (
    <main className="pt-36">
      {" "}
      {/* Add this padding-top to account for the fixed header */}
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#146b39] dark:text-white">
          {t("faq.title", { defaultValue: "Frequently Asked Questions" })}
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
    </main>
  );
};

export default FAQPage;
