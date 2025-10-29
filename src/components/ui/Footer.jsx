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
import { routeMap } from "../../routes/routeMap";
import { API_BASE } from "../../utils/api";

const Footer = () => {
  const { t, i18n } = useTranslation("footer");
  const lang = i18n.language || "en";
  const pathFor = (key) => `/${lang}/${routeMap[key]?.[lang] || key}`;

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({
        text: t("invalidEmail", {
          defaultValue: "Please enter a valid email address.",
        }),
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API_BASE}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");

      setMessage({
        text: t("thankYou", {
          defaultValue: "Thank you for subscribing!",
        }),
        type: "success",
      });
      setEmail("");
    } catch {
      setMessage({
        text: t("subscriptionFailed", {
          defaultValue: "Subscription failed, please try again.",
        }),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      id="site-footer"
      className="bg-[#146b39] dark:bg-[#0f2e1a] text-gold-200 px-4 sm:px-6 py-10 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        {/* Grid with 4 sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <details className="md:open" open>
            <summary className="flex justify-between items-center cursor-pointer text-base sm:text-lg font-semibold mb-2 md:mb-4 list-none">
              {t("quickLinks", { defaultValue: "Quick Links" })}
              <span className="md:hidden">+</span>
            </summary>
            <ul className="space-y-2 text-sm sm:text-base px-1">
              <li>
                <Link to={pathFor("blog")} className="hover:text-gold-100">
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link to={pathFor("shipping")} className="hover:text-gold-100">
                  {t("shipping")}
                </Link>
              </li>
              <li>
                <Link to={pathFor("privacy")} className="hover:text-gold-100">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link to={pathFor("terms")} className="hover:text-gold-100">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </details>

          {/* Contact */}
          <details className="md:open" open>
            <summary className="flex justify-between items-center cursor-pointer text-base sm:text-lg font-semibold mb-2 md:mb-4 list-none">
              {t("contact", { defaultValue: "Contact" })}
              <span className="md:hidden">+</span>
            </summary>
            <ul className="space-y-3 text-sm sm:text-base px-1">
              <li className="flex items-center gap-2">
                <FaEnvelope aria-hidden="true" />
                <a
                  href="mailto:info@tropinord.com"
                  className="hover:text-gold-100 break-words"
                >
                  info@tropinord.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp aria-hidden="true" />
                <a
                  href="https://wa.me/46700711713"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-100"
                >
                  +46 70 071 17 13
                </a>
              </li>
              {/* Seller support contact */}
              <li className="flex items-center gap-2 mt-4">
                <FaEnvelope aria-hidden="true" />
                <a
                  href="mailto:sellers@tropinord.com"
                  className="hover:text-gold-100 break-words text-sm"
                >
                  {t("sellerSupport", {
                    defaultValue: "Seller Support",
                  })}
                </a>
              </li>
            </ul>
          </details>

          {/* Social */}
          <details className="md:open" open>
            <summary className="flex justify-between items-center cursor-pointer text-base sm:text-lg font-semibold mb-2 md:mb-4 list-none">
              {t("followUs", { defaultValue: "Follow Us" })}
              <span className="md:hidden">+</span>
            </summary>
            <div className="flex items-center space-x-4 text-xl px-1">
              <a
                href="https://www.facebook.com/profile.php?id=61578002531931"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-gold-100"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/tropinord/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-gold-100"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.youtube.com/channel/UCD5Asc8IiVf76VipxABpUZA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-gold-100"
              >
                <FaYoutube />
              </a>
            </div>
          </details>

          {/* Newsletter */}
          <details className="md:open" open>
            <summary className="flex justify-between items-center cursor-pointer text-base sm:text-lg font-semibold mb-2 md:mb-4 list-none">
              {t("newsletter", { defaultValue: "Newsletter" })}
              <span className="md:hidden">+</span>
            </summary>
            <form onSubmit={handleSubmit} className="space-y-3 px-1">
              <label htmlFor="newsletter-email" className="sr-only">
                {t("emailLabel", { defaultValue: "Email Address" })}
              </label>
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder", {
                  defaultValue: "Enter your email address",
                })}
                className="w-full px-3 py-3 rounded bg-white text-black text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                aria-invalid={message.type === "error" ? "true" : "false"}
              />
              <button
                type="submit"
                className="w-full bg-gold-200 text-[#146b39] py-3 rounded font-semibold hover:bg-gold-100 disabled:opacity-50 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("subscribing", { defaultValue: "Subscribing..." })
                  : t("subscribe", {
                      ns: "buttons",
                      defaultValue: "Subscribe",
                    })}
              </button>
              {message.text && (
                <p
                  role="status"
                  className={`text-sm ${
                    message.type === "success"
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>

            <div className="mt-4">
              <ThemeToggle />
            </div>
          </details>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gold-700 text-center text-sm">
          © {new Date().getFullYear()} TropiNord.{" "}
          {t("rightsReserved", { defaultValue: "All rights reserved." })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
