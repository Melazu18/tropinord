import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SwishQrCode from "../components/SwishQrCode";
import BankgiroInstructions from "../components/BankgiroInstructions";
import { useTranslation } from "react-i18next";

export default function PaymentPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [manualMethod, setManualMethod] = useState(null);

  useEffect(() => {
    const savedFormData = JSON.parse(
      localStorage.getItem("checkout-form") || "{}"
    );
    const initialFormData = location.state || savedFormData;
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
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
      navigate("/checkout");
      return false;
    }

    if (!Array.isArray(cartItems)) {
      toast.error(t("payment.cartError", { defaultValue: "Failed to load your cart" }));
      return false;
    }

    if (cartItems.length === 0) {
      toast.error(t("payment.cartEmpty", { defaultValue: "Your cart is empty. Please go back and add items." }));
      return false;
    }

    return true;
  };

  const handlePayment = async (method = "stripe") => {
    if (!validateData(formData, cart)) return;

    setLoading(true);
    setManualMethod(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          currency: formData.currency || "SEK",
          items: cart,
          total: cartTotal,
          paymentMethod: method,
          useStripe: method === "stripe",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("payment.paymentFailed", { defaultValue: "Payment failed" }));
      }

      if (data?.url) {
        window.location.href = data.url;
      } else if (method === "swish" || method === "bankgiro") {
        const amountInSek = cartTotal.toFixed(2);
        navigate(
          `/thank-you?method=${method}&reference=${formData.email}&amount=${amountInSek}&receipt=temp.pdf`
        );
      } else {
        toast.error(t("payment.sessionFailed", { defaultValue: "Payment session could not be started" }));
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.message || t("payment.paymentError", { defaultValue: "Payment processing failed" }));
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4">{t("payment.loadingPaymentDetails", { defaultValue: "Loading payment details..." })}</p>
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
        {t("payment.chooseMethod", { defaultValue: "💳 Choose Payment Method" })}
      </h2>

      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">
          {t("payment.orderSummary", { defaultValue: "Order Summary" })}
        </h3>

        <div className="space-y-2 mb-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.label} × {item.quantity}
              </span>
              <span>
                {(item.price * item.quantity).toFixed(2)}{" "}
                {formData.currency || "SEK"}
              </span>
            </div>
          ))}
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
          <h4 className="font-medium mb-2">{t("payment.shippingTo", { defaultValue: "Shipping to:" })}</h4>
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
          {loading ? t("payment.processing", { defaultValue: "Processing..." }) : t("payment.payCard", { defaultValue: "Pay with Card" })}
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
          {loading ? t("payment.processing", { defaultValue: "Processing..." }) : t("payment.paySwish", { defaultValue: "Pay with Swish" })}
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
          {loading ? t("payment.processing", { defaultValue: "Processing..." }) : t("payment.payBankgiro", { defaultValue: "Pay with Bankgiro" })}
        </button>
      </div>
    </div>
  );
}
