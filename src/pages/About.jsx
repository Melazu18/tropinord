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

  // Localized meta (updated defaults for Oils,  Teas, Coffee, and Superfoods focus)
  const metaTitle =
    tAbout("metaTitle", {
      defaultValue:
        "About TropiNord | Oils, Teas, Coffee, and Superfoods from the Tropics, with Nordic Standards",
    }) || "About TropiNord | Oils, Teas, Coffee, and Superfoods from the Tropics, withNordic Standards";

  const metaDescription =
    tAbout("metaDescription", {
      defaultValue:
        "TropiNord connects tropical heritage and Nordic quality. We curate ethically sourced oils, teas, coffee, and superfoods, crafted with care, selected to Nordic standards.",
    }) ||
    "TropiNord connects tropical heritage and Nordic quality. We curate ethically sourced oils, teas, coffee, and superfoods, crafted with care, selected to Nordic standards.";

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
                  defaultValue: "Connecting Nature, Innovation, and Wellbeing",
                })}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-700 dark:text-gray-200">
                {tAbout("subheading", {
                  defaultValue:
                    "Where tradition meets technology for natural wellbeing.",
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
                      "At TropiNord, we believe wellness should connect people to nature, to heritage, and to the wisdom that sustains both.",
                  })}
                </p>
                <p>
                  {tAbout("ourStoryContent.p2", {
                    defaultValue:
                      "Born in Sweden, TropiNord blends Nordic precision with tropical innovation to create natural products that nurture, restore, and protect.",
                  })}
                </p>
                <p>
                  {tAbout("ourStoryContent.p3", {
                    defaultValue:
                      "Built from the ground up by an IT student and entrepreneur, TropiNord is more than a wellness brand. It is a digitally driven sustainability platform. Our systems, logistics, and digital architecture were designed in-house to make global trade between small producers and modern consumers transparent, traceable, and fair.",
                  })}
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    {tAbout("ourStoryContent.list1", {
                      defaultValue:
                        "Sustainable value chains through digital traceability and transparent sourcing",
                    })}
                  </li>
                  <li>
                    {tAbout("ourStoryContent.list2", {
                      defaultValue:
                        "Eco-innovation using biodegradable and circular packaging concepts",
                    })}
                  </li>
                  <li>
                    {tAbout("ourStoryContent.list3", {
                      defaultValue:
                        "Inclusive growth and fair opportunities for smallholder producers",
                    })}
                  </li>
                </ul>
                <p>
                  {tAbout("ourStoryContent.p4", {
                    defaultValue:
                      "We believe technology can bring clarity, fairness, and connection to the global wellness industry.",
                  })}
                </p>
                <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-700 dark:text-gray-300">
                  {tAbout("ourStoryContent.quote", {
                    defaultValue:
                      "We collaborate with smallholder producers across Africa, and tropical regions to develop sustainably sourced teas, oils, coffee, and superfoods. Every ingredient tells a story of craft, culture, and care, refined through science, design, and technology.",
                  })}
                </blockquote>
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
                    "TropiNord is a sustainability and innovation hub. We bridge continents through collaboration, empower local producers, and design transparent, circular systems that link traditional wisdom with modern tools.",
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
                      "Develop and distribute functional teas, natural oils, coffee, and superfoods of traceable and sustainable origin",
                  })}
                </li>
                <li>
                  {tAbout("whatWeDoItem2", {
                    defaultValue:
                      "Partner with ethical producers and eco-innovators across Africa, other tropical regions, and Europe",
                  })}
                </li>
                <li>
                  {tAbout("whatWeDoItem3", {
                    defaultValue:
                      "Pilot digital traceability models for transparent supply chains",
                  })}
                </li>
                <li>
                  {tAbout("whatWeDoItem4", {
                    defaultValue:
                      "Offer a platform where small businesses can grow sustainably and reach new markets",
                  })}
                </li>
              </ul>
              <p className="mt-4 text-lg">
                {tAbout("whatWeDoExtra", {
                  defaultValue:
                    "Every product we share is chosen with purpose for its purity, its story, and its ability to make a measurable impact.",
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
                        "We believe innovation must serve both people and the planet. That is why 0.5% of every purchase funds verified carbon-removal projects and community reforestation programs. Each order is a small but meaningful act toward a healthier planet.",
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
              <p className="text-lg mb-4">
                {tAbout("ourMissionContent", {
                  defaultValue:
                    "To redefine natural wellness through innovation, technology, and care, linking tradition with modern tools to create products that are as responsible as they are restorative.",
                })}
              </p>
              <p className="text-xl font-semibold text-green-700 dark:text-green-400 italic">
                {tAbout("ourMissionTagline", {
                  defaultValue:
                    "TropiNord: Where tradition meets technology for natural wellbeing.",
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
