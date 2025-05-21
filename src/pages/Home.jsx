import React from "react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-16 bg-green-50 rounded-2xl shadow-lg">
        <h1 className="text-5xl font-bold text-green-800 mb-6">
          {t("home.welcome")}
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          {t("home.intro")}
        </p>
        <div className="flex justify-center gap-4">
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
      </section>

      {/* Mission Statement */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-semibold text-green-800">
          {t("home.mission")}
        </h2>
        <p className="text-lg text-gray-700">{t("home.missionText")}</p>
      </section>
    </div>
  );
}
