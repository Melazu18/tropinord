import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import SwishQrCode from "../components/SwishQrCode";
import { useTranslation } from "react-i18next";

export default function ThankYou() {
  const { t } = useTranslation("thankyou");
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const receipt = searchParams.get("receipt");
  const method = searchParams.get("method");
  const reference = searchParams.get("reference");
  const searchAmount = searchParams.get("amount");
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiptLink, setReceiptLink] = useState(null);
  const { clearCart } = useCart();

  const isStripe = method === "stripe";
  const isSwish = method === "swish";
  const isBankgiro = method === "bankgiro";
  const isManualMethod = isSwish || isBankgiro;

  const name =
    sessionData?.name || t("customer", { defaultValue: "Valued Customer" });
  const email = sessionData?.email || null;
  const swishNumber = "1230558973";
  const bankgiroNumber = "5015-1935";

  const amount =
    (sessionData?.amount_total &&
      (sessionData.amount_total / 100).toFixed(2)) ||
    (searchAmount && parseFloat(searchAmount).toFixed(2)) ||
    "0.00";

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/checkout-session?sessionId=${sessionId}`);
        const data = await res.json();
        setSessionData(data);

        if (data?.payment_status === "paid") {
          clearCart();
          console.log("🧹 Cart cleared after Stripe payment");
        }

        if (data.receiptFilename) {
          setReceiptLink(`/receipts/${data.receiptFilename}`);
        }
      } catch (err) {
        console.error("Error fetching checkout session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const productId = sessionData?.items?.[0]?.productId || null;
  const orderId = sessionData?.orderId || null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 sm:p-8 max-w-xl w-full mt-6">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-4">
          ✅ {t("thankYou", { defaultValue: "Thank You" })}, {name}!
        </h1>

        <p className="text-center text-lg text-gray-700 dark:text-gray-200 mb-4">
          {t("orderReceivedMsg", {
            defaultValue: "Your order has been received.",
          })}
        </p>

        {email && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t("email", { defaultValue: "Email" })}: <strong>{email}</strong>
          </p>
        )}

        {isManualMethod ? (
          <>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6 text-gray-900 dark:text-gray-100 space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="font-medium">
                  {t("amount", { defaultValue: "Amount" })}:
                </span>
                <span>{amount} SEK</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {t("reference", { defaultValue: "Reference" })}:
                </span>
                <span>{reference}</span>
              </div>
              {isSwish && (
                <div className="flex justify-between">
                  <span className="font-medium">
                    {t("swishNumber", { defaultValue: "Swish Number" })}:
                  </span>
                  <span>{swishNumber}</span>
                </div>
              )}
              {isBankgiro && (
                <div className="flex justify-between">
                  <span className="font-medium">
                    {t("bankgiroNumber", { defaultValue: "Bankgiro Number" })}:
                  </span>
                  <span>{bankgiroNumber}</span>
                </div>
              )}
            </div>

            {isSwish && (
              <div className="mb-6 text-center">
                <SwishQrCode
                  swishNumber={swishNumber}
                  amount={amount}
                  reference={reference}
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-green-100 dark:bg-green-700/30 rounded p-4 mb-6 text-sm text-green-900 dark:text-green-100">
            <p>
              ✅{" "}
              {t("paymentSuccessful", {
                defaultValue: "Payment completed via Stripe.",
              })}
            </p>

            <p>
              <strong>{t("amount", { defaultValue: "Amount" })}:</strong>{" "}
              {amount} SEK
            </p>

            <p>
              <strong>{t("status", { defaultValue: "Status" })}:</strong>{" "}
              {sessionData?.status ||
                t("pending", { defaultValue: "Pending Confirmation" })}
            </p>

            {reference && (
              <p>
                <strong>
                  {t("reference", { defaultValue: "Reference" })}:
                </strong>{" "}
                {reference}
              </p>
            )}

            <p>
              <strong>
                {t("paymentMethod", { defaultValue: "Payment Method" })}:
              </strong>{" "}
              Stripe
            </p>
          </div>
        )}

        {receiptLink && (
          <div className="text-center mb-4">
            <a
              href={receiptLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {t("downloadReceipt", { defaultValue: "📄 Download Receipt" })}
            </a>
          </div>
        )}

        {/* ✅ Leave a Review Link */}
        {productId && orderId && email && (
          <div className="text-center mt-2">
            <Link
              to={`/review/${productId}?orderId=${orderId}&email=${encodeURIComponent(
                email
              )}`}
              className="text-green-600 underline text-sm"
            >
              ✍️ {t("leaveReview", { defaultValue: "Leave a Review" })}
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link
            to="/explore"
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition text-center"
          >
            🛍️ {t("backToProducts", { defaultValue: "Back to Products" })}
          </Link>
          <Link
            to="/track-order"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition text-center"
          >
            📦 {t("trackOrder", { defaultValue: "Track My Order" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
