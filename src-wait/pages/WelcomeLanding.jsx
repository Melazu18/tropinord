import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function WelcomeLanding() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
      setShowSpinner(true);
    }, 5000);

    const navigateTimer = setTimeout(() => {
      navigate("/home");
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeOutTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`min-h-screen bg-no-repeat bg-center bg-contain flex flex-col justify-center items-center text-white transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: "url('/images/Sustainability.jpg')" }}
    >
      {/* Countdown and button/spinner */}
      <div className="flex flex-col items-center mt-10 space-y-8">
        <div className="text-6xl md:text-8xl font-mono bg-black bg-opacity-50 px-6 py-4 rounded-lg shadow-lg">
          {countdown}
        </div>

        {!showSpinner ? (
          <Link to="/home">
            <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg animate-pulse hover:bg-green-600 transition-all">
              {t("common.welcome", { defaultValue: "Welcome" })}
            </button>
          </Link>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-lg font-medium">
              {t("hero.loading")}
            </p>
          </div>
        )}
      </div>

      {/* Thank you message */}
      <h1 className="mt-16 md:mt-24 text-xl md:text-3xl font-bold text-center bg-black bg-opacity-60 px-4 py-2 rounded-md text-yellow-400">
        {t("common.sustainabilityThankYou", { defaultValue: "Thank you for choosing sustainability" })}
      </h1>
    </div>
  );
}
