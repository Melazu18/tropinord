// src/pages/Cart.jsx
import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CartItem from "../components/CartItem";
import { useTranslation } from "react-i18next";
import { routeMap } from "../routes/routeMap";
import { useCurrency } from "../shared/ui/CurrencyProvider";

export default function CartPage() {
  const { t, i18n } = useTranslation(["cart", "products"]);
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const { currency, priceFor, format } = useCurrency();

  const lang = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

  // Where the user came from (if caller passed it)
  const from = location.state?.from || null;

  // 🧮 Total in currently selected currency
  const totalInCur = cart.reduce((sum, item) => {
    const unit = Number(priceFor(item, currency) || 0);
    if (!Number.isFinite(unit)) return sum;
    return sum + unit * (item.quantity || 1);
  }, 0);

  // Localized routes
  const exploreSlug =
    (routeMap?.explore && routeMap.explore[lang]) || "explore";
  const checkoutSlug =
    (routeMap?.checkout && routeMap.checkout[lang]) || "checkout";

  const explorePath = `/${lang}/${exploreSlug}`;
  const checkoutPath = `/${lang}/${checkoutSlug}`;

  const handleCheckout = () => navigate(checkoutPath);

  const handleClearCart = () => setShowConfirm(true);

  const confirmClear = () => {
    clearCart();
    setShowConfirm(false);
    toast.success(t("toast.cleared", { defaultValue: "Cart cleared!" }));
  };

  const cancelClear = () => setShowConfirm(false);

  // ✅ Hybrid behavior:
  // 1) If we were given an explicit "from", go there.
  // 2) Otherwise, always go to localized Explore.
  const handleKeepBrowsing = () => {
    if (from) {
      navigate(from);
      return;
    }
    navigate(explorePath);
  };

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
          {/* Button respects "from" first, else Explore */}
          <button
            type="button"
            onClick={handleKeepBrowsing}
            className="text-green-600 hover:underline dark:text-green-400"
          >
            {t("continueShopping", { defaultValue: "← Continue Shopping" })}
          </button>

          {/* Direct link to Explore (explicit, predictable) */}
          <span className="ml-3 text-sm">
            <Link
              to={explorePath}
              className="text-gray-500 hover:underline dark:text-gray-300"
            >
              ({t("goToBrowse", { defaultValue: "Go to browse" })})
            </Link>
          </span>
        </div>

        <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6">
          🛒 {t("yourCart", { defaultValue: "Your Cart" })}
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">
            {t("emptyCart", { defaultValue: "Your cart is empty." })}
          </p>
        ) : (
          <div className="space-y-6">
            {cart.map((item, idx) => {
              // Stable key per line item
              const lineKey =
                item._lineId ||
                item.key ||
                [
                  item.id,
                  item.variant,
                  item.size,
                  item.length,
                  item.option,
                  item.note,
                ]
                  .filter(Boolean)
                  .join("|") ||
                `${item.id}|${idx}`;

              return (
                <CartItem
                  key={lineKey}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              );
            })}

            <div className="border-t pt-4">
              <div className="text-right font-bold text-xl text-green-800 dark:text-green-300">
                {t("toast.total", { defaultValue: "Total" })}:{" "}
                {format(totalInCur, currency)}
              </div>

              <div className="flex justify-between mt-4 flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  {t("clearCart", { defaultValue: "Clear Cart" })}
                </button>

                <div className="flex gap-4 ml-auto">
                  <button
                    type="button"
                    onClick={handleKeepBrowsing}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded transition"
                  >
                    {t("keepBrowsing", { defaultValue: " Keep Browsing" })}
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
                  >
                    {t("proceedCheckout", {
                      defaultValue: " Proceed to Checkout",
                    })}
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
                {t("confirmClear", {
                  defaultValue: "Are you sure you want to clear the cart?",
                })}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={cancelClear}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                >
                  {t("cancel", { defaultValue: "Cancel" })}
                </button>
                <button
                  type="button"
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
