import React, { useState, useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaChevronDown,
  FaChevronUp,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const toggleDropdown = (item) => {
    setOpenDropdown(openDropdown === item ? null : item);
  };

  const dropdownItems = {
    follow: [
      { icon: <FaFacebook />, text: "Facebook", href: "https://facebook.com" },
      {
        icon: <FaInstagram />,
        text: "Instagram",
        href: "https://instagram.com",
      },
      {
        icon: <FaYoutube />,
        text: "YouTube Channel",
        href: "https://youtube.com",
      },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#146b39] text-gold-300 pt-12 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Follow Us */}
          <div>
            <h3
              onClick={() => toggleDropdown("follow")}
              className="flex items-center justify-start gap-2 text-lg font-semibold mb-4 cursor-pointer text-gold-400 hover:text-gold-200 transition"
            >
              <span>Follow Us</span>
              {openDropdown === "follow" ? (
                <FaChevronUp className="text-gold-400" />
              ) : (
                <FaChevronDown className="text-gold-400" />
              )}
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
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li className="hover:text-gold-200 transition">
                <a href="/support">Support Us</a>
              </li>
              <li className="hover:text-gold-200 transition">
                <a href="/suggestions">Product Suggestions</a>
              </li>
              <li className="hover:text-gold-200 transition">
                <a href="/testimonials">Testimonials</a>
              </li>
              <li className="hover:text-gold-200 transition">
                <a href="/privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gold-400">
              Stay Updated
            </h3>
            <p className="mb-4">
              Subscribe to our newsletter for the latest updates
            </p>
            <div className="flex max-w-md">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l text-gray-800 focus:outline-none"
              />
              <button className="bg-gold-500 hover:bg-gold-600 text-green-800 font-medium px-4 py-2 rounded-r transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gold-300 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TropiNord. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-200 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gold-200 transition">
              Shipping Policy
            </a>
            <a href="#" className="hover:text-gold-200 transition">
              Returns Policy
            </a>
          </div>
        </div>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-white text-green-700 p-3 rounded-full shadow-xl border border-green-700 hover:bg-green-100 transition-transform transform hover:scale-110 z-50"
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
