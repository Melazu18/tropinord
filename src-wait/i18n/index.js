import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Load all JSON files from i18n folders using Vite's glob
const translationFiles = import.meta.glob("./*/**/*.json", { eager: true });

const supportedLangs = ["en", "sv", "es", "fr"];

const resources = {};

supportedLangs.forEach((lang) => {
  resources[lang] = { translation: {} };

  Object.entries(translationFiles).forEach(([path, module]) => {
    if (path.startsWith(`./${lang}/`)) {
      const namespace = path.replace(`./${lang}/`, "").replace(".json", "");

      // Merge into translation tree
      resources[lang].translation[namespace] = module.default;
    }
  });
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
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

const isRtlLanguage = (lang) => ["ar", "he", "fa", "ur"].includes(lang);

i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = isRtlLanguage(lng) ? "rtl" : "ltr";
});

export default i18n;
