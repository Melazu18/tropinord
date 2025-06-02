// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import sv from "./sv.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    sv: { translation: sv },
  },
  lng: localStorage.getItem("lng") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
