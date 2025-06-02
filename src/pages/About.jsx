import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function About() {
  return (
    <div className="relative min-h-screen text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>About TropiNord | Our Story & Mission</title>
        <meta
          name="description"
          content="Learn about TropiNord’s mission, roots, ethical sourcing, and commitment to sustainable wellness. Founded in Sweden by Paul Abejegah."
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "About TropiNord",
              "url": "https://www.tropinord.com/about",
              "mainEntity": {
                "@type": "Organization",
                "name": "TropiNord",
                "description": "TropiNord is a Swedish-based wellness brand offering ethically sourced oils, soaps, and skincare products. Founded by Paul Abejegah, it blends African tradition with Nordic values."
              }
            }
          `}
        </script>
      </Helmet>

      <video
        poster="/images/tropinordAbout.png"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 hidden sm:block motion-safe:animate-fade-in"
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src="/videos/tropinord-bg.mp4" type="video/mp4" />
        <img
          src="/images/naturetropi01.jpg"
          alt="Nature fallback"
          className="w-full h-full object-cover"
        />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 bg-white/70 dark:bg-black/50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 space-y-10 scroll-smooth animate-fade-in">
          <header className="text-center py-12">
            <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-400 drop-shadow-md">
              🌿 About TropiNord
            </h1>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 italic">
              Our story, our roots, our mission
            </p>
          </header>

          {/* [All your existing content remains unchanged below here] */}
          {/* Story, Mission, Sourcing, Outreach, Join the Journey, etc. */}
          {/* ... */}

          <div className="text-center pt-4">
            <a
              href="/explore"
              className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
            >
              Explore Our Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
