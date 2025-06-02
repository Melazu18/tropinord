import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
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
  const { t } = useTranslation();
  const detailRef = useRef(null);

  const services = [
    {
      id: "organic-oils",
      icon: <FaLeaf className="text-green-600 text-3xl mb-2" />,
      title: "Organic Oils",
      description: "Cold-pressed coconut, neem, baobab, and almond oils.",
      detail:
        "Our organic oils—such as baobab, coconut, neem, and almond—are ethically cold-pressed from trusted cooperatives in Africa, Asia, and the Caribbean. Each batch is unrefined and rich in nutrients, perfect for wellness, skincare, or culinary use. We prioritize purity, fair trade, and full traceability.",
    },
    {
      id: "natural-soaps",
      icon: <FaSpa className="text-green-600 text-3xl mb-2" />,
      title: "Natural Soaps",
      description: "African black soap, shea soap, and herbal blends.",
      detail:
        "Our natural soaps include traditional African black soap, shea butter bars, and custom herbal blends infused with moringa, turmeric, and neem. Crafted using age-old methods and sustainably harvested ingredients, these soaps offer a gentle yet powerful cleansing experience while supporting local artisans.",
    },
    {
      id: "agro-imports",
      icon: <FaTractor className="text-green-600 text-3xl mb-2" />,
      title: "Agro & Raw Material Imports",
      description: "Farm produce, herbs, and eco-packaging from the tropics.",
      detail:
        "We import niche agro-based materials and eco-products such as banana leaves, cassava flour, dried herbs, and biodegradable packaging. Our sourcing network spans across Africa, Asia, and the Caribbean—supporting clean-label brands, restaurants, and sustainable retailers in the Nordics.",
    },
    {
      id: "logistics",
      icon: <FaShippingFast className="text-green-600 text-3xl mb-2" />,
      title: "Retail & Logistics Support",
      description: "Nordic logistics for small brands.",
      detail:
        "Our logistics service is designed for micro-brands and solo entrepreneurs. We help with warehousing, labeling, Nordic-friendly packaging, and last-mile delivery within Sweden and the EU. Whether you're launching a herbal product or a new snack, our support gets you retail-ready.",
    },
    {
      id: "eco-sourcing",
      icon: <FaSeedling className="text-green-600 text-3xl mb-2" />,
      title: "Eco-Sourcing Partnerships",
      description: "Fair-trade sourcing with full traceability.",
      detail:
        "We believe in ethical, earth-friendly trade. Our eco-sourcing connects you to small-scale growers using regenerative farming and agroecology. We co-develop supply chains with producers in underrepresented regions, ensuring fair prices, sustainable yields, and storytelling that sells.",
    },
    {
      id: "community",
      icon: <FaHandsHelping className="text-green-600 text-3xl mb-2" />,
      title: "Community Outreach",
      description: "Empowering youth through sustainability.",
      detail:
        "Our outreach focuses on youth empowerment, food education, and green entrepreneurship. Through mentorship, workshops, and sports-led programs, we help bridge rural talent and urban markets—from grassroots in West Africa to integration hubs in Scandinavia.",
    },
  ];

  const [selectedService, setSelectedService] = useState(services[0]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
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
          🌿 Our Services
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
                {service.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {service.description}
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
            {selectedService.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {selectedService.detail}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">
            Interested in collaborating with us?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Reach out and let’s bring your project to life.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
