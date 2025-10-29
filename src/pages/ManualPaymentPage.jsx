// src/pages/ManualPaymentPage.jsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SwishQrCode from "../components/SwishQrCode";

export default function ManualPaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const method = searchParams.get("method");
  const amount = searchParams.get("amount");
  const reference = searchParams.get("reference");

  const swishNumber = import.meta.env.VITE_SWISH_NUMBER;
  const bankgiroNumber = import.meta.env.VITE_BANKGIRO_NUMBER;

  const handleConfirm = () => {
    navigate(
      `/thank-you?method=${method}&amount=${encodeURIComponent(
        amount
      )}&reference=${encodeURIComponent(reference)}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          Complete Your Payment
        </h1>

        {method === "swish" && (
          <>
            <SwishQrCode
              swishNumber={swishValue}
              amount={amount}
              reference={reference}
            />
          </>
        )}

        {method === "bankgiro" && (
          <>
            <p className="text-lg mb-4">
              Please transfer <strong>{amount} kr</strong> to:
            </p>
            <p className="font-semibold text-gray-900 dark:text-gray-200">
              Bankgiro Number: {bankgiroNumber}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Reference: <em>{reference || "TropiNord Order"}</em>
            </p>
          </>
        )}

        <button
          onClick={handleConfirm}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          I've Paid – Continue
        </button>
      </div>
    </div>
  );
}
