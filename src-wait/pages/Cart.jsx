import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CartItem from "../components/CartItem";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { t } = useTranslation();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => navigate("/checkout");

  const handleClearCart = () => setShowConfirm(true);

  const confirmClear = () => {
    clearCart();
    setShowConfirm(false);
    toast.success(t("toast.cleared", { defaultValue: "Cart cleared!" }));
  };

  const cancelClear = () => setShowConfirm(false);

  return (
    <main className="pt-32 px-4 py-8 max-w-5xl mx-auto prose dark:prose-invert">
      <div className="max-w-4xl mx-auto p-6">
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#1f2937", color: "#fff" },
            success: { icon: "✅" },
          }}
        />

        <div className="mb-4">
          <Link
            to="/explore"
            className="text-green-600 hover:underline dark:text-green-400"
          >
            {t("continueShopping", { defaultValue: "← Continue Shopping" })}
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6">
          🛒 {t("yourCart", { defaultValue: "Your Cart" })}
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">{t("emptyCart", { defaultValue: "Your cart is empty." })}</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}

            <div className="border-t pt-4">
              <div className="text-right font-bold text-xl text-green-800 dark:text-green-300">
                Total: kr{total.toFixed(2)}
              </div>
              <div className="flex justify-between mt-4 flex-wrap gap-4 items-center">
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  {t("clearCart", { defaultValue: "Clear Cart" })}
                </button>

                <div className="flex gap-4 ml-auto">
                  <button
                    onClick={() => navigate("/explore")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded transition"
                  >
                    {t("keepBrowsing", { defaultValue: "🛍️ Keep Browsing" })}
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
                  >
                    {t("proceedCheckout", { defaultValue: "➡️ Proceed to Checkout" })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
              <p className="mb-4 text-gray-800 dark:text-white">
                {t("confirmClear", { defaultValue: "Are you sure you want to clear the cart?" })}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelClear}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                >
                  {t("cancel", { defaultValue: "Cancel" })}
                </button>
                <button
                  onClick={confirmClear}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
                >
                  {t("confirm", { defaultValue: "Yes, Clear" })}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
