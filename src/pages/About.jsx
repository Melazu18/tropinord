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
          content="Learn about TropiNord's mission, roots, ethical sourcing, and commitment to sustainable wellness. Founded in Sweden by Paul Abejegah."
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

      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 hidden sm:block motion-safe:animate-fade-in"
        style={{ backgroundImage: "url('/images/tropinordAbout.png')" }}
      ></div>

      <div className="relative z-10 bg-white/70 dark:bg-black/50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 space-y-10 scroll-smooth animate-fade-in">
          <header className="text-center py-12">
            <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-400 drop-shadow-md">
              🌿 About TropiNord
            </h1>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 italic">
              Our story, our values, our mission
            </p>
          </header>

          <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              Our Story
            </h2>
            <p className="mb-4 text-lg">
              <strong>Where Nordic Purity Meets Global Wisdom</strong>
              <br />
              <br />
              TropiNord is a Swedish wellness brand rooted in sustainability,
              cultural heritage, and ethical trade. We bring together the
              clarity and precision of the Nordic lifestyle with the deep,
              time-honored traditions of Africa and the Pacific.
              <br />
              <br />
              Our foundation is built on respect for nature, for people, and for
              the knowledge passed down through generations. From Sweden's
              clean, forested landscapes to the sun-warmed soils of Africa and
              the Pacific Islands, every ingredient is selected for its purity,
              potency, and purpose.
              <br />
              <br />
              At TropiNord, sustainability isn't a trend — it's a principle. Our
              products and partnerships reflect:
              <br />
              <br />
              ❄️ <strong>Nordic standards</strong> — thoughtful sourcing, clean
              production, and uncompromising quality
              <br />
              🌿 <strong>Global wisdom</strong> — drawing from ancestral
              knowledge of herbs, oils, and holistic wellness
              <br />
              🌍 <strong>Shared responsibility</strong> — protecting ecosystems,
              supporting small producers, and honoring heritage
              <br />
              <br />
              This is more than wellness. It's a connection between worlds, one
              that celebrates people, planet, and the power of tradition.
            </p>
            <p className="mb-4 text-lg">
              We specialize in organic and essential oils, natural skincare, and
              wellness products. Some are produced by small artisans in Africa
              and the Global South, while others are sourced from Nordic
              producers who share our values of sustainability and quality.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              What We Stand For
            </h2>
            <p className="mb-4 text-lg">
              TropiNord is more than a shop. It is a platform created to support
              people. Guided by a deep sense of purpose, our goal is to empower
              small producers, promote eco-conscious living, and help customers
              reconnect with nature through simple, honest products.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              What We Do
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>
                Import and distribute organic oils, natural soaps, and wellness
                items
              </li>
              <li>
                Work hand in hand with small producers in Africa, Sweden, and
                other regions
              </li>
              <li>Provide support and visibility to local makers</li>
              <li>
                Sell through online channels, with plans for retail expansion
              </li>
            </ul>
            <p className="mt-4 text-lg">
              We also collaborate with small business owners and startups by
              offering them space to grow. By featuring their products on the
              TropiNord platform, we support local and international visibility,
              helping to increase awareness and build customer trust.
            </p>
          </section>

          <section className="bg-white/90 dark:bg-gray-900/80 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              Our Mission
            </h2>
            <p className="text-lg">
              Our mission is to create a genuine link between tradition, nature,
              and quality. TropiNord exists to support sustainable trade and
              celebrate cultural diversity through products that reflect care,
              craft, and community.
            </p>
          </section>

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
