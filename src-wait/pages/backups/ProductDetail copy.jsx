import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import products from "@lib/products";
import { flattenProductData } from "../../utils/flattenProductData";
import { useCart } from "../../contexts/CartContext"; // ✅ Import cart

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToCart } = useCart(); // ✅ useCart hook

  const [showMessage, setShowMessage] = useState(false); // ✅ feedback state

  const subProducts = flattenProductData(products);
  const product = subProducts.find(
    (item) => item.slug === slug || encodeURIComponent(item.label) === slug
  );

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.label,
      label: product.label,
      image: product.image || product.src,
      price: product.price || 0,
      quantity: 1,
    });

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          {t("products.notFound", { defaultValue: "Product not found" }) || "Product not found."}
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ✅ Success message */}
      {showMessage && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-4">
          ✅ Added to cart!
        </div>
      )}

      <img
        src={product.image || product.src}
        alt={product.label || product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2 text-green-800">
        {product.label || product.name}
      </h1>
      <p className="text-gray-700 mb-4">
        {product.description || "No description provided."}
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Add to Cart
        </button>
        <Link
          to="/order"
          state={{
            preselect: {
              label: product.label || product.name,
              quantity: 1,
            },
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Place Order
        </Link>
        <button
          onClick={() => navigate("/products")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
}
