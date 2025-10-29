import React from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function AddToCartCTA({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="mt-10 p-6 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-xl text-center">
      <h3 className="text-xl font-bold mb-2 text-green-800 dark:text-green-200">
        Interested in trying this product?
      </h3>
      <button
        onClick={handleAdd}
        className="mt-2 px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded-full transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
