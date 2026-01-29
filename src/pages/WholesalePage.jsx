// src/pages/WholesalePage.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../utils/api";
import catalogEn from "../assets/docs/wholesale-catalog-en.pdf";
import catalogSv from "../assets/docs/wholesale-catalog-sv.pdf";

export default function WholesalePage() {
  const { i18n, t } = useTranslation("wholesale");
  const lang = (i18n.language || "en").slice(0, 2);

  const catalogMap = {
    en: catalogEn,
    sv: catalogSv,
  };

  const catalogHref = catalogMap[lang] || catalogEn;

  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    interest: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.businessName || !form.email) {
      setStatus({
        type: "error",
        message: t("form.validationRequired", {
          defaultValue: "Please fill in at least business name and email.",
        }),
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/wholesale-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("failed");
      }

      setStatus({
        type: "success",
        message: t("form.success", {
          defaultValue:
            "Thank you for your interest. Our B2B team will contact you shortly.",
        }),
      });
      setForm({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        country: "",
        interest: "",
        message: "",
      });
    } catch (err) {
      console.error("Wholesale inquiry failed:", err);
      setStatus({
        type: "error",
        message: t("form.error", {
          defaultValue: "Something went wrong. Please try again or email us.",
        }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-28 px-4 pb-16 max-w-6xl mx-auto">
      {/* HERO */}
      <header className="mb-10">
        <p className="inline-block text-xs font-semibold tracking-wide uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 px-3 py-1 rounded-full mb-3">
          {t("badge", { defaultValue: "B2B · BULK ORDERS" })}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-200 mb-3">
          {t("title", {
            defaultValue:
              "Wholesale African Wellness Products for European Businesses",
          })}
        </h1>
        <p className="text-gray-700 dark:text-gray-200 max-w-3xl text-base md:text-lg">
          {t("subtitle", {
            defaultValue:
              "Teas, oils, superfoods and coffee sourced from African producers, tailored for retailers, salons, spas and cafés across Europe.",
          })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT / CENTER COLUMN: CONTENT */}
        <div className="lg:col-span-2 space-y-10">
          {/* Who it's for */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              {t("whoFor.heading", { defaultValue: "Who we work with" })}
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3">
              {t("whoFor.intro", {
                defaultValue:
                  "TropiNord partners with businesses that want authentic, traceable and nature-conscious products.",
              })}
            </p>
            <ul className="list-disc list-inside text-sm md:text-base space-y-1 text-gray-800 dark:text-gray-200">
              <li>
                {t("whoFor.retail", {
                  defaultValue:
                    "Health food shops, African stores and organic retailers.",
                })}
              </li>
              <li>
                {t("whoFor.salons", {
                  defaultValue:
                    "Hair & beauty salons, barbers and wellness studios.",
                })}
              </li>
              <li>
                {t("whoFor.hospitality", {
                  defaultValue: "Hotels, cafés, tearooms and guest houses.",
                })}
              </li>
              <li>
                {t("whoFor.online", {
                  defaultValue: "Small online brands and concept stores.",
                })}
              </li>
            </ul>
          </section>

          {/* Catalog */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              {t("catalog.heading", {
                defaultValue: "Wholesale catalog & product overview",
              })}
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4">
              {t("catalog.text", {
                defaultValue:
                  "Browse our current wholesale range of teas, oils, coffee and superfoods. Detailed product and packaging information is available in our PDF catalog.",
              })}
            </p>

            {/* PDF link – point to your real file later */}
            <a
              href={catalogHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              📄{" "}
              <span className="ml-2">
                {t("catalog.downloadLabel", {
                  defaultValue: "Download wholesale product catalog (PDF)",
                })}
              </span>
            </a>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t("catalog.comingSoon", {
                defaultValue:
                  "Digital catalog is being updated. Contact us for the latest product list.",
              })}
            </p>
          </section>

          {/* Example pricing tiers */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              {t("pricing.heading", {
                defaultValue: "Example wholesale pricing",
              })}
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4">
              {t("pricing.note", {
                defaultValue:
                  "Final pricing depends on product origin, packaging and shipping route. Below is a simple example of how tiered pricing can look:",
              })}
            </p>

            <div className="border rounded-lg p-4 bg-emerald-50 dark:bg-gray-900/40">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                {t("pricing.baobabHeading", {
                  defaultValue: "BAOBAB POWDER (200 g pouch, example)",
                })}
              </h3>
              <ul className="text-sm md:text-base text-gray-800 dark:text-gray-100 space-y-1">
                <li>
                  {t("pricing.line1", {
                    defaultValue: "10–24 units: 200 SEK / unit",
                  })}
                </li>
                <li>
                  {t("pricing.line2", {
                    defaultValue: "25–49 units: 180 SEK / unit",
                  })}
                </li>
                <li>
                  {t("pricing.line3", {
                    defaultValue: "50+ units: 160 SEK / unit",
                  })}
                </li>
              </ul>
              <p className="mt-3 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                {t("pricing.minimum", {
                  defaultValue: "Minimum order: 10 units per product / SKU",
                })}
              </p>
            </div>
          </section>

          {/* MOQ & shipping */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                {t("moq.heading", {
                  defaultValue: "Minimum orders & lead times",
                })}
              </h2>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                {t("moq.text", {
                  defaultValue:
                    "Standard MOQs start from 10–20 units per product for stocked items, and higher for custom packaging or private label. Lead times can range from 2–5 weeks depending on stock level, harvest season and shipping route.",
                })}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                {t("shipping.heading", {
                  defaultValue: "Shipping & logistics",
                })}
              </h2>
              <ul className="text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1">
                <li>
                  {t("shipping.line1", {
                    defaultValue:
                      "Shipments within the EU can be fulfilled from Sweden or directly from origin depending on product and volume.",
                  })}
                </li>
                <li>
                  {t("shipping.line2", {
                    defaultValue:
                      "We work with trusted logistics partners to handle customs, documentation and temperature-sensitive goods where needed.",
                  })}
                </li>
                <li>
                  {t("shipping.line3", {
                    defaultValue:
                      "You will always receive a clear estimate of freight cost and delivery time before confirming your order.",
                  })}
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-1">
            {t("contact.heading", {
              defaultValue: "Talk to our B2B team",
            })}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {t("contact.text", {
              defaultValue:
                "Send us your business details and a short description of what you are looking for. We will come back with tailored options, price indications and samples where possible.",
            })}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1"
              >
                {t("form.businessName", {
                  defaultValue: "Business name / shop name",
                })}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={form.businessName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="contactName"
                className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1"
              >
                {t("form.contactName", {
                  defaultValue: "Contact person",
                })}
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={form.contactName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1"
              >
                {t("form.email", { defaultValue: "Email" })}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1"
                >
                  {t("form.phone", { defaultValue: "Phone / WhatsApp" })}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1"
                >
                  {t("form.country", { defaultValue: "Country" })}
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="interest"
                className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1"
              >
                {t("form.interest", {
                  defaultValue: "What are you mainly interested in?",
                })}
              </label>
              <select
                id="interest"
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="">
                  {t("form.interestPlaceholder", {
                    defaultValue: "Select one or write in the message",
                  })}
                </option>
                <option value="teas">
                  {t("form.optionTeas", { defaultValue: "Teas" })}
                </option>
                <option value="oils">
                  {t("form.optionOils", { defaultValue: "Oils" })}
                </option>
                <option value="coffee">
                  {t("form.optionCoffee", { defaultValue: "Coffee" })}
                </option>
                <option value="superfoods">
                  {t("form.optionSuperfoods", { defaultValue: "Superfoods" })}
                </option>
                <option value="mixed">
                  {t("form.optionMixed", {
                    defaultValue: "Mixed assortment",
                  })}
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1"
              >
                {t("form.message", {
                  defaultValue:
                    "Tell us briefly about your business and volumes",
                })}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            {status.message && (
              <p
                className={`text-xs mt-1 ${
                  status.type === "success"
                    ? "text-green-600 dark:text-green-300"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {submitting
                ? t("form.sending", { defaultValue: "Sending..." })
                : t("ctaBlock.button", {
                    defaultValue: "Contact wholesale team",
                  })}
            </button>
          </form>

          {/* Static contact info if you want to show it too */}
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <div>
              <strong>
                {t("contact.emailLabel", { defaultValue: "B2B email" })}:
              </strong>{" "}
              <a
                href="mailto:support@tropinord.com"
                className="underline break-all"
              >
                support@tropinord.com
              </a>
            </div>
            <div>
              <strong>
                {t("contact.whatsappLabel", {
                  defaultValue: "WhatsApp (business)",
                })}
                :
              </strong>{" "}
              <a
                href="https://wa.me/46700711713"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                +46 70 071 17 13
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
