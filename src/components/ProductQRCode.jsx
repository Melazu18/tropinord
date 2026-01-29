// src/components/ProductQRCode.jsx
import React from "react";
import QRCode from "react-qr-code";

/**
 * Renders a printable QR code.
 * By default we encode the productCode (best).
 * If productCode is missing, we fall back to id/slug.
 */
export default function ProductQRCode({
  value,
  size = 72,
  label = null,
  className = "",
}) {
  if (!value) return null;

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div
        className="bg-white p-1 rounded"
        style={{ width: size + 8, height: size + 8 }}
      >
        <QRCode value={String(value)} size={size} />
      </div>

      {label && (
        <div className="text-[10px] leading-tight text-gray-700 text-center max-w-[120px] break-words">
          {label}
        </div>
      )}
    </div>
  );
}
