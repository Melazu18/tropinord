// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import Tagline from "../components/Tagline";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import { API_BASE } from "../utils/api";
import ProductSearch from "../components/search/ProductSearch";

export default function Home() {
  // 🔽 include "wholesale" namespace so the new section is fully translatable
  const { t, i18n } = useTranslation([
    "hero",
    "buttons",
    "footer",
    "wholesale",
  ]);
  const lang = (i18n.language || "en").slice(0, 2);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const path = (key) => getLocalizedPath(key, lang);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubscribed(true);
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  return (
    <div className="space-y-16">
      {/* tiny CSS for nature separators + gentle float */}
      <style>{`
        @keyframes tn-float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        .tn-float { animation: tn-float 5s ease-in-out infinite; }
        @keyframes tn-leaf-wave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .tn-nature-sep {
          background: linear-gradient(90deg, rgba(16,122,57,0.15), rgba(212,175,55,0.25), rgba(16,122,57,0.15));
          background-size: 200% 200%;
          animation: tn-leaf-wave 8s ease-in-out infinite;
        }
      `}</style>

      {/* Nature search just under the header */}
      <div className="pt-[5.25rem] md:pt-[5.25rem]">
        <ProductSearch />
      </div>

      {/* Hero (updated copy + CTAs) */}
      <section
        className="relative min-h-[70vh] bg-no-repeat bg-cover bg-center flex items-center justify-center px-4 sm:px-6 md:px-12"
        style={{ backgroundImage: "url('/images/tropinordHome.png')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-3xl w-full text-center bg-black/40 backdrop-blur-sm rounded-xl p-6 sm:p-10 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("headline", {
              defaultValue: "Teas, Oils, Coffee & Superfoods from the Tropics",
            })}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6">
            {t("subheadline", {
              defaultValue:
                "Digitally traceable, sustainably sourced. A curated selection of tropical oils, teas, coffee and superfoods, connecting small African producers with conscious consumers.",
            })}
          </p>

          <p className="mt-1 mb-8 italic text-green-300 text-lg">
            {t("tagline", { defaultValue: "Nature remembers — and so do we." })}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Primary: Explore */}
            <Link
              to={path("explore")}
              className="text-sm sm:text-base px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t("explore", { defaultValue: "Explore" })}
            </Link>

            {/* Secondary: Contact (kept) */}
            <Link
              to={path("contact")}
              className="text-sm sm:text-base px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {t("contactUs", { defaultValue: "Contact Us" })}
            </Link>
          </div>
        </div>
      </section>

      {/* 🔽 NEW: Wholesale / Bulk Orders CTA right after hero */}
      <section className="px-4 md:px-8 -mt-4">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 mb-1">
              {t("wholesale:badge", { defaultValue: "B2B · BULK ORDERS" })}
            </p>
            <h2 className="text-lg sm:text-xl font-semibold text-emerald-900 dark:text-emerald-100">
              {t("wholesale:homeCta.title", {
                defaultValue: "Wholesale & bulk orders for businesses",
              })}
            </h2>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {t("wholesale:homeCta.text", {
                defaultValue:
                  "Are you a shop, spa, salon or café? Explore our dedicated B2B page for wholesale pricing, minimums and shipping options.",
              })}
            </p>
          </div>
          <div>
            <Link
              to={path("wholesale")}
              className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow"
            >
              {t("wholesale:homeCta.button", {
                defaultValue: "View wholesale options",
              })}
              <span className="ml-2">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline (kept) */}
      <section className="px-4 md:px-8 -mt-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tagline />
        </div>
      </section>

      {/* ===== Nature separator ===== */}
      <div className="tn-nature-sep h-10 rounded-full mx-4 md:mx-8" />

      {/* TEA: hero card FIRST (clickable) */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to={path("tea")}
            className="block rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group"
            aria-label="Browse Teas"
          >
            <div className="relative">
              <img
                src="/images/TropiNordTeaProduct003.png"
                alt="TropiNord Tea"
                className="w-full h-[280px] sm:h-[360px] md:h-[420px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold tn-float">
                  {t("teaCtaTitle", {
                    defaultValue: "Steep calm, sip clarity",
                  })}
                </h3>
                <p className="text-sm opacity-90">
                  {t("teaCtaSub", {
                    defaultValue:
                      "Whole-leaf character. Honest aroma. Taste of place.",
                  })}
                </p>
              </div>
            </div>
          </Link>

          {/* TEA: side image left, copy right */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="order-1">
              <Link to={path("tea")} aria-label="Browse Teas">
                <img
                  src="/images/enjoyTea01.jpg"
                  alt="Enjoy tea"
                  className="w-full h-72 object-cover rounded-xl shadow-md transition-transform duration-500 hover:scale-[1.02]"
                />
              </Link>
            </div>
            <div className="order-2">
              <h4 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
                {t("teaEnjoyTitle", {
                  defaultValue: "Enjoy a cup of tea with your loved ones",
                })}
              </h4>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {t("teaEnjoyBody", {
                  defaultValue:
                    "In a world that moves too fast, let the kettle slow everything down. Our tropical black, green, fruit and herbal blends arrive as loose leaves, ready for you to fill into your own teabags. Brew it soft, brew it strong, craft your cup, your way. A warm moment shared becomes a ritual remembered.",
                })}
              </p>

              <div className="mt-4">
                <Link
                  to={path("tea")}
                  className="inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  {t("browseTeas", { defaultValue: "Browse Teas" })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Nature separator ===== */}
      <div className="tn-nature-sep h-10 rounded-full mx-4 md:mx-8" />

      {/* OILS: hero head (clickable) */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to={path("oils")}
            className="block rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group"
            aria-label="Browse Oils"
          >
            <div className="relative">
              <img
                src="/images/organicOils.png"
                alt="Organic tropical oils"
                className="w-full h-[260px] sm:h-[340px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold tn-float">
                  {t("oilsCtaTitle", {
                    defaultValue: "Press nature, pour nourishment",
                  })}
                </h3>
                <p className="text-sm opacity-90">
                  {t("oilsCtaSub", {
                    defaultValue:
                      "Cold-pressed goodness for scalp, skin, and kitchen.",
                  })}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* OILS: side copy left, image right */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <h4 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
              {t("oilsCareTitle", {
                defaultValue: "Nourish scalp & skin with 100% natural oils",
              })}
            </h4>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {t("oilsCareBody", {
                defaultValue:
                  "From shea and coconut to castor and beyond—our cold-pressed oils are crafted to soothe the scalp, seal in moisture and let your natural glow rise to the surface. Honest texture. Quiet shine. Care you can feel.",
              })}
            </p>
            <div className="mt-4">
              <Link
                to={path("oils")}
                className="inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              >
                {t("browseOils", { defaultValue: "Browse Oils" })}
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <Link to={path("oils")} aria-label="Browse Oils">
              <img
                src="/images/haircare.png"
                alt="Hair & skin care oils"
                className="w-full h-72 object-cover rounded-xl shadow-md transition-transform duration-500 hover:scale-[1.02]"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Nature separator ===== */}
      <div className="tn-nature-sep h-10 rounded-full mx-4 md:mx-8" />

      {/* ===== COFFEE SECTION - COMMENTED OUT ===== */}
      {/* 
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to={path("coffee")}
            className="block rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group"
            aria-label="Browse Coffee"
          >
            <div className="relative">
              <img
                src="/images/coffeeCup01.jpg"
                alt="Freshly brewed African coffee"
                className="w-full h-[260px] sm:h-[340px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold tn-float">
                  {t("coffeeCtaTitle", {
                    defaultValue: "From highlands to your cup",
                  })}
                </h3>
                <p className="text-sm opacity-90">
                  {t("coffeeCtaSub", {
                    defaultValue:
                      "Single-origin lots from storied African regions — bright, floral, and vibrant.",
                  })}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <h4 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
              {t("coffeeStoryTitle", {
                defaultValue:
                  "Natural coffees from Africa's legendary terroirs",
              })}
            </h4>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {t("coffeeStoryBody", {
                defaultValue:
                  "From the floral heights of Ethiopia to Kenya's blackcurrant zing and Tanzania's cocoa-sweet peaberries, our coffees honor origin. Carefully sourced and roasted to reveal native character: jasmine and citrus, sun-ripened berry, velvety chocolate. Brew with intention; taste the landscape.",
              })}
            </p>
            <div className="mt-4">
              <Link
                to={path("coffee")}
                className="inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              >
                {t("browseCoffee", { defaultValue: "Browse Coffee" })}
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <Link to={path("coffee")} aria-label="Browse Coffee">
              <img
                src="/images/coupleCoffee01.jpg"
                alt="Sharing coffee together"
                className="w-full h-72 object-cover rounded-xl shadow-md transition-transform duration-500 hover:scale-[1.02]"
                loading="lazy"
              />
            </Link>
          </div>
        </div>
      </section>

      <div className="tn-nature-sep h-10 rounded-full mx-4 md:mx-8" />
      */}
      {/* ===== END OF COMMENTED COFFEE SECTION ===== */}

      {/* SUPERFOODS: focus on Moringa Powder */}
      <section className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to={path("superfoods")}
            className="block rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group"
            aria-label="Browse Superfoods"
          >
            <div className="relative">
              <img
                src="/images/moringaPowder01.jpg"
                alt="Moringa powder"
                className="w-full h-[240px] sm:h-[320px] md:h-[380px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold tn-float">
                  {t("moringaCtaTitle", {
                    defaultValue: "Moringa:  green nourishment, simply",
                  })}
                </h3>
                <p className="text-sm opacity-90">
                  {t("moringaCtaSub", {
                    defaultValue:
                      "Natural superfoods from Africa and the Pacific:  clean energy, daily balance.",
                  })}
                </p>
              </div>
            </div>
          </Link>

          {/* copy + bullets */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <h4 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
                {t("superfoodsTitle", {
                  defaultValue: "Natural superfoods from Africa & the Pacific",
                })}
              </h4>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-3">
                {t("superfoodsBody", {
                  defaultValue:
                    "Moringa leaf powder and Baobab fruit powder bring time-honored nutrition to modern routines. Stir into water, smoothies, oats, or tea for a gentle lift, no additives, just whole-plant goodness.",
                })}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-1">
                <li>
                  <strong>
                    {t("moringaLabel", { defaultValue: "Moringa" })}
                  </strong>{" "}
                  —{" "}
                  {t("moringaDesc", {
                    defaultValue:
                      "naturally rich in vitamin A, vitamin E, calcium, iron, and plant antioxidants.",
                  })}
                </li>
                <li>
                  <strong>
                    {t("baobabLabel", { defaultValue: "Baobab" })}
                  </strong>{" "}
                  —{" "}
                  {t("baobabDesc", {
                    defaultValue:
                      "high in vitamin C with prebiotic fiber to support gut health and immunity.",
                  })}
                </li>
              </ul>

              <div className="mt-4">
                <Link
                  to={path("superfoods")}
                  className="inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  {t("browseSuperfoods", { defaultValue: "Browse Superfoods" })}
                </Link>
              </div>
            </div>

            {/* quick nutrition panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5 shadow">
              <h5 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                {t("nutritionTitle", { defaultValue: "Nutrition at a glance" })}
              </h5>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>
                  {t("moringaNutri", {
                    defaultValue:
                      "Moringa (per 10 g): a natural source of vitamin A & E, iron, calcium, and plant polyphenols.",
                  })}
                </li>
                <li>
                  {t("baobabNutri", {
                    defaultValue:
                      "Baobab (per 10 g): naturally high vitamin C and prebiotic fiber to support digestion.",
                  })}
                </li>
                <li>
                  {t("howToUse", {
                    defaultValue:
                      "Use: 1–2 tsp daily in smoothies, yoghurt, porridge, or warm water with lemon.",
                  })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Nature separator ===== */}
      <div className="tn-nature-sep h-10 rounded-full mx-4 md:mx-8" />

      {/* Subscribe (kept) */}
      <section className="mt-2 max-w-xl mx-auto px-4">
        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-green-700 dark:text-green-300 text-center">
          {t("stayInLoop", { defaultValue: "Stay in the loop" })}
        </h3>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 text-center">
          {t("subscribeText", {
            defaultValue:
              "Get product updates, small-batch releases, and occasional perks.",
          })}
        </p>

        {subscribed ? (
          <p className="text-green-600 font-medium text-center">
            {t("successMessage", {
              ns: "footer",
              defaultValue: "Thanks! You're on the list.",
            })}
          </p>
        ) : (
          <form
            className="flex flex-col sm:flex-row gap-2 justify-center"
            onSubmit={handleSubscribe}
          >
            <input
              id="home-newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder", {
                defaultValue: "Enter your email",
              })}
              className="flex-grow p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-yellow-400 bg-white dark:bg-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {t("subscribe", { ns: "buttons", defaultValue: "Subscribe" })}
            </button>
          </form>
        )}
      </section>

      {/* Help (kept) */}
      <section className="bg-green-50 dark:bg-gray-800 text-center py-8 px-4 mt-8 rounded-lg shadow-md">
        <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-300 mb-2">
          {t("helpHeading", { ns: "footer", defaultValue: "Need a hand?" })}
        </h3>

        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
          <Trans
            i18nKey="helpBody"
            ns="footer"
            components={{
              whatsapp: (
                <a
                  href="https://wa.me/+46700711713"
                  className="underline font-semibold mx-1"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
              email: (
                <a
                  href="mailto:support@tropinord.com"
                  className="underline font-semibold mx-1"
                />
              ),
            }}
            defaults="Reach us on <whatsapp>WhatsApp</whatsapp> or email <email>support@tropinord.com</email>."
          />
        </p>
      </section>
    </div>
  );
}