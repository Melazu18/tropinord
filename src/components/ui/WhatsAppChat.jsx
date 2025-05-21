import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppChat() {
  const phoneNumber = "46764330523"; // e.g. 46701234567 (no + or 0)
  const message = "Hello, I'm interested in your products on TropiNord!";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-12 left-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
