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
        className="relative w-full text-center bg-no-repeat bg-cover bg-center bg-white h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/images/tropinordHome.png')" }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Centered Text Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 bg-black/40 backdrop-blur-sm rounded-xl shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Natural Products with Global Roots
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
            Ethical, sustainable wellness, from the Tropics to the North.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/explore">
              <Button className="px-8 py-4 text-lg bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                Explore Our Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="px-8 py-4 text-lg bg-white border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Rest of your sections remain the same */}
      {/* ... */}
    </div>
  );
}
