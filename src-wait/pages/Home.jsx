import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import mustTryImagesFn from "../data/mustTryImages";

export default function Home() {
  const { t } = useTranslation([
    "hero",
    "popup",
    "products",
    "buttons",
    "footer",
  ]);
  const navigate = useNavigate();
  const mustTryImages = mustTryImagesFn(t);

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
        headers: { "Content-Type": "application/json" },
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
      img.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) =>
        img.description?.toLowerCase().includes(tag.toLowerCase())
      );
    return matchCategory && matchSearch && matchTags;
  });

  return (
    <div className="space-y-20">
      <section
        className="relative min-h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center px-4 sm:px-6 md:px-12"
        style={{ backgroundImage: "url('/images/tropinordHome.png')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-3xl w-full text-center bg-black/40 backdrop-blur-sm rounded-xl p-6 sm:p-10 shadow-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("hero.title", {
              defaultValue: "Natural Products with Global Roots",
            })}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6">
            {t("hero.subtitle", {
              defaultValue:
                "Ethical, sustainable wellness from the tropics to the north",
            })}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/explore">
              <Button className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-lg transition-colors duration-300">
                {t("buttons.explore")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-lg transition-colors duration-300">
                {t("buttons.contact", { defaultValue: "Contact TropiNord" })}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 py-12 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-700 mb-4">
          {t("hero.midHeading", {
            defaultValue: "Celebrating Afro-European Beauty",
          })}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-yellow-400 mb-6">
          {t("hero.midSubtext", {
            defaultValue: "Each image is linked to carefully selected products",
          })}
        </p>

        <div className="mb-4 max-w-md mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("hero.searchPlaceholder", {
              defaultValue: "Search by title, category or benefit...",
            })}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-yellow-400 bg-white dark:bg-gray-900"
          />
        </div>

        <div className="mb-6 max-w-xs mx-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-yellow-400 bg-white dark:bg-gray-900"
          >
            <option value="all">
              {t("hero.allCategories", { defaultValue: "All categories" })}
            </option>
            <option value="oils">
              {t("products.organic-oils.name", {
                defaultValue: "Organic Oils",
              })}
            </option>
            <option value="perfumes">
              {t("products.perfumes.name", {
                defaultValue: "Natural Perfumes",
              })}
            </option>
            <option value="teas">
              {t("products.teas.name", { defaultValue: "Teas & Coffee" })}
            </option>
          </select>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8 text-xs sm:text-sm">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-green-600 text-white"
                  : "border-green-600 text-green-600 hover:bg-green-100 dark:hover:bg-gray-700"
              }`}
            >
              {t(`tags.${tag}`)}
            </button>
          ))}
        </div>

        <div
          className="flex flex-wrap justify-center gap-4"
          onMouseMove={() => setPaused(true)}
        >
          {filteredImages.map((img, index) => (
            <div
              key={index}
              className={`w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-white shadow-lg transform transition duration-300 hover:scale-110 cursor-pointer ${
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

        {popup && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            onClick={() => setPopup(null)}
          >
            <div
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={popup.src}
                alt={popup.title}
                className="rounded-lg mb-4 w-full h-64 object-cover"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {popup.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {popup.description}
              </p>
              {productAvailable ? (
                <>
                  <Link to="/explore">
                    <Button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      {t("popup.viewProducts", {
                        defaultValue: "View Products",
                      })}
                    </Button>
                  </Link>
                  <button
                    onClick={() => setPopup(null)}
                    className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                  >
                    {t("popup.continue", { defaultValue: "Continue Browsing" })}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-green-600 font-medium mb-2">
                    {t("popup.comingSoon", { defaultValue: "Coming Soon!" })}
                  </p>
                  <button
                    onClick={() => setPopup(null)}
                    className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                  >
                    {t("popup.close", { defaultValue: "Close" })}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <section className="bg-amber-50 dark:bg-gray-900 py-12 px-6 text-center rounded-lg shadow-inner mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-yellow-300 mb-4">
            {t("blackSoap.heading", {
              defaultValue: "Explore Our Bestselling Natural Skincare",
            })}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-yellow-200 max-w-xl mx-auto mb-8">
            {t("blackSoap.description", {
              defaultValue:
                "African Black Soap is a customer favorite — known for its antibacterial power and gentle care during cold winters.",
            })}
          </p>

          <Link
            to="/products/black-soap"
            className="inline-block mt-6 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition"
          >
            {t("blackSoap.button", {
              defaultValue: "View All Black Soap Products",
            })}
          </Link>

          <p className="mt-10 text-xs text-black dark:text-gray-400 italic font-bold">
            🌱 TropiNord supports permanent carbon removal. 0.5% of every order
            funds climate solutions.
          </p>
        </section>

        <div className="mt-12 max-w-xl mx-auto px-4">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-green-700">
            {t("hero.stayInLoop", { defaultValue: "Stay updated" })}
          </h3>
          <p className="text-sm sm:text-base text-gray-700 dark:text-yellow-400 mb-4">
            {t("hero.subscribeText", {
              defaultValue:
                "Subscribe for early access to new Afro-European hair and skincare products.",
            })}
          </p>
          {subscribed ? (
            <p className="text-green-600 font-medium">
              {t("footer.successMessage", {
                defaultValue: "Subscribed successfully!",
              })}
            </p>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-2 justify-center"
              onSubmit={handleSubscribe}
            >
              <input
                id="home-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("hero.emailPlaceholder", {
                  defaultValue: "Enter your email",
                })}
                className="flex-grow p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-yellow-400 bg-white dark:bg-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t("buttons.subscribe")}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="bg-green-50 dark:bg-gray-800 text-center py-8 px-4 mt-12 rounded-lg shadow-md">
        <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-300 mb-2">
          {t("hero.helpHeading", {
            defaultValue: "Need help or want to collaborate?",
          })}
        </h3>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
          {t("hero.helpSubtext", {
            defaultValue: "For the best experience, contact us directly via",
          })}{" "}
          <a
            href="https://wa.me/+46700711713"
            className="underline font-semibold mx-1"
          >
            WhatsApp
          </a>
          {t("hero.orEmail", { defaultValue: "or send an email to" })}{" "}
          <a
            href="mailto:support@tropinord.com"
            className="underline font-semibold ml-1"
          >
            support@tropinord.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
