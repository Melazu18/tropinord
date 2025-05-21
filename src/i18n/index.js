import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import sv from "./sv.json";
import ar from "./ar.json";
import zh from "./zh.json";
import sw from "./sw.json";
import pt from "./pt.json";
import es from "./es.json";
import fr from "./fr.json";
import de from "./de.json";
import hi from "./hi.json";

const savedLang = localStorage.getItem("lng") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sv: { translation: sv },
    ar: { translation: ar },
    zh: { translation: zh },
    sw: { translation: sw },
    pt: { translation: pt },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    hi: { translation: hi },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
