import React, { useState, useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaChevronDown,
  FaChevronUp,
  FaArrowUp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalCaption, setModalCaption] = useState("");

  const toggleDropdown = (item) => {
    setOpenDropdown(openDropdown === item ? null : item);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = () => {
    if (email.includes("@") && email.includes(".")) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const dropdownItems = {
    follow: [
      { icon: <FaFacebook />, text: "Facebook", href: "https://facebook.com" },
      {
        icon: <FaInstagram />,
        text: "Instagram",
        href: "https://instagram.com",
      },
      { icon: <FaYoutube />, text: "YouTube", href: "https://youtube.com" },
    ],
  };

  const instagramCaptions = [
    "Harvest Day in Ghana",
    "Shea Butter in the Making",
    "Packing with Love",
    "Nordic Wellness Showcase",
    "Eco Soap Behind the Scenes",
    "Community Farmers Market",
  ];

  return (
    <footer className="relative bg-[#146b39] text-gold-300 pt-12 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Follow Us */}
          <div>
            <h3
              onClick={() => toggleDropdown("follow")}
              className="flex items-center gap-2 text-lg font-semibold mb-4 cursor-pointer text-gold-400 hover:text-gold-200 transition"
            >
              <span>{t("footer.followUs")}</span>
              {openDropdown === "follow" ? <FaChevronUp /> : <FaChevronDown />}
            </h3>
            {openDropdown === "follow" && (
              <ul className="space-y-2">
                {dropdownItems.follow.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 hover:text-gold-200 transition"
                  >
                    <span className="text-gold-400">{item.icon}</span>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold-400">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li className="hover:text-gold-200 transition">
                <a href="/support">{t("footer.support")}</a>
              </li>
              <li className="hover:text-gold-200 transition">
                <a href="/suggestions">{t("footer.suggestions")}</a>
              </li>
              <li className="hover:text-gold-200 transition">
                <a href="/testimonials">{t("footer.testimonials")}</a>
              </li>
              <li className="hover:text-gold-200 transition">
                <a href="/privacy">{t("footer.privacy")}</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gold-400">
              {t("footer.newsletter")}
            </h3>
            <p className="mb-4">{t("footer.newsletterDesc")}</p>
            <div className="flex flex-col sm:flex-row max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.emailPlaceholder")}
                className="px-4 py-2 w-full rounded-l text-gray-800 focus:outline-none"
                aria-label="Email address"
              />
              <button
                onClick={handleSubscribe}
                className="bg-gold-500 hover:bg-gold-600 text-green-800 font-medium px-4 py-2 rounded-r mt-2 sm:mt-0 transition"
              >
                {t("footer.subscribe")}
              </button>
            </div>
            {submitted && (
              <p className="text-green-100 mt-2">{t("footer.thankYou")}</p>
            )}
          </div>
        </div>

        {/* Instagram Preview (local images) */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gold-400">
            {t("footer.instagramGallery")}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative cursor-pointer"
                onClick={() => {
                  setModalImage(`/images/instagram${i}.jpg`);
                  setModalCaption(instagramCaptions[i - 1]);
                }}
              >
                <img
                  src={`/images/instagram${i}.jpg`}
                  alt={`Instagram preview ${i}`}
                  loading="lazy"
                  className="rounded shadow-md object-cover w-full h-24 sm:h-32 lg:h-36 hover:opacity-80 transition"
                />
                <p className="text-xs text-center mt-1">
                  #{t("footer.instagramTag")}
                  {i}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-gold-200 hover:text-white transition"
            >
              {t("footer.viewOnInstagram")}
            </a>
          </div>
        </div>

        {/* Modal Lightbox */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4"
            onClick={() => setModalImage(null)}
          >
            <img
              src={modalImage}
              alt="Instagram full view"
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
            />
            <p className="text-gold-200 text-sm mt-4 text-center">
              {modalCaption}
            </p>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-gold-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gold-300 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TropiNord.{" "}
            {t("footer.rightsReserved")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#" className="hover:text-gold-200 transition">
              {t("footer.terms")}
            </a>
            <a href="#" className="hover:text-gold-200 transition">
              {t("footer.shipping")}
            </a>
            <a href="#" className="hover:text-gold-200 transition">
              {t("footer.returns")}
            </a>
          </div>
        </div>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-16 right-18 bg-white text-green-700 p-3 rounded-full shadow-xl border border-green-700 hover:bg-green-100 transition-transform transform hover:scale-110 z-50"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="animate-bounce" />
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
