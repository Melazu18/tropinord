import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const mustTryImages = [
  {
    src: "/images/afroHair04.jpg",
    title: "Afro Elegant Hair",
    description:
      "Define your curls with moisture-rich hydration for shine and shape.",
    link: "/products/oils",
    tags: ["curls", "hydration"],
  },
  {
    src: "/images/darkCurlyHair01.jpg",
    title: "Velvet Curl Harmony",
    description:
      "Velvety texture and lush definition—crafted for confident curl expression.",
    link: "/products/oils",
    tags: ["curl", "definition"],
  },
  {
    src: "/images/afroHair05.jpg",
    title: "Afro Rugged Hair",
    description:
      "Thick, textured hair gets extra strength with our herbal infusion.",
    link: "/products/oils",
    tags: ["thick hair", "herbal"],
  },
  {
    src: "/images/afroHair06.jpg",
    title: "Thick Afro Hair",
    description:
      "Revive coils with a botanical boost made for density and resilience.",
    link: "/products/oils",
    tags: ["botanical", "resilience"],
  },
  {
    src: "/images/roll-on02.jpg",
    title: "Midnight Sun Bouquet(roll-on)",
    description:
      "A gentle, aluminum-free roll-on infused with Arctic wildflower extracts and golden honey to soothe skin, while Nordic birch sap neutralizes odor naturally. Lightly scented with midnight musk for a whisper of enduring freshness day or midnight sun.",
    link: "/products/perfumes",
    tags: ["roll-on", "deodorant"],
  },
  {
    src: "/images/tea001.png",
    title: "Herbal Inner Glow Tea",
    description:
      "Sip serenity, our herbal blend calms your spirit and nourishes from within.",
    link: "/products/teas",
    tags: ["tea", "herbal"],
  },
  {
    src: "/images/beautyTone.jpg",
    title: "Radiant Skin Tone",
    description:
      "Bring out your natural radiance with our tone-enhancing elixir, gentle, glowing, graceful.",
    link: "/products/oils",
    tags: ["radiance", "skin"],
  },
  {
    src: "/images/afroHair03.jpg",
    title: "Afro Curly Hair in Style",
    description:
      "Our styling blend enhances natural curls with lightweight hold.",
    link: "/products/oils",
    tags: ["styling", "curls"],
  },
  {
    src: "/images/blondCurlyHair01.jpg",
    title: "Golden Curls Delight",
    description:
      "Soft, bouncy blond curls enhanced with golden botanicals and gentle care.",
    link: "/products/oils",
    tags: ["blond", "curls"],
  },
  {
    src: "/images/mixedRaceSkin01.jpg",
    title: "Melanin-Rich Glow",
    description: "Brighten and balance skin with our vitamin-rich elixir.",
    link: "/products/oils",
    tags: ["melanin", "glow"],
  },
  {
    src: "/images/mixedRaceSkin02.jpg",
    title: "Mixed Skin Beauty",
    description: "Our moisturizer respects both texture and tone.",
    link: "/products/oils",
    tags: ["moisturizer", "mixed skin"],
  },
  {
    src: "/images/coconut-growth.jpg",
    title: "Coconut Growth",
    description:
      "Tame dryness and encourage healthy growth with tropical nourishment.",
    link: "/products/oils",
    tags: ["coconut", "growth"],
  },
  {
    src: "/images/coconut-growth01.jpg",
    title: "Coconut Strength",
    description: "Add bounce and resilience with every drop.",
    link: "/products/oils",
    tags: ["coconut", "strength"],
  },
  {
    src: "/images/avocadoOil001.jpg",
    title: "Avocado Oil Essence",
    description:
      "Deeply condition your strands with cold-pressed avocado goodness.",
    link: "/products/oils",
    tags: ["avocado", "condition"],
  },
  {
    src: "/images/avocadoOil002.jpg",
    title: "Deep Moisture",
    description: "Seal in hydration for lasting softness and shine.",
    link: "/products/oils",
    tags: ["moisture", "hydration"],
  },
  {
    src: "/images/afroEuroCream01.jpg",
    title: "Afro-Euro Cream",
    description:
      "Combines rich African butters and Nordic purity for versatile hair styling.",
    link: "/products/oils",
    tags: ["cream", "styling"],
  },
  {
    src: "/images/afroHair02.jpg",
    title: "The Origin",
    description:
      "Celebrate your roots with natural nourishment from the earth.",
    link: "/products/oils",
    tags: ["roots", "nourishment"],
  },
  {
    src: "/images/naturalPerfumes.png",
    title: "Natural Perfume Essence",
    description:
      "Experience subtle luxury with nature's own fragrance, pure, warm, and soul-soothing.",
    link: "/products/perfumes",
    tags: ["perfume", "natural"],
  },
  {
    src: "/images/hairGrowthOil.jpg",
    title: "Hair Growth Oil",
    description:
      "Stimulate roots and awaken follicles with our essential blend.",
    link: "/products/oils",
    tags: ["growth", "oil"],
  },
];

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [popup, setPopup] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [productAvailable, setProductAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = ["hydrating", "growth", "glow", "curl", "skin", "botanical"];

  useEffect(() => {
    const handleMouseMove = () => setPaused(true);
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setProductAvailable(true);
    }, 3000);
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

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredImages = mustTryImages.filter((img) => {
    const matchCategory =
      selectedCategory === "all" || img.link.includes(selectedCategory);
    const matchSearch =
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) =>
        img.description.toLowerCase().includes(tag.toLowerCase())
      );
    return matchCategory && matchSearch && matchTags;
  });

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
        <h2 className="text-3xl font-bold text-amber-700 mb-4">
          Celebrating Afro-European Beauty
        </h2>
        <p className="text-gray-600 dark:text-yellow-400 mb-10">
          There are products linked with every image
        </p>
        <div className="mb-4 max-w-md mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-yellow-400 bg-white dark:bg-gray-900"
          />
        </div>
        <div className="mb-6 max-w-xs mx-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-yellow-400 bg-white dark:bg-gray-900"
          >
            <option value="all">All Categories</option>
            <option value="oils">Oils</option>
            <option value="perfumes">Perfumes</option>
            <option value="teas">Teas</option>
          </select>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-1 rounded-full border text-sm transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-green-600 text-white"
                  : "border-green-600 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700"
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>

        <div
          className="flex flex-wrap justify-center gap-4 animate-floating transition-all duration-500 ease-in-out"
          onMouseMove={() => setPaused(true)}
        >
          {filteredImages.map((img, index) => (
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
              <h3 className="text-xl font-semibold mb-2">{popup.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {popup.description}
              </p>

              {productAvailable ? (
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(popup.link)}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    View Products
                  </Button>
                  <button
                    onClick={() => setPopup(null)}
                    className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-green-600 font-medium">Coming Soon!</p>
                  <button
                    onClick={() => setPopup(null)}
                    className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Signup */}
        <div className="mt-16 max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-green-700">
            Stay in the Loop
          </h3>
          <p className="text-gray-700 dark:text-yellow-400 mb-6">
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
                className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-yellow-400 bg-white dark:bg-gray-900"
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
      <section className="bg-green-50 dark:bg-gray-800 text-center py-8 px-4 mt-12 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
          Need Help or Want to Partner?
        </h3>
        <p className="text-gray-700 dark:text-gray-200">
          For the best experience, reach out to us directly on{" "}
          <a
            href="https://wa.me/+46700711713"
            className="underline font-semibold"
          >
            WhatsApp
          </a>{" "}
          or send us an email at{" "}
          <a
            href="mailto:support@tropinord.com"
            className="underline font-semibold"
          >
            support@tropinord.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
