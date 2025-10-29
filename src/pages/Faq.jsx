// src/pages/FAQ.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const FAQPage = () => {
  const { t } = useTranslation();

  const faqs = [
    // Brand & focus
    {
      question: t("faq.whatisTropinord.q", {
        defaultValue: "What is TropiNord?",
      }),
      answer: t("faq.whatisTropinord.a", {
        defaultValue:
          "TropiNord blends tropical traditions with Nordic quality. We now focus on a simple, curated range: natural oils and teas sourced from tropical regions—especially across Africa.",
      }),
    },
    {
      question: t("faq.productsOffered.q", {
        defaultValue: "What kind of products do you offer?",
      }),
      answer: t("faq.productsOffered.a", {
        defaultValue:
          "Our core lineup is high-quality, ethically sourced oils (for skin, hair, and culinary use) and single-origin/hand-crafted teas (herbal, green, black, and specialty blends).",
      }),
    },

    // Sourcing & quality
    {
      question: t("faq.organicSourcing.q", {
        defaultValue: "Are your products really organic or natural?",
      }),
      answer: t("faq.organicSourcing.a", {
        defaultValue:
          "We prioritize cold-pressed, unrefined oils and naturally grown botanicals. Where possible we partner with co-ops that follow organic and regenerative practices. Product pages note certifications when available.",
      }),
    },
    {
      question: t("faq.sourcingAfrica.q", {
        defaultValue: "Do you really source from Africa?",
      }),
      answer: t("faq.sourcingAfrica.a", {
        defaultValue:
          "Yes. Many of our oils and teas are direct-trade or co-op sourced from West, East, and Southern Africa. We aim for traceable supply and fair compensation for producers.",
      }),
    },

    // Use & safety
    {
      question: t("faq.oilUse.q", {
        defaultValue: "How do I use your oils? Are they edible?",
      }),
      answer: t("faq.oilUse.a", {
        defaultValue:
          "Each product page states whether an oil is cosmetic, culinary, or both. Cosmetic oils are for external use only. Culinary oils list smoke point and flavor notes for cooking or finishing.",
      }),
    },
    {
      question: t("faq.allergens.q", {
        defaultValue: "Any allergen or sensitivity considerations?",
      }),
      answer: t("faq.allergens.a", {
        defaultValue:
          "If you’re sensitive to nuts, seeds, or specific herbs, review the ingredient list and consult a professional if unsure. Patch test cosmetic oils on a small area before wider use.",
      }),
    },
    {
      question: t("faq.teaPrep.q", {
        defaultValue: "How should I brew your teas?",
      }),
      answer: t("faq.teaPrep.a", {
        defaultValue:
          "General guide: Herbal teas 95–100°C for 5–10 min; Green teas ~80°C for 2–3 min; Black teas 95°C for 3–5 min. See each tea’s page for exact notes.",
      }),
    },
    {
      question: t("faq.storage.q", {
        defaultValue: "How do I store oils and teas?",
      }),
      answer: t("faq.storage.a", {
        defaultValue:
          "Keep tightly sealed, away from heat, light, and moisture. Oils last longer refrigerated after opening; teas prefer a cool, dry cupboard.",
      }),
    },

    // Shipping & returns
    {
      question: t("faq.shipsFrom.q", {
        defaultValue: "Where do you ship from?",
      }),
      answer: t("faq.shipsFrom.a", {
        defaultValue:
          "Orders ship from our Sweden base. We currently serve Sweden and the EU.",
      }),
    },
    {
      question: t("faq.shippingPolicy.q", {
        defaultValue: "What’s your shipping policy?",
      }),
      answer: t("faq.shippingPolicy.a", {
        defaultValue:
          "We process orders in 1–3 business days. Sweden: 2–5 days delivery; EU: ~5–10+ days depending on destination. Final fees and tracking (when available) show at checkout. Duties/taxes may apply outside Sweden.",
      }),
    },
    {
      question: t("faq.returnPolicy.q", {
        defaultValue: "What’s your return policy?",
      }),
      answer: t("faq.returnPolicy.a", {
        defaultValue:
          "Unopened, unused products can be returned within 14 days in original condition. Due to hygiene, opened personal-care items and loose teas aren’t returnable unless faulty. Email support@tropinord.com to start a return.",
      }),
    },

    // Payments
    {
      question: t("faq.payments.q", {
        defaultValue: "Which payment methods do you accept?",
      }),
      answer: t("faq.payments.a", {
        defaultValue:
          "We accept cards via Stripe. In Sweden, you can also pay manually via Swish or Bankgiro—choose your method at checkout and follow the instructions.",
      }),
    },

    // Support & wholesale
    {
      question: t("faq.contactSupport.q", {
        defaultValue: "How can I contact customer support?",
      }),
      answer: t("faq.contactSupport.a", {
        defaultValue:
          "Use our contact form or email info@tropinord.com. We reply within 24–48 hours on business days.",
      }),
    },
    {
      question: t("faq.wholesale.q", {
        defaultValue: "Do you offer wholesale or bulk orders?",
      }),
      answer: t("faq.wholesale.a", {
        defaultValue:
          "Yes—bulk oils and tea packages are available on request. Tell us your needs (volume, packaging, delivery schedule) via sellers@tropinord.com.",
      }),
    },
  ];

  return (
    <main className="pt-36">
      {/* padding-top accounts for the fixed header */}
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
