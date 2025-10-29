import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <main className="pt-32">
      <div className="relative min-h-screen text-gray-800 dark:text-gray-100">
        <Helmet>
          <title>
            {t("about.metaTitle", {
              defaultValue: "About TropiNord | Our Story & Mission",
            })}
          </title>
          <meta
            name="description"
            content={t("about.metaDescription", {
              defaultValue:
                "Learn about TropiNord's mission, roots, ethical sourcing, and commitment to sustainable wellness. Founded in Sweden by Paul Abejegah.",
            })}
          />
        </Helmet>

        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0 hidden sm:block motion-safe:animate-fade-in"
          style={{ backgroundImage: "url('/images/tropinordAbout.png')" }}
        ></div>

        <div className="relative z-10 bg-white/70 dark:bg-black/50 min-h-screen">
          <div className="max-w-4xl mx-auto p-6 space-y-10 scroll-smooth animate-fade-in">
            <header className="text-center py-12">
              <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-400 drop-shadow-md">
                🌿 {t("about.heading", { defaultValue: "About TropiNord" })}
              </h1>
              <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 italic">
                {t("about.subheading", {
                  defaultValue: "Our story, our values, our mission",
                })}
              </p>
            </header>

            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {t("about.ourStoryTitle", { defaultValue: "Our Story" })}
              </h2>
              <p className="mb-4 text-lg">
                {t("about.ourStoryContent", {
                  defaultValue:
                    "TropiNord is a Swedish wellness brand rooted in sustainability, cultural heritage, and ethical trade. We bring together the clarity and precision of the Nordic lifestyle with the deep, time-honored traditions of Africa and the Pacific.\n\nOur foundation is built on respect for nature, for people, and for the knowledge passed down through generations. From Sweden's clean, forested landscapes to the sun-warmed soils of Africa and the Pacific Islands, every ingredient is selected for its purity, potency, and purpose.\n\nAt TropiNord, sustainability isn't a trend, it's a principle. Our products and partnerships reflect:\n\n❄️ Nordic standards, thoughtful sourcing, clean production, and uncompromising quality\n🌿 Global wisdom drawing from ancestral knowledge of herbs, oils, and holistic wellness\n🌍 Shared responsibility protecting ecosystems, supporting small producers, and honoring heritage\n\nThis is more than wellness. It's a connection between worlds, one that celebrates people, planet, and the power of tradition.",
                })}
              </p>
              <blockquote className="mt-6 p-4 border-l-4 border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100 italic rounded-md shadow-sm">
                {t("about.missionQuote", {
                  defaultValue:
                    "“As part of our mission, TropiNord is proud to develop a line of products specifically for Afro-European customers, combining African botanical wisdom with Nordic purity.”",
                })}
              </blockquote>
            </section>

            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {t("about.valuesTitle", { defaultValue: "What We Stand For" })}
              </h2>
              <p className="mb-4 text-lg">
                {t("about.valuesContent", {
                  defaultValue:
                    "TropiNord is more than a shop. It is a platform created to support people. Guided by a deep sense of purpose, our goal is to empower small producers, promote eco-conscious living, and help customers reconnect with nature through simple, honest products.",
                })}
              </p>
            </section>

            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {t("about.whatWeDoTitle", { defaultValue: "What We Do" })}
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>
                  {t("about.whatWeDoItem1", {
                    defaultValue:
                      "Import and distribute organic oils, natural soaps, and wellness items",
                  })}
                </li>
                <li>
                  {t("about.whatWeDoItem2", {
                    defaultValue:
                      "Work hand in hand with small producers in Africa, Sweden, and other regions",
                  })}
                </li>
                <li>
                  {t("about.whatWeDoItem3", {
                    defaultValue:
                      "Provide support and visibility to local makers",
                  })}
                </li>
                <li>
                  {t("about.whatWeDoItem4", {
                    defaultValue:
                      "Sell through online channels, with plans for retail expansion",
                  })}
                </li>
              </ul>
              <p className="mt-4 text-lg">
                {t("about.whatWeDoExtra", {
                  defaultValue:
                    "We also collaborate with small business owners and startups by offering them space to grow. By featuring their products on the TropiNord platform, we support local and international visibility, helping to increase awareness and build customer trust.",
                })}
              </p>
            </section>

            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3">
                  <img
                    src="/images/climateImage01.jpg"
                    alt={t("climate.alt", { defaultValue: "Climate Action" })}
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                    {t("climate.heading", {
                      defaultValue: "Our Climate Commitment",
                    })}
                  </h2>
                  <p className="text-lg mb-4">
                    {t("climate.supportText", {
                      defaultValue:
                        "TropiNord supports permanent carbon removal. 0.5% of every order funds climate solutions.",
                    })}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t("climate.partnerText", {
                      defaultValue:
                        "We partner with leading climate organizations to ensure your contribution makes a real impact.",
                    })}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {t("about.ourMissionTitle", { defaultValue: "Our Mission" })}
              </h2>
              <p className="text-lg">
                {t("about.ourMissionContent", {
                  defaultValue:
                    "Our mission is to create a genuine link between tradition, nature, and quality. TropiNord exists to support sustainable trade and celebrate cultural diversity through products that reflect care, craft, and community.",
                })}
              </p>
            </section>

            <div className="text-center pt-4">
              <a
                href="/explore"
                className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
              >
                {t("about.exploreButton", { defaultValue: "Explore Products" })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
