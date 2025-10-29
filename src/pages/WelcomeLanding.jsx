import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { getRegionFromHost } from "../utils/getRegion";

export default function WelcomeLanding() {
  const { t } = useTranslation("hero");
  const navigate = useNavigate();
  const region = getRegionFromHost();
  const [step, setStep] = useState(0);
  const audioRef = useRef(null);

  // Destination always points to localized Home
  const destination = region === "se" ? "/sv/hem" : "/en/home";

  useEffect(() => {
    i18n.changeLanguage(region === "se" ? "sv" : "en");
    localStorage.setItem("lang", region === "se" ? "sv" : "en");

    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      if (step < 2) setStep(step + 1);
      else navigate(destination); // Always navigate to Home
    }, 4000);

    return () => clearTimeout(timer);
  }, [step, navigate, region]);

  const handleSkip = () => navigate(destination); // Always goes to Home

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <audio ref={audioRef} loop src="/audio/ambient.mp3" />
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleSkip}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-md transition"
        >
          {region === "se" ? "Hoppa över" : "Skip"}
        </button>
      </div>

      {step === 1 && (
        <div className="flex items-center justify-center h-screen px-6">
          <img
            src="/images/coverPage01.png"
            alt="TropiNord Cover"
            className="max-w-full max-h-[80vh] object-contain rounded-md shadow-lg"
          />
        </div>
      )}

      {step === 2 && (
        <div className="flex items-center justify-center flex-col h-screen px-6 text-center">
          <img
            src="/images/climateImage01.jpg"
            alt="Sustainability"
            className="max-w-full max-h-[70vh] object-cover rounded-md shadow-lg mb-6"
          />
          <p className="text-xl sm:text-2xl font-semibold text-green-300">
            Thank you for choosing sustainability!
          </p>
        </div>
      )}
    </main>
  );
}
