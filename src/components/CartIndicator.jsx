// components/CartIndicator.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function CartIndicator() {
  const { cart } = useCart();
  const [highlight, setHighlight] = useState(false);

  // Robust item count (handles undefined / string quantities safely)
  const itemCount = useMemo(
    () =>
      (cart || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cart]
  );

  useEffect(() => {
    if (itemCount > 0) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center justify-center w-10 h-10 group z-20"
      aria-label={`Cart (${itemCount} items)`}
    >
      <span
        className={`text-2xl transition-colors duration-300 ${
          highlight ? "text-red-600" : "text-black dark:text-white"
        }`}
      >
        🛒
      </span>
      {itemCount > 0 && (
        <span
          className={`absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ${
            highlight ? "animate-ping-fast" : ""
          }`}
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
}
