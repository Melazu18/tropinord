import React from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function ManualPaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const method = searchParams.get("method") || "manual";
  const amount = searchParams.get("amount") || "N/A";
  const reference = searchParams.get("reference") || "N/A";

  const swishNumber = "123 055 89 73";
  const bankgiroNumber = "5015-1935";
  const qrUrl = `/api/qr?amount=${amount}&reference=${reference}`;

  const isSwish = method === "swish";
  const paymentTitle = isSwish ? "Swish" : "Bankgiro";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">
          ✅ Order Received
        </h1>

        <p className="text-center text-lg text-gray-700 dark:text-gray-200 mb-4">
          Please complete your payment using <strong>{paymentTitle}</strong>{" "}
          below.
        </p>

        <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 mb-6 text-sm text-gray-800 dark:text-gray-100">
          <p>
            <strong>Amount:</strong> {amount}
          </p>
          <p>
            <strong>Reference:</strong> {reference}
          </p>
          {isSwish ? (
            <p>
              <strong>Swish Number:</strong> {swishNumber}
            </p>
          ) : (
            <p>
              <strong>Bankgiro Number:</strong> {bankgiroNumber}
            </p>
          )}
        </div>

        {isSwish && (
          <div className="text-center mb-6">
            <p className="mb-2 text-gray-600 dark:text-gray-300">
              Or scan this QR code with your Swish app:
            </p>
            <img
              src={qrUrl}
              alt="Swish QR"
              className="mx-auto border rounded w-40 h-40"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link
            to="/explore"
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition text-center"
          >
            🛍️ Keep Shopping
          </Link>
          <Link
            to="/track-order"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition text-center"
          >
            📦 Track My Order
          </Link>
        </div>
      </div>
    </div>
  );
}
