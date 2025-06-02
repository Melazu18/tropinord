import React from "react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section
        className="relative w-full text-center bg-no-repeat bg-center bg-contain bg-white py-32 lg:py-40 overflow-hidden"
        style={{ backgroundImage: "url('/images/tropinordHome.png')" }}
      >
        {/* Centered Text Container with Backdrop */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 bg-black/40 backdrop-blur-sm rounded-xl shadow-md">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-6 leading-tight">
            {t("home.welcome")}
          </h1>
          <p className="text-xl text-gray-100 mb-8 drop-shadow-md leading-relaxed">
            {t("home.intro")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/explore">
              <Button className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl shadow">
                {t("home.ctaExplore")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="px-6 py-3 text-lg bg-white border border-green-600 text-green-700 hover:bg-green-50 rounded-xl shadow">
                {t("home.ctaContact")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto text-center space-y-4 px-6 py-16 bg-white dark:bg-[#111827] transition-colors duration-300">
        <h2 className="text-3xl font-semibold text-green-800 dark:text-green-400">
          {t("home.mission")}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-200">
          {t("home.missionText")}
        </p>
      </section>
    </div>
  );
}
