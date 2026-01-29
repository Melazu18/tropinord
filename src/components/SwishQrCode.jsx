// src/components/SwishQrCode.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../utils/api";

export default function SwishQrCode({
  swishNumber = "1230558973",
  amount = 0,
  reference = "TropiNord Order",
}) {
  const { t } = useTranslation("thankyou");
  const [toast, setToast] = useState("");
  const [imgError, setImgError] = useState(false);

  const formattedAmount = parseFloat(amount || 0).toFixed(2);

  // If API_BASE = "/api" → "/api/qr"
  // If API_BASE = "http://localhost:3001/api" → "http://localhost:3001/api/qr"
  const qrSrc = `${API_BASE}/qr?amount=${formattedAmount}&reference=${encodeURIComponent(
    reference
  )}&swishNumber=${encodeURIComponent(swishNumber)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(swishNumber).then(() => {
      setToast(t("swishCopied"));
      setTimeout(() => setToast(""), 2500);
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const imgSrc = qrSrc;

    printWindow.document.write(`
      <html>
        <head><title>${t("swishPrintTitle")}</title></head>
        <body style="text-align: center; font-family: sans-serif">
          <h2>${t("swishPaymentTitle")}</h2>
          <p>${t("swishScanInstruction")}</p>
          <img src="${imgSrc}" style="width: 240px; margin-bottom: 20px;" />
          <p><strong>${t("amount")}:</strong> ${formattedAmount} SEK</p>
          <p><strong>${t("recipient")}:</strong> ${swishNumber}</p>
          <p><strong>${t("reference")}:</strong> ${reference}</p>
          <script>
            window.onload = function() {
              setTimeout(() => window.print(), 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="mt-6 text-center px-2 relative">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
        {t("swishTitle")}
      </h3>

      {!imgError ? (
        <img
          src={qrSrc}
          alt={t("swishQrAlt")}
          className="mx-auto my-4 border shadow-lg rounded bg-white dark:bg-gray-50 w-60"
          crossOrigin="anonymous"
          onError={() => setImgError(true)}
        />
      ) : (
        <p className="text-sm text-red-500 mb-4">
          {t("swishQrError", {
            defaultValue:
              "We couldn’t load the QR image. Please use the Swish number and reference manually.",
          })}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
        {t("swishSendInstruction", { amount: formattedAmount })}{" "}
        <span
          onClick={handleCopy}
          className="font-bold select-all cursor-pointer text-green-700 dark:text-green-400"
        >
          {swishNumber}
        </span>
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {t("reference")}:{" "}
        <span className="italic select-all cursor-pointer">{reference}</span>
      </p>

      <div className="mt-4 flex justify-center gap-3 flex-wrap">
        <a
          href={qrSrc}
          download={`Swish_QR_${swishNumber}.png`}
          className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition text-sm shadow"
        >
          📥 {t("swishQrDownload")}
        </a>

        <button
          onClick={handlePrint}
          className="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 transition text-sm shadow"
        >
          🖨️ {t("swishPrint")}
        </button>
      </div>

      {toast && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-sm px-4 py-2 rounded shadow-lg mt-4 animate-fade-in-out z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
