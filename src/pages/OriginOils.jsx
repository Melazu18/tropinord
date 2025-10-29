import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function OriginOils() {
  const { t } = useTranslation("origin");

  return (
    <main className="pt-28 pb-16 px-4">
      <Helmet>
        <title>
          {t("oils.metaTitle", { defaultValue: "The Origin of Our Oils" })}
        </title>
        <meta
          name="description"
          content={t("oils.metaDescription", {
            defaultValue:
              "How we source cold pressed tropical oils with Nordic standards and support small producers.",
          })}
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-700">
            {t("oils.title", { defaultValue: "From Seed to Sacred Oil" })}
          </h1>
          <p className="mt-3 text-lg text-gray-700 dark:text-gray-200">
            {t("oils.welcome", {
              defaultValue:
                "Our oils begin as seeds, kernels, and fruit gathered with care. Across Africa, plants are honored as living stores of nourishment and medicine shared in kitchens, on skin, and in rituals of everyday healing.",
            })}
          </p>
        </header>

        {/* Hero image */}
        <div className="rounded-xl overflow-hidden shadow mb-8">
          <img
            src="/images/castoroil02.jpg"
            alt={t("oils.alt", { defaultValue: "Cold-pressed castor oil" })}
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>

        {/* Story */}
        <article className="prose dark:prose-invert prose-green max-w-none">
          <p>
            {t("oils.p1", {
              defaultValue:
                "For generations, communities have pressed nature’s gifts into oils that comfort and restore: shea butter to soften and protect, coconut for shine and cooking, castor for strength and scalp, palm varieties for heat and flavor. These are not trends; they are traditions wisdom passed from elders to children.",
            })}
          </p>
          <p>
            {t("oils.p2", {
              defaultValue:
                "We work with cooperatives that clean, dry, and cold-press in small batches to preserve delicate fatty acids, vitamins, and aromatics. Where appropriate, artisanal clarification follows gentle, minimal handling that keeps the oil close to its natural state.",
            })}
          </p>
          <p>
            {t("oils.p3", {
              defaultValue:
                "Then we apply Nordic standards: lab checks for purity, batch IDs for traceability, and straightforward, low-impact packaging. The result is oil you can trust authentic to its origin and reliable for your daily rituals whether in the kitchen or on the skin.",
            })}
          </p>
          <p>
            {t("oils.p4", {
              defaultValue:
                "Your support helps fund farmer training in regenerative practices: mulching and cover crops for living soils, responsible water use, and safer processing spaces. Fair pricing and long-term relationships allow families to plan, communities to invest, and landscapes to recover.",
            })}
          </p>
          <p>
            {t("oils.p5", {
              defaultValue:
                "Looking ahead, we are exploring partnerships in the South Pacific for botanicals and oils that complement our African roots. Wherever the journey leads, our promise is constant: honor the plant, honor the people, and deliver honest oil with nothing to hide.",
            })}
          </p>
        </article>
      </div>
    </main>
  );
}
