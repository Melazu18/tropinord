import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
  FaEnvelope,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const Footer = ({ darkMode, toggleDarkMode }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#146b39] dark:bg-[#0f2e1a] text-gold-200 py-10 px-6 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t("footer.quickLinks")}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/explore" className="hover:text-gold-100">
                {t("footer.explore")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold-100">
                {t("footer.contact")}
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-gold-100">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-gold-100">
                {t("footer.shipping")}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-gold-100">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-gold-100">
                {t("footer.terms")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
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
                href="https://wa.me/46764330523"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-100"
              >
                +46 76 433 05 23
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("footer.followUs")}</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-xl hover:text-gold-100" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-xl hover:text-gold-100" />
            </a>
            <a
              href="https://youtube.com"
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
            {t("footer.newsletter")}
          </h3>
          <form className="space-y-3">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className="w-full px-3 py-2 rounded bg-white text-black"
            />
            <button
              type="submit"
              className="w-full bg-gold-200 text-[#146b39] py-2 rounded font-semibold hover:bg-gold-100"
            >
              {t("footer.subscribe")}
            </button>
          </form>

          {/* Dark mode toggle controlled from App */}
          <div
            className="mt-6 flex items-center gap-2 cursor-pointer"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <FaSun className="text-xl transition-transform duration-500 rotate-0 hover:rotate-180" />
            ) : (
              <FaMoon className="text-xl transition-transform duration-500 rotate-0 hover:rotate-180" />
            )}
            <span className="text-sm">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gold-700 text-center text-sm">
        © {new Date().getFullYear()} TropiNord. {t("footer.rightsReserved")}
      </div>
    </footer>
  );
};

export default Footer;
