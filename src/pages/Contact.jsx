import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const form = useRef();
  const { t } = useTranslation();
  const [previews, setPreviews] = useState([]);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          alert(t("contact.success"));
          form.current.reset();
          setPreviews([]);
        },
        (error) => {
          alert(t("contact.error"));
          console.error(error.text);
        }
      );
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    const files = Array.from(
      e.dataTransfer ? e.dataTransfer.files : e.target.files
    );
    const maxFileSizeMB = 5;
    const maxFiles = 5;

    if (files.length > maxFiles) {
      const message = `You can upload a maximum of ${maxFiles} files.`;
      document.getElementById("file-limit-alert").textContent = message;
      return;
    } else {
      document.getElementById("file-limit-alert").textContent = "";
    }

    const validFiles = files.filter(
      (file) => file.size / 1024 / 1024 <= maxFileSizeMB
    );
    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));

    if (validFiles.length < files.length) {
      document.getElementById("file-limit-alert").textContent =
        "Some files were too large (over 5MB) and were skipped.";
    }

    setPreviews(previewUrls);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {t("contact.title")}
      </h2>

      <form
        ref={form}
        onSubmit={sendEmail}
        className="space-y-4"
        aria-label="Contact form"
        aria-describedby="form-description"
      >
        <p id="form-description" className="sr-only">
          Fill out the form below to contact TropiNord. All fields are required
          unless marked optional.
        </p>
        <div>
          <label htmlFor="user_name" className="block font-medium">
            {t("contact.name")}
          </label>
          <input
            id="user_name"
            type="text"
            name="user_name"
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="user_email" className="block font-medium">
            {t("contact.email")}
          </label>
          <input
            id="user_email"
            type="email"
            name="user_email"
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block font-medium">
            {t("contact.subject")}
          </label>
          <input
            id="subject"
            type="text"
            name="subject"
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="category" className="block font-medium">
            {t("contact.category")}
          </label>
          <select
            id="category"
            name="category"
            className="w-full border rounded p-2"
          >
            <option>{t("contact.options.oils")}</option>
            <option>{t("contact.options.soaps")}</option>
            <option>{t("contact.options.agro")}</option>
            <option>{t("contact.options.other")}</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block font-medium">
            {t("contact.message")}
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div
          onDrop={handleFileChange}
          onDragOver={(e) => e.preventDefault()}
          className="w-full border-2 border-dashed border-green-500 rounded p-4 text-center text-gray-600 cursor-pointer"
          aria-describedby="file-limit-alert"
        >
          <label
            htmlFor="attachment"
            className="block font-medium cursor-pointer"
          >
            {t("contact.attachment")}
          </label>
          <input
            id="attachment"
            type="file"
            name="attachment"
            accept="image/*,application/pdf,.doc,.docx"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <p
            id="file-limit-alert"
            className="text-sm text-red-600 mt-1"
            role="alert"
          ></p>
          {previews.length > 0 && (
            <div
              className="mt-2 grid grid-cols-2 gap-2"
              aria-label="File preview thumbnails"
            >
              {previews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview of uploaded file ${index + 1}`}
                  className="h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {t("contact.send")}
        </button>
      </form>
    </div>
  );
}
