// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../utils/api";
import { getRecaptchaToken } from "../utils/recaptcha"; // ✅ shared helper
import SwishQrCode from "../components/SwishQrCode";
import BankgiroInstructions from "../components/BankgiroInstructions";

export default function PaymentPage() {
  const { t, i18n } = useTranslation(["order", "products"]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [manualMethod, setManualMethod] = useState(null);
  const [redirectToCheckout, setRedirectToCheckout] = useState(false);

  useEffect(() => {
    const savedFormData = JSON.parse(
      localStorage.getItem("checkout-form") || "{}"
    );
    const initialFormData = location.state || savedFormData;
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setFormData(initialFormData);
    setCart(cartItems);
    setCartTotal(total);

    setTimeout(() => {
      validateData(initialFormData, cartItems);
    }, 0);
  }, [location.state]);

  useEffect(() => {
    if (redirectToCheckout) navigate("/checkout");
  }, [redirectToCheckout, navigate]);

  const validateData = (data, cartItems) => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "street",
      "postal",
      "city",
      "country",
    ];
    const missingFields = requiredFields.filter((field) => !data?.[field]);

    if (missingFields.length > 0) {
      toast.error(
        t("payment.missingFields", { fields: missingFields.join(", ") })
      );
      setRedirectToCheckout(true);
      return false;
    }

    if (!Array.isArray(cartItems)) {
      toast.error(
        t("payment.cartError", { defaultValue: "Failed to load your cart" })
      );
      return false;
    }

    if (cartItems.length === 0) {
      toast.error(
        t("payment.cartEmpty", {
          defaultValue: "Your cart is empty. Please go back and add items.",
        })
      );
      return false;
    }

    return true;
  };

  const handlePayment = async (method = "stripe") => {
    if (isPaymentStarted) return;
    setIsPaymentStarted(true);
    setLoading(true);
    setManualMethod(null);

    if (!validateData(formData, cart)) {
      setLoading(false);
      setIsPaymentStarted(false);
      return;
    }

    try {
      // 1) Get a reCAPTCHA token
      const token = await getRecaptchaToken("checkout");

      // 2) Verify server-side if we have a token
      if (token) {
        const vr = await fetch(`${API_BASE}/recaptcha-verify`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token, action: "checkout" }), // ✅ fixed key
        });
        const vj = await vr.json();

        if (!vr.ok || vj?.success !== true) {
          // ✅ check `success`
          toast.error(
            vj?.error === "low_score"
              ? t("payment.recaptchaLowScore", {
                  defaultValue:
                    "reCAPTCHA flagged this as suspicious. Please try again.",
                })
              : t("payment.recaptchaFailed", {
                  defaultValue:
                    "reCAPTCHA verification failed. Reload and try again.",
                })
          );
          setLoading(false);
          setIsPaymentStarted(false);
          return;
        }
      }

      // 3) Create checkout session
      const response = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          currency: formData.currency || "SEK",
          items: cart,
          total: cartTotal,
          paymentMethod: method,
          useStripe: method === "stripe",
          locale: i18n.language?.startsWith("sv") ? "sv" : "en",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data?.details) {
          const names = data.details.map((d) => d.name || d.id).join(", ");
          toast.error(
            t("payment.itemsMissingPrices", {
              defaultValue: `Some items have no price: ${names}. Please update prices or use Swish/Bankgiro.`,
            })
          );
        } else {
          toast.error(
            data?.error ||
              t("payment.paymentFailed", { defaultValue: "Payment failed" })
          );
        }
        setLoading(false);
        setIsPaymentStarted(false);
        return;
      }

      if (method === "stripe" && data?.url) {
        // Stripe redirect
        setTimeout(() => {
          window.location.href = data.url;
        }, 200);
      } else if (method === "swish" || method === "bankgiro") {
        const amountInSek = cartTotal.toFixed(2);
        navigate(
          `/thank-you?method=${method}&reference=${encodeURIComponent(
            formData.email
          )}&amount=${amountInSek}&receipt=temp.pdf`
        );
      } else {
        toast.error(
          t("payment.sessionFailed", {
            defaultValue: "Payment session could not be started",
          })
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(
        err.message ||
          t("payment.paymentError", {
            defaultValue: "Payment processing failed",
          })
      );
    } finally {
      setLoading(false);
      setIsPaymentStarted(false);
    }
  };

  const getTranslatedLabel = (item) => {
    return item.slug
      ? t(`agro.items.${item.slug}.title`, {
          defaultValue: item.label || "Unnamed Product",
        })
      : t(`${item.id}.label`, {
          defaultValue: item.label || "Unnamed Product",
        });
  };

  if (!formData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4">
          {t("payment.loadingPaymentDetails", {
            defaultValue: "Loading payment details...",
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pt-20 bg-white dark:bg-gray-800 rounded shadow">
      <Toaster position="top-right" />

      <button
        onClick={() => navigate("/checkout")}
        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        {t("payment.backToCheckout", { defaultValue: "Back to Checkout" })}
      </button>

      <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-6">
        {t("payment.chooseMethod", {
          defaultValue: "💳 Choose Payment Method",
        })}
      </h2>

      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">
          {t("payment.orderSummary", { defaultValue: "Order Summary" })}
        </h3>

        <div className="space-y-2 mb-4">
          {cart.map((item, idx) => {
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
              `${item.id || "item"}|${idx}`;

            return (
              <div key={lineKey} className="flex justify-between">
                <span>
                  {getTranslatedLabel(item)} × {item.quantity}
                </span>
                <span>
                  {(item.price * item.quantity).toFixed(2)}{" "}
                  {formData.currency || "SEK"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>{t("payment.total", { defaultValue: "Total:" })}:</span>
            <span>
              {cartTotal.toFixed(2)} {formData.currency || "SEK"}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <h4 className="font-medium mb-2">
            {t("payment.shippingTo", { defaultValue: "Shipping to:" })}
          </h4>
          <p>
            {formData.name}, {formData.street}, {formData.postal}{" "}
            {formData.city}
          </p>
          <p>{formData.country}</p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handlePayment("stripe")}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded transition-colors"
          disabled={loading}
        >
          <img
            src="/images/stripeLogo1.png"
            alt="Stripe"
            className="h-6 mr-3"
          />
          {loading
            ? t("payment.processing", { defaultValue: "Processing..." })
            : t("payment.payCard", { defaultValue: "Pay with Card" })}
        </button>

        <button
          onClick={() => handlePayment("swish")}
          className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded transition-colors"
          disabled={loading}
        >
          <img
            src="/images/swishMainLogo.png"
            alt="Swish"
            className="h-8 mr-3 rounded shadow"
          />
          {loading
            ? t("payment.processing", { defaultValue: "Processing..." })
            : t("payment.paySwish", { defaultValue: "Pay with Swish" })}
        </button>

        <button
          onClick={() => handlePayment("bankgiro")}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded transition-colors"
          disabled={loading}
        >
          <img
            src="/images/bankgirotMain.png"
            alt="Bankgiro"
            className="h-6 mr-3"
          />
          {loading
            ? t("payment.processing", { defaultValue: "Processing..." })
            : t("payment.payBankgiro", { defaultValue: "Pay with Bankgiro" })}
        </button>
      </div>
    </div>
  );
}
