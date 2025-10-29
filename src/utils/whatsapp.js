// src/utils/whatsapp.js
export function getWhatsAppNumber() {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER || "46700711713";
  return String(raw).replace(/[^\d]/g, ""); // digits only
}

export function buildWhatsAppUrl(message) {
  const num = getWhatsAppNumber();
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${text}`; // or: `https://api.whatsapp.com/send?phone=${num}${text}`
}
