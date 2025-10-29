import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import SwishQrCode from "../components/SwishQrCode";
import BankgiroInstructions from "../components/BankgiroInstructions";
import { toast } from "react-toastify";
import orders from "../data/orders.json";
import { useTranslation } from "react-i18next";

export default function ThankYou() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const receipt = searchParams.get("receipt");
  const method = searchParams.get("method");
  const reference = searchParams.get("reference");
  const email = searchParams.get("reference");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  const isStripe = method === "stripe";
  const isSwish = method === "swish";
  const isBankgiro = method === "bankgiro";
  const isManualMethod = isSwish || isBankgiro;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/session-status?sessionId=${sessionId}`);
        const data = await res.json();
        setSession(data);
        clearCart();
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) {
      fetchSession();
    } else {
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  const sessionAmount = session
    ? (session.amount_total / 100).toFixed(2)
    : null;
  const searchAmount = searchParams.get("amount")?.replace(/[^\d.]/g, "");
  const fallbackOrder = orders.find((o) => o.email === email);
  const fallbackAmount = fallbackOrder
    ? (fallbackOrder.amount / 100).toFixed(2)
    : null;

  const amount =
    sessionAmount ||
    (searchAmount && parseFloat(searchAmount).toFixed(2)) ||
    fallbackAmount ||
    "0.00";

  const customerName =
    session?.customer_details?.name ||
    session?.customer_email ||
    reference ||
    t("order.customer", { defaultValue: "Customer" });

  const handleCopy = (text, label = t("order.text", { defaultValue: "Text" })) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} ${t("order.copied", { defaultValue: "Copied!" })}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        {t("order.loading", { defaultValue: "Loading..." })}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          {isManualMethod ? t("order.manualReceived", { defaultValue: "⏳ Order received!" }) : t("order.success", { defaultValue: "✅ Payment successful!" })}
        </h1>

        <p className="text-lg text-gray-800 dark:text-gray-200 mb-2">
          {isManualMethod ? t("order.thanks", { defaultValue: "Thanks" }) : t("order.thankYou", { defaultValue: "Thank you" })}{" "}
          <span className="font-semibold text-green-800 dark:text-green-400">
            {customerName}
          </span>{" "}
          {isManualMethod ? t("order.orderReceived", { defaultValue: "Your order has been received." }) : t("order.forOrder", { defaultValue: "for your order!" })}
        </p>

        <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
          {isManualMethod ? (
            <>{t("order.manualInstructions", { defaultValue: "Please follow the instructions below to complete your payment." })}</>
          ) : (
            <>{t("order.paymentReceived", { amount })}</>
          )}
        </p>

        {isSwish && (
          <SwishQrCode
            swishNumber={import.meta.env.VITE_SWISH_NUMBER}
            amount={amount}
            reference={reference}
          />
        )}

        {isBankgiro && (
          <BankgiroInstructions
            amount={amount}
            reference={reference}
            onCopy={handleCopy}
          />
        )}

        {isManualMethod && receipt && (
          <div className="mt-4">
            <a
              href={`/receipts/${receipt}`}
              download
              className="inline-block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition"
            >
              📄 {t("order.downloadReceipt", { defaultValue: "📄 Download receipt" })}
            </a>
          </div>
        )}

        {isManualMethod && (
          <Link
            to="/track-order"
            className="mt-4 inline-block px-4 py-2 border border-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            🔍 {t("order.trackOrder", { defaultValue: "🔍 Track my order" })}
          </Link>
        )}

        <div className="mt-6">
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {t("order.backToHome", { defaultValue: "Back to homepage" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
