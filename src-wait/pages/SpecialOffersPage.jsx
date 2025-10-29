import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const offers = [
  {
    id: "offer1",
    titleKey: "offers.offer1.title",
    descriptionKey: "offers.offer1.description",
    image: "/images/neem-oil.jpg",
    expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24, // 24 hours
  },
  {
    id: "offer2",
    titleKey: "offers.offer2.title",
    descriptionKey: "offers.offer2.description",
    image: "/images/shipping.jpg",
    expiresAt: new Date().getTime() + 1000 * 60 * 60 * 48, // 48 hours
  },
  {
    id: "offer3",
    titleKey: "offers.offer3.title",
    descriptionKey: "offers.offer3.description",
    image: "/images/shea-butter.jpg",
    expiresAt: new Date().getTime() + 1000 * 60 * 60 * 12, // 12 hours
  },
];

function getTimeRemaining(endTime) {
  const now = new Date().getTime();
  const distance = endTime - now;

  if (distance <= 0) return "Expired";

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function SpecialOffersPage() {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="pt-36">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🎁 {t("offers.title", { defaultValue: "Special Offers" })}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const timeLeft = getTimeRemaining(offer.expiresAt);
            const isExpired = timeLeft === "Expired";

            return (
              <div
                key={offer.id}
                className={`border rounded-lg shadow p-4 bg-white dark:bg-gray-800 relative ${
                  isExpired ? "opacity-50 grayscale" : ""
                }`}
              >
                <img
                  src={offer.image}
                  alt={t(offer.titleKey)}
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="text-lg font-semibold text-green-800 mt-4">
                  {t(offer.titleKey)}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {t(offer.descriptionKey)}
                </p>

                {!isExpired && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    ⏳ {timeLeft}
                  </span>
                )}

                {isExpired ? (
                  <span className="text-sm text-red-500 font-bold">
                    {t("offers.expired", { defaultValue: "Offer Expired" })}
                  </span>
                ) : (
                  <Link
                    to="/explore"
                    className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                  >
                    {t("offers.shopNow", { defaultValue: "Shop Now" })} →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
