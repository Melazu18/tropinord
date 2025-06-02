import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef();
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setSent("success");
          form.current.reset();
        },
        (error) => {
          console.error(error);
          setSent("error");
        }
      )
      .finally(() => setSending(false));
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 text-center mb-6">
        {t("contact.title")}
      </h1>

      <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
        {t(
          "contact.description",
          "We’d love to hear from you! Please fill out the form below."
        )}
      </p>

      <form ref={form} onSubmit={sendEmail} className="space-y-6">
        <div>
          <label htmlFor="user_name" className="block text-sm font-medium">
            {t("contact.name")}
          </label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            required
            className="w-full mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="Full Name"
          />
        </div>
        <div>
          <label htmlFor="user_email" className="block text-sm font-medium">
            {t("contact.email")}
          </label>
          <input
            type="email"
            name="user_email"
            id="user_email"
            required
            className="w-full mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            {t("contact.message")}
          </label>
          <textarea
            name="message"
            id="message"
            rows="5"
            required
            className="w-full mt-1 p-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="Your message..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={sending}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md shadow transition"
        >
          {sending ? t("contact.sending", "Sending...") : t("contact.send")}
        </button>

        {sent === "success" && (
          <p className="text-green-500 mt-3 text-sm">{t("contact.success")}</p>
        )}
        {sent === "error" && (
          <p className="text-red-500 mt-3 text-sm">{t("contact.error")}</p>
        )}
      </form>
    </div>
  );
}
