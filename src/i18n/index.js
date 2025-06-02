import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import sv from "./sv.json";

const supportedLangs = ["en", "es", "fr", "sv"];

i18n
  .use(LanguageDetector) // 👈 Detect language automatically
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      sv: { translation: sv },
    },
    fallbackLng: "en",
    supportedLngs: supportedLangs,
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Optional: Add RTL info per language
const isRtlLanguage = (lang) => ["ar", "he", "fa", "ur"].includes(lang);

i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = isRtlLanguage(lng) ? "rtl" : "ltr";
});

export default i18n;
