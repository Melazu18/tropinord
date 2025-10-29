import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({ text: t("footer.invalidEmail", { defaultValue: "Please enter a valid email address" }), type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("https://api.tropinord.com/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage({ text: t("footer.thankYou", { defaultValue: "Thank you for subscribing!" }), type: "success" });
        setEmail("");
      } else throw new Error("Subscription failed");
    } catch (error) {
      setMessage({ text: t("footer.subscriptionFailed", { defaultValue: "Subscription failed, please try again" }), type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#146b39] dark:bg-[#0f2e1a] text-gold-200 py-10 px-6 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t("footer.quickLinks", { defaultValue: "Quick Links" })}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/blog" className="hover:text-gold-100">
                {t("footer.blog", { defaultValue: "Blog" })}
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-gold-100">
                {t("footer.shipping", { defaultValue: "Shipping Policy" })}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-gold-100">
                {t("footer.privacy", { defaultValue: "Privacy Policy" })}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-gold-100">
                {t("footer.terms", { defaultValue: "Terms of Service" })}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("footer.contact", { defaultValue: "Contact" })}</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FaEnvelope />
              <a
                href="mailto:info@tropinord.com"
                className="hover:text-gold-100"
              >
                info@tropinord.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaWhatsapp />
              <a
                href="https://wa.me/46700711713"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-100"
              >
                +46 70 071 17 13
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("footer.followUs", { defaultValue: "Follow Us" })}</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=61578002531931"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-xl hover:text-gold-100" />
            </a>
            <a
              href="https://www.instagram.com/tropinord/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-xl hover:text-gold-100" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCD5Asc8IiVf76VipxABpUZA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-xl hover:text-gold-100" />
            </a>
          </div>
        </div>

        {/* Newsletter & Theme Toggle */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t("footer.newsletter", { defaultValue: "Newsletter" })}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              id="newsletter-email"
              type="email"
              placeholder={t("footer.emailPlaceholder", { defaultValue: "Enter your email address" })}
              className="w-full px-3 py-2 rounded bg-white text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              className="w-full bg-gold-200 text-[#146b39] py-2 rounded font-semibold hover:bg-gold-100 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("footer.subscribing", { defaultValue: "Subscribing..." }) : t("footer.subscribe")}
            </button>
            {message.text && (
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-green-300" : "text-red-300"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>

          {/* Theme Toggle shared component */}
          <ThemeToggle className="mt-6" />
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gold-700 text-center text-sm">
        © {new Date().getFullYear()} TropiNord. {t("footer.rightsReserved", { defaultValue: "All rights reserved." })}
      </div>
    </footer>
  );
};

export default Footer;
