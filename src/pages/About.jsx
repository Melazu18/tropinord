// src/pages/About.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "../utils/getLocalizedPath";

export default function About() {
  // Load the two namespaces we actually use
  const { t: tAbout, i18n } = useTranslation("about");
  const { t: tClimate } = useTranslation("climate");

  // —— Social preview / SEO helpers (kept)
  const lang = (i18n.language || "en").startsWith("sv") ? "sv" : "en";
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://www.tropinord.com";

  // Prefer routeMap via helper; fall back to current path if needed
  let path =
    typeof getLocalizedPath === "function"
      ? getLocalizedPath("about", lang)
      : "";
  if (!path || typeof path !== "string") {
    path = typeof window !== "undefined" ? window.location.pathname : "/about";
  }
  const canonical = `${origin}${path.startsWith("/") ? "" : "/"}${path}`;

  // Localized meta (updated defaults for Oils & Teas focus)
  const metaTitle =
    tAbout("metaTitle", {
      defaultValue:
        "About TropiNord | Oils & Teas from the Tropics, Nordic Standards",
    }) || "About TropiNord | Oils & Teas from the Tropics, Nordic Standards";

  const metaDescription =
    tAbout("metaDescription", {
      defaultValue:
        "TropiNord connects tropical heritage and Nordic quality. We curate ethically sourced oils and teas—crafted with care, selected to Nordic standards.",
    }) ||
    "TropiNord connects tropical heritage and Nordic quality. We curate ethically sourced oils and teas—crafted with care, selected to Nordic standards.";

  // Absolute share image
  const shareImage = `${origin}/images/share/about.jpg`;

  // JSON-LD (kept)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: lang === "sv" ? "sv-SE" : "en-US",
    name: metaTitle,
    description: metaDescription,
    url: canonical,
    image: shareImage,
    publisher: {
      "@type": "Organization",
      name: "TropiNord",
      url: origin,
      logo: {
        "@type": "ImageObject",
        url: `${origin}/images/artisanLogo.png`,
      },
    },
  };

  return (
    <main className="pt-32">
      <div className="relative min-h-screen text-gray-800 dark:text-gray-100">
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />

          {/* Canonical */}
          <link rel="canonical" href={canonical} />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="TropiNord" />
          <meta
            property="og:locale"
            content={lang === "sv" ? "sv_SE" : "en_US"}
          />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:url" content={canonical} />
          <meta property="og:image" content={shareImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={metaDescription} />
          <meta name="twitter:image" content={shareImage} />

          {/* Localized alternates */}
          <link rel="alternate" hrefLang="en" href={`${origin}/about`} />
          <link rel="alternate" hrefLang="sv" href={`${origin}/sv/om-oss`} />
          <link rel="alternate" hrefLang="x-default" href={`${origin}/about`} />

          {/* JSON-LD */}
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0 hidden sm:block motion-safe:animate-fade-in"
          style={{ backgroundImage: "url('/images/tropinordAbout.png')" }}
        />

        <div className="relative z-10 bg-white/70 dark:bg-black/50 min-h-screen">
          <div className="max-w-4xl mx-auto p-6 space-y-10 scroll-smooth animate-fade-in">
            {/* Header */}
            <header className="text-center py-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-green-700 dark:text-green-400 drop-shadow-md">
                {tAbout("heading", {
                  defaultValue:
                    "Oils & Teas from the Tropics — meeting Nordic standards.",
                })}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-700 dark:text-gray-200">
                {tAbout("subheading", {
                  defaultValue:
                    "Rooted in tropical heritage. Refined by Nordic care.",
                })}
              </p>
            </header>

            {/* Our Story */}
            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {tAbout("ourStoryTitle", { defaultValue: "Our Story" })}
              </h2>
              <div className="space-y-4 text-lg">
                <p>
                  {tAbout("ourStoryContent.p1", {
                    defaultValue:
                      "TropiNord began with a simple promise: to bring you the finest natural oils and teas from tropical regions—carefully curated to meet the rigor and reliability people expect from the Nordics.",
                  })}
                </p>
                <p>
                  {tAbout("ourStoryContent.p2", {
                    defaultValue:
                      "We partner with growers and small producers across Africa and other tropical zones, then apply Nordic quality control, traceability, and clean presentation. The result: products that feel authentic, taste pure, and respect both people and planet.",
                  })}
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    {tAbout("ourStoryContent.list1", {
                      defaultValue:
                        "Tropical excellence: cold-pressed, minimally processed oils; character-rich whole-leaf teas.",
                    })}
                  </li>
                  <li>
                    {tAbout("ourStoryContent.list2", {
                      defaultValue:
                        "Nordic standards: transparent sourcing, consistent batches, and careful handling from origin to you.",
                    })}
                  </li>
                  <li>
                    {tAbout("ourStoryContent.list3", {
                      defaultValue:
                        "Shared value: fair partnerships with smallholders and cooperatives, investing in long-term relationships.",
                    })}
                  </li>
                </ul>
                <p>
                  {tAbout("ourStoryContent.p3", {
                    defaultValue:
                      "Whether you’re nourishing your skin, cooking at home, or steeping a calming cup, we want every drop and every leaf to carry a story of care.",
                  })}
                </p>
              </div>
            </section>

            {/* What We Stand For */}
            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {tAbout("valuesTitle", { defaultValue: "What We Stand For" })}
              </h2>
              <p className="text-lg">
                {tAbout("valuesContent", {
                  defaultValue:
                    "Honesty in ingredients, respect for origin, and products that earn their place in your daily rituals. Our curation focuses on purity, sensory quality, and sustainability—without excess or shortcuts.",
                })}
              </p>
            </section>

            {/* What We Do */}
            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {tAbout("whatWeDoTitle", { defaultValue: "What We Do" })}
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>
                  {tAbout("whatWeDoItem1", {
                    defaultValue:
                      "Curate tropical oils for cooking and care—shea, coconut, palm varieties, and more—prioritizing cold-pressed and minimally processed options.",
                  })}
                </li>
                <li>
                  {tAbout("whatWeDoItem2", {
                    defaultValue:
                      "Select single-origin and blended tropical teas—herbal, black, green—valued for aroma, character, and integrity.",
                  })}
                </li>
                <li>
                  {tAbout("whatWeDoItem3", {
                    defaultValue:
                      "Work hand-in-hand with small producers across Africa and uphold Nordic quality control for consistency.",
                  })}
                </li>
                <li>
                  {tAbout("whatWeDoItem4", {
                    defaultValue:
                      "Support transparent supply chains and responsible packaging choices.",
                  })}
                </li>
              </ul>
              <p className="mt-4 text-lg">
                {tAbout("whatWeDoExtra", {
                  defaultValue:
                    "Every product is selected for its provenance, its benefits, and its ability to uplift everyday life—quietly and honestly.",
                })}
              </p>
            </section>

            {/* Climate Commitment (kept) */}
            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3">
                  <img
                    src="/images/climateImage01.jpg"
                    alt={tClimate("alt", { defaultValue: "Climate Action" })}
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                    {tClimate("heading", {
                      defaultValue: "Our Climate Commitment",
                    })}
                  </h2>
                  <p className="text-lg mb-4">
                    {tClimate("supportText", {
                      defaultValue:
                        "Every order contributes to permanent carbon removal projects via trusted partners. It’s a small step we take on every purchase—so your rituals can be a little kinder to the planet.",
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* Mission */}
            <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                {tAbout("ourMissionTitle", { defaultValue: "Our Mission" })}
              </h2>
              <p className="text-lg">
                {tAbout("ourMissionContent", {
                  defaultValue:
                    "To connect tropical heritage with Nordic reliability—through oils and teas that are simple, honest, and good. For body, for home, for everyday life.",
                })}
              </p>
            </section>

            <div className="text-center pt-4 pb-10">
              <a
                href="/explore"
                className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
              >
                {i18n.t("explore", { ns: "buttons", defaultValue: "Explore" })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
