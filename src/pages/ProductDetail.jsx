import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import products from "../data/products";
import { useTranslation } from "react-i18next";

export default function ProductDetail({ cartItems, setCartItems }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const product = products.find((p) => p.slug === slug);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const toggleOption = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((opt) => opt !== value)
        : [...prev, value]
    );
  };

  const addToCart = () => {
    const selectedItems = product.options.filter((opt) =>
      selectedOptions.includes(opt.value)
    );
    setCartItems([...cartItems, ...selectedItems]);
    setShowCart(true);
  };

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          {t("products.notFound") || "Product not found."}
        </h2>
        <button
          onClick={() => navigate("/explore")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {t("explore.title") || "Back to Explore"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Image Gallery */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {(product.gallery || []).map((item, index) => (
          <div key={index} className="space-y-2">
            <img
              src={item.src || item}
              alt={item.name || `${product.name} ${index + 1}`}
              className="w-full h-64 object-cover rounded"
            />
            {item.name && (
              <div className="text-sm font-medium text-gray-800">
                {item.name}
              </div>
            )}
            {item.description && (
              <div className="text-sm text-gray-600">{item.description}</div>
            )}
          </div>
        ))}
      </div>

      {/* Name & Description */}
      <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
      <p className="text-lg text-gray-700 mb-6">{product.description}</p>

      {/* Option Checkboxes */}
      {product.options && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Select your options:</h3>
          <div className="space-y-2">
            {product.options.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={addToCart}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition mr-4"
      >
        Add to Cart
      </button>

      {/* View Cart Modal */}
      {showCart && cartItems.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Your Cart</h3>
            <ul className="mb-4">
              {cartItems.map((item, index) => (
                <li key={index} className="border-b py-2 text-gray-700">
                  {item.label}
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCart(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <Link
                to="/order"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Place Order
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* External Link */}
      {product.link && (
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-200 text-green-700 px-6 py-2 rounded hover:bg-gray-100 transition mt-4"
        >
          {t("products.shopNow") || "Shop Now"}
        </a>
      )}

      {/* Contact Us Button */}
      <button
        onClick={() => navigate("/contact")}
        className="mt-4 ml-4 bg-gray-100 text-green-700 px-6 py-2 rounded border border-green-600 hover:bg-green-50 transition"
      >
        {t("contact.title") || "Contact Us"}
      </button>
    </div>
  );
}
