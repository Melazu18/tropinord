const qrcode = require("qrcode");

/**
 * Swish QR payload format builder
 * Format: C1|SWISH|1|{number}|{amount}|{message}
 */
function buildSwishQrData(swishNumber, amount, message = "") {
  const formattedAmount = parseFloat(amount).toFixed(2).replace(".", ","); // ✅ comma, not dot
  const payload = `C${swishNumber};${formattedAmount};${message};0`;
  console.log("🔍 QR Payload (legacy):", payload);
  return payload;
}

/**
 *  Generates a Swish QR code PNG Buffer (for email attachments, PDF, etc.)
 * @param {string} swishNumber - Recipient Swish number
 * @param {string|number} amount - Payment amount in SEK
 * @param {string} message - Optional message
 * @returns {Promise<Buffer>} - PNG buffer
 */
async function generateSwishQrBuffer(swishNumber, amount, message = "") {
  const data = buildSwishQrData(swishNumber, amount, message);
  return await qrcode.toBuffer(data, {
    type: "png",
    errorCorrectionLevel: "H",
    width: 300,
    margin: 2,
  });
}

/**
 *  Generates a Base64 data URI for inline email embedding
 * @param {string} swishNumber
 * @param {string|number} amount
 * @param {string} message
 * @returns {Promise<string>} - base64-encoded data URI
 */
async function generateSwishQrDataUri(swishNumber, amount, message = "") {
  const data = buildSwishQrData(swishNumber, amount, message);
  return await qrcode.toDataURL(data, {
    errorCorrectionLevel: "H",
    width: 300,
    margin: 2,
  });
}

module.exports = {
  generateSwishQrBuffer,
  generateSwishQrDataUri,
};
