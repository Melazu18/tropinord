// src/components/AgroContactForm.jsx
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

const SERVICE_ID = "your_service_id";
const TEMPLATE_ID = "your_template_id";
const USER_ID = "your_public_key";

export default function AgroContactForm({ product }) {
  const { t } = useTranslation("agro");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/agro-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          product: product.label,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Form submission error:", err.message);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border p-4 rounded shadow bg-gray-50 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold mb-4">
        {t("inquiry.title", "Product Inquiry")}
      </h2>

      <label className="block mb-2 text-sm font-medium">{t("form.name")}</label>
      <input
        type="text"
        name="name"
        required
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-700"
      />

      <label className="block mb-2 text-sm font-medium">
        {t("form.email")}
      </label>
      <input
        type="email"
        name="email"
        required
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-700"
      />

      <label className="block mb-2 text-sm font-medium">
        {t("form.message")}
      </label>
      <textarea
        name="message"
        rows="4"
        required
        value={formData.message}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-700"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {status === "sending"
          ? t("form.sending", "Sending...")
          : t("form.send", "Send Inquiry")}
      </button>

      {status === "success" && (
        <p className="text-green-600 mt-2">
          {t("form.success", "Message sent successfully!")}
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 mt-2">
          {t("form.error", "Failed to send message. Please try again.")}
        </p>
      )}
    </form>
  );
}
