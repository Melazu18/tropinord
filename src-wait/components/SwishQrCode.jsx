import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function SwishQrCode({
  swishNumber = "1230558973",
  amount = 0,
  reference = "TropiNord Order",
}) {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [toast, setToast] = useState("");
  const [validAmount, setValidAmount] = useState("0.00");
  const [qrError, setQrError] = useState(null);

  useEffect(() => {
    const parsedAmount = parseFloat(
      typeof amount === "string" ? amount.replace(/[^\d.]/g, "") : amount
    );

    if (!swishNumber || isNaN(parsedAmount)) return;

    const formattedAmount = parsedAmount.toFixed(2);
    setValidAmount(formattedAmount);

    const message = reference || "TropiNord Order";
    const qrString = `C${swishNumber};X${formattedAmount};R${message}`;

    QRCode.toCanvas(canvasRef.current, qrString, {
      width: 240,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then(() => {
        setIsReady(true);
        setQrError(null);
      })
      .catch((err) => {
        console.error("❌ QR code generation failed:", err.message);
        setQrError("Misslyckades med att generera QR-kod.");
        setIsReady(false);
      });
  }, [swishNumber, amount, reference]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `Swish_QR_${swishNumber}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const imgSrc = canvasRef.current
      ? canvasRef.current.toDataURL("image/png")
      : "/images/swish_qr.png";

    printWindow.document.write(`
      <html>
        <head><title>Swish QR Print</title></head>
        <body style="text-align: center; font-family: sans-serif">
          <h2>Swish-betalning</h2>
          <p>Skanna QR-koden nedan för att betala:</p>
          <img src="${imgSrc}" style="width: 240px; margin-bottom: 20px;" />
          <p><strong>Belopp:</strong> ${validAmount} SEK</p>
          <p><strong>Mottagare:</strong> ${swishNumber}</p>
          <p><strong>Referens:</strong> ${reference}</p>
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

  const handleCopy = () => {
    navigator.clipboard.writeText(swishNumber).then(() => {
      setToast("Swish-nummer kopierat!");
      setTimeout(() => setToast(""), 2500);
    });
  };

  const swishDeepLink = `swish://payment?amount=${validAmount}&payee=${swishNumber}&message=${encodeURIComponent(
    reference
  )}`;

  return (
    <div className="mt-6 text-center px-2 relative">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
        Skanna för att betala med Swish
      </h3>

      {qrError ? (
        <img
          src={`/api/qr?amount=${amount}&reference=${encodeURIComponent(
            reference
          )}`}
          alt="Swish QR code"
          className="mx-auto my-4 border rounded shadow w-60"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="mx-auto my-4 border shadow-lg rounded bg-white dark:bg-gray-50"
        />
      )}

      <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
        Eller skicka <strong>{validAmount} SEK</strong> till Swish:{" "}
        <span
          onClick={handleCopy}
          className="font-bold select-all cursor-pointer text-green-700 dark:text-green-400"
        >
          {swishNumber}
        </span>
      </p>

      {reference && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Referens:{" "}
          <span className="italic select-all cursor-pointer">{reference}</span>
        </p>
      )}

      <div className="mt-4 flex justify-center gap-3 flex-wrap">
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition text-sm shadow"
        >
          📥 Ladda ner QR-kod
        </button>

        <button
          onClick={handlePrint}
          className="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 transition text-sm shadow"
        >
          🖨️ Skriv ut
        </button>

        <a
          href={swishDeepLink}
          className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm shadow"
        >
          📲 Betala direkt med Swish
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
