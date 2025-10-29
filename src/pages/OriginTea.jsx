import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function OriginTea() {
  const { t } = useTranslation("origin");

  return (
    <main className="pt-28 pb-16 px-4">
      <Helmet>
        <title>
          {t("tea.metaTitle", { defaultValue: "The Origin of Our Teas" })}
        </title>
        <meta
          name="description"
          content={t("tea.metaDescription", {
            defaultValue:
              "Discover how TropiNord sources character-rich tropical teas and supports smallholders.",
          })}
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-700">
            {t("tea.title", { defaultValue: "The Secret Power of Plants" })}
          </h1>
          <p className="mt-3 text-lg text-gray-700 dark:text-gray-200">
            {t("tea.welcome", {
              defaultValue:
                "Welcome to our tea origin story rooted in Africa’s highlands and guided by respect for nature. For generations, communities have lived closely with their landscapes: listening to the seasons, honoring the plants, and turning leaves into comfort, care, and calm.",
            })}
          </p>
        </header>

        {/* Hero image */}
        <div className="rounded-xl overflow-hidden shadow mb-8">
          <img
            src="/images/teaFarmers02.jpg"
            alt={t("tea.alt", {
              defaultValue: "Tea farmers in tropical highlands",
            })}
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>

        {/* Story */}
        <article className="prose dark:prose-invert prose-green max-w-none">
          <p>
            {t("tea.p1", {
              defaultValue:
                "Across Africa, tea is more than a drink, it is a relationship with the land. Families have long relied on the forest’s apothecary: bitter leaves to steady the body, fragrant herbs to soothe, roots that clear the breath and settle the mind. When illness visits a home, water meets leaf; a pot simmers, and nature offers its quiet remedy.",
            })}
          </p>
          <p>
            {t("tea.p2", {
              defaultValue:
                "Our partner growers cultivate whole-leaf teas among banana shade, mist, and red volcanic soils. Plucking is deliberate: two leaves and a bud carried by hand to small factories where withering, rolling, oxidation, and firing are tuned for each batch. We select herbal infusions, black, and green teas that keep their character, the terroir you can taste.",
            })}
          </p>
          <p>
            {t("tea.p3", {
              defaultValue:
                "We pair this heritage with Nordic reliability: batch IDs, traceable lots, and clean presentation. Every bag is honest to its origin, and every blend is purposefulcrafted to bring calm, clarity, or quiet energy into your day.",
            })}
          </p>
          <p>
            {t("tea.p4", {
              defaultValue:
                "Your purchase sustains smallholders through fair pricing and training in soil health, shade management, and regenerative practices. Together we encourage composting, intercropping, and water stewardship that protect both yield and biodiversity.",
            })}
          </p>
          <p>
            {t("tea.p5", {
              defaultValue:
                "Our journey continues. While our roots are in Africa, we are exploring future partnerships in the South Pacific lands where tea, herbs, and native botanicals tell their own stories of care. Wherever we go, the principle stays the same: respect the plant, respect the people, and let the land speak in the cup.",
            })}
          </p>
        </article>
      </div>
    </main>
  );
}
