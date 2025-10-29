// components/CartIndicator.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function CartIndicator() {
  const { cart } = useCart();
  const [highlight, setHighlight] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (itemCount > 0) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <Link to="/cart" className="relative group">
      <span
        className={`text-2xl transition-colors duration-300 ${
          highlight ? "text-red-600" : "text-black dark:text-white"
        }`}
      >
        🛒
      </span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-ping-fast">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
