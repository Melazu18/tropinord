import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const mustTryImages = [
  {
    src: "/images/afroHair04.jpg",
    title: "Afro Elegant Hair",
    description:
      "Define your curls with moisture-rich hydration for shine and shape.",
    link: "/products/afro-elegant-hair",
  },
  {
    src: "/images/afroHair03.jpg",
    title: "Afro Curly Hair in Style",
    description:
      "Our styling blend enhances natural curls with lightweight hold.",
    link: "/products/curly-hair-style",
  },
  {
    src: "/images/afroHair05.jpg",
    title: "Afro Rugged Hair",
    description:
      "Thick, textured hair gets extra strength with our herbal infusion.",
    link: "/products/rugged-hair-treatment",
  },
  {
    src: "/images/afroHair06.jpg",
    title: "Thick Afro Hair",
    description:
      "Revive coils with a botanical boost made for density and resilience.",
    link: "/products/thick-afro-care",
  },
  {
    src: "/images/mixedRaceSkin01.jpg",
    title: "Melanin-Rich Glow",
    description: "Brighten and balance skin with our vitamin-rich elixir.",
    link: "/products/melanin-skin-serum",
  },
  {
    src: "/images/mixedRaceSkin02.jpg",
    title: "Mixed Skin Beauty",
    description: "Our moisturizer respects both texture and tone.",
    link: "/products/mixed-skin-moisturizer",
  },
  {
    src: "/images/hairGrowthOil.jpg",
    title: "Hair Growth Oil",
    description:
      "Stimulate roots and awaken follicles with our essential blend.",
    link: "/products/hair-growth-oil",
  },
  {
    src: "/images/coconut-growth.jpg",
    title: "Coconut Growth",
    description:
      "Tame dryness and encourage healthy growth with tropical nourishment.",
    link: "/products/coconut-growth",
  },
  {
    src: "/images/coconut-growth01.jpg",
    title: "Coconut Strength",
    description: "Add bounce and resilience with every drop.",
    link: "/products/coconut-strength",
  },
  {
    src: "/images/avocadoOil001.jpg",
    title: "Avocado Oil Essence",
    description:
      "Deeply condition your strands with cold-pressed avocado goodness.",
    link: "/products/avocado-oil-essence",
  },
  {
    src: "/images/avocadoOil002.jpg",
    title: "Deep Moisture",
    description: "Seal in hydration for lasting softness and shine.",
    link: "/products/deep-moisture",
  },
  {
    src: "/images/afroEuroCream01.jpg",
    title: "Afro-Euro Cream",
    description:
      "Combines rich African butters and Nordic purity for versatile hair styling.",
    link: "/products/afro-euro-cream",
  },
  {
    src: "/images/afroHair02.jpg",
    title: "The Origin",
    description:
      "Celebrate your roots with natural nourishment from the earth.",
    link: "/products/the-origin",
  },
];

export default function Home() {
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);
  const [popup, setPopup] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => setPaused(true);
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("http://localhost:3001/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubscribed(true);
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section
        className="relative w-full text-center bg-no-repeat bg-cover bg-center bg-white h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/images/tropinordHome.png')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 bg-black/40 backdrop-blur-sm rounded-xl shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Natural Products with Global Roots
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
            Ethical, sustainable wellness, from the Tropics to the North.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/explore">
              <Button className="px-8 py-3 text-lg font-medium bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-lg transition-colors duration-300">
                Explore Our Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="px-8 py-3 text-lg font-medium bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-lg transition-colors duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Must Try Section */}
      <section
        id="must-try"
        className="relative bg-white dark:bg-gray-800 py-16 px-4 text-center"
      >
        <h2 className="text-3xl font-bold text-amber-700 mb-10">
          Celebrating Afro-European Beauty
        </h2>
        <div
          className="flex flex-wrap justify-center gap-4 animate-floating transition-all duration-500 ease-in-out"
          onMouseMove={() => setPaused(true)}
        >
          {mustTryImages.map((img, index) => (
            <div
              key={index}
              className={`w-32 h-32 rounded-full overflow-hidden border-2 border-white shadow-lg transform transition duration-300 hover:scale-110 cursor-pointer ${
                !paused ? "animate-bounce-slow" : ""
              }`}
              onClick={() => setPopup(img)}
            >
              <img
                src={img.src}
                alt={img.title}
                title={img.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Popup Card */}
        {popup && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setPopup(null)}
          >
            <div
              className="bg-white dark:bg-gray-900 max-w-md rounded-xl p-6 text-left shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={popup.src}
                alt={popup.title}
                className="rounded-lg mb-4 w-full h-64 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">
                <Link
                  to={popup.link}
                  className="text-green-700 hover:underline"
                >
                  {popup.title}
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {popup.description}
              </p>
              <button
                onClick={() => setPopup(null)}
                className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Email Signup */}
        <div className="mt-16 max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-green-700">
            Stay in the Loop
          </h3>
          <p className="text-gray-700 mb-6">
            Subscribe to get early access to new Afro-European hair & skincare
            releases.
          </p>
          {subscribed ? (
            <p className="text-green-600 font-medium">✅ You're subscribed!</p>
          ) : (
            <form
              className="flex gap-2 justify-center"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border p-2 rounded w-full"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
