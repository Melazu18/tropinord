// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ✅ Supported languages
const supportedLangs = ["en", "sv", "es", "fr"];

// Eagerly load all translation JSON files under ./<lang>/**/*.json
const translationFiles = import.meta.glob("./*/**/*.json", { eager: true });

// Build resources like:
// { en: { common: {...}, hero: {...}, ... }, sv: { ... }, es: { ... }, fr: { ... } }
const resources = {};
supportedLangs.forEach((lang) => {
  resources[lang] = {};
  Object.entries(translationFiles).forEach(([path, mod]) => {
    const match = path.match(new RegExp(`./${lang}/(.+?)\\.json$`));
    if (match) {
      const namespace = match[1]; // e.g. 'hero', 'common', 'footer'
      resources[lang][namespace] = mod.default;
    }
  });
});

// Pick namespaces from English as a base (falls back to ["common"] if empty)
const baseNamespaces = Object.keys(resources.en || {});
const namespaces = baseNamespaces.length ? baseNamespaces : ["common"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: supportedLangs,
    ns: namespaces,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "lang",
    },
    react: { useSuspense: false },
  });

// Keep <html lang> and direction in sync
const isRtlLanguage = (lng) => ["ar", "he", "fa", "ur"].includes(lng);
i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = isRtlLanguage(lng) ? "rtl" : "ltr";
});

export default i18n;
