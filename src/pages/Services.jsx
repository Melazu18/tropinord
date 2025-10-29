import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  FaLeaf,
  FaSpa,
  FaTractor,
  FaShippingFast,
  FaSeedling,
  FaHandsHelping,
} from "react-icons/fa";

export default function Services() {
  const { t } = useTranslation("common");
  const detailRef = useRef(null);

  const services = [
    {
      id: "organicOils",
      icon: <FaLeaf className="text-green-600 text-3xl mb-2" />,
    },
    {
      id: "naturalSoaps",
      icon: <FaSpa className="text-green-600 text-3xl mb-2" />,
    },
    {
      id: "agroImports",
      icon: <FaTractor className="text-green-600 text-3xl mb-2" />,
    },
    {
      id: "logistics",
      icon: <FaShippingFast className="text-green-600 text-3xl mb-2" />,
    },
    {
      id: "ecoSourcing",
      icon: <FaSeedling className="text-green-600 text-3xl mb-2" />,
    },
    {
      id: "community",
      icon: <FaHandsHelping className="text-green-600 text-3xl mb-2" />,
    },
  ];

  const [selectedService, setSelectedService] = useState(services[0]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="pt-32">
      <div className="min-h-screen py-16 px-4 md:px-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <Helmet>
          <title>Services | TropiNord</title>
          <meta
            name="description"
            content="Explore TropiNord's services in organic imports, wellness, logistics, and community impact."
          />
        </Helmet>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-700 dark:text-green-400 mb-12">
            🌿 {t("services.title")}
          </h1>

          {/* Service Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service)}
                className={`p-6 rounded-xl shadow-md text-center transition-all w-full ${
                  selectedService.id === service.id
                    ? "bg-green-100 dark:bg-green-900 border-2 border-green-500"
                    : "bg-white dark:bg-gray-800 hover:shadow-xl"
                }`}
              >
                {service.icon}
                <h2 className="text-lg font-semibold mb-1 text-green-800 dark:text-green-200">
                  {t(`services.${service.id}.title`)}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t(`services.${service.id}.desc`)}
                </p>
              </button>
            ))}
          </div>

          {/* Detailed View */}
          <div
            ref={detailRef}
            className="bg-green-50 dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              {t(`services.${selectedService.id}.title`)}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t(`services.${selectedService.id}.detail`)}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">
              {t("services.collabHeading")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("services.collabText")}
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
            >
              {t("services.cta")}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
