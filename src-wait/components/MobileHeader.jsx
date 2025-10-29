// src/components/MobileHeader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white dark:bg-gray-900 shadow px-4 py-3 md:hidden">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src="/logo.png" alt="TropiNord" className="h-8 w-auto" />
        </Link>

        {/* Toggle Button */}
        <button
          onClick={toggleMenu}
          className="text-gray-700 dark:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Dropdown Navigation */}
      {isOpen && (
        <nav className="mt-4 space-y-3">
          <Link
            to="/services"
            className="block text-gray-800 dark:text-gray-100 hover:text-green-600"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            to="/faq"
            className="block text-gray-800 dark:text-gray-100 hover:text-green-600"
            onClick={toggleMenu}
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className="block text-gray-800 dark:text-gray-100 hover:text-green-600"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/offers"
            className="block text-gray-800 dark:text-gray-100 hover:text-green-600"
            onClick={toggleMenu}
          >
            Special Offers
          </Link>
          <Link
            to="/products"
            className="block text-gray-800 dark:text-gray-100 hover:text-green-600"
            onClick={toggleMenu}
          >
            Explore Products
          </Link>
          <Link
            to="/cart"
            className="block text-gray-800 dark:text-gray-100 hover:text-green-600"
            onClick={toggleMenu}
          >
            Cart
          </Link>
        </nav>
      )}
    </header>
  );
}
