import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SwishQrCode({
  swishNumber = "1230558973",
  amount = 0,
  reference = "TropiNord Order",
}) {
  const { t } = useTranslation("thankyou");
  const [toast, setToast] = useState("");

  const formattedAmount = parseFloat(amount).toFixed(2);
  const qrSrc = `/api/qr?amount=${formattedAmount}&reference=${encodeURIComponent(
    reference
  )}`;

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

  const swishDeepLink = `swish://payment?amount=${formattedAmount}&payee=${swishNumber}&message=${encodeURIComponent(
    reference
  )}`;

  return (
    <div className="mt-6 text-center px-2 relative">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
        {t("swishTitle")}
      </h3>

      <img
        src={qrSrc}
        alt={t("swishQrAlt")}
        className="mx-auto my-4 border shadow-lg rounded bg-white dark:bg-gray-50 w-60"
      />

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

        <a
          href={swishDeepLink}
          className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm shadow"
        >
          📲 {t("swishPayNow")}
        </a>
      </div>

      {toast && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-sm px-4 py-2 rounded shadow-lg mt-4 animate-fade-in-out z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
