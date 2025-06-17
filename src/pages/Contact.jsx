import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const form = useRef();
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = "Name is required";
    if (!data.email.match(/^\S+@\S+\.\S+$/)) errs.email = "Invalid email";
    if (!data.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setSent(null);

    const formData = new FormData(form.current);
    const data = {
      name: formData.get("user_name"),
      email: formData.get("user_email"),
      message: formData.get("message"),
    };

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setVerifying(true);

    try {
      if (!window.grecaptcha || !window.grecaptcha.execute) {
        throw new Error("reCAPTCHA not ready");
      }

      window.grecaptcha.ready(async () => {
        const token = await window.grecaptcha.execute(
          import.meta.env.VITE_RECAPTCHA_SITE_KEY,
          { action: "submit" }
        );

        setVerifying(false);
        setSending(true);

        const res = await fetch("/api/contact-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, token }),
        });

        if (res.ok) {
          setSent("success");
          form.current.reset();
        } else {
          setSent("error");
        }

        setSending(false);
      });
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setVerifying(false);
      setSending(false);
      setSent("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow">
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
            className="w-full mt-1 p-3 rounded-md border shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="Full Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="user_email" className="block text-sm font-medium">
            {t("contact.email")}
          </label>
          <input
            type="email"
            name="user_email"
            id="user_email"
            className="w-full mt-1 p-3 rounded-md border shadow-sm bg-white dark:bg-gray-800 text-black dark:text-black"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            {t("contact.message")}
          </label>
          <textarea
            name="message"
            id="message"
            rows="5"
            className="w-full mt-1 p-3 rounded-md border shadow-sm bg-white dark:bg-gray-800 text-black dark:text-black"
            placeholder="Your message..."
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={sending || verifying}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md shadow transition flex items-center justify-center gap-2"
        >
          {(sending || verifying) && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          )}
          {verifying
            ? "Verifying..."
            : sending
            ? t("contact.sending", "Sending...")
            : t("contact.send", "Send")}
        </button>

        {sent === "success" && (
          <p className="text-green-500 mt-3 text-sm">
            {t("contact.success", "Message sent successfully!")}
          </p>
        )}
        {sent === "error" && (
          <p className="text-red-500 mt-3 text-sm">
            {t("contact.error", "Something went wrong. Please try again.")}
          </p>
        )}
      </form>
    </div>
  );
}
