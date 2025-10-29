// i18n/loadTranslations.js

// ENGLISH
import enAbout from "./en/about.json";
import enBlog from "./en/blog.json";
import enButtons from "./en/buttons.json";
import enCart from "./en/cart.json";
import enCommon from "./en/common.json";
import enDescriptions from "./en/descriptions.json";
import enExplore from "./en/explore.json";
import enFooter from "./en/footer.json";
import enHeader from "./en/header.json";
import enHero from "./en/hero.json";
import enOffers from "./en/offers.json";
import enOrder from "./en/order.json";
import enProducts from "./en/products.json";

// SWEDISH
import svAbout from "./sv/about.json";
import svBlog from "./sv/blog.json";
import svButtons from "./sv/buttons.json";
import svCart from "./sv/cart.json";
import svCommon from "./sv/common.json";
import svDescriptions from "./sv/descriptions.json";
import svExplore from "./sv/explore.json";
import svFooter from "./sv/footer.json";
import svHeader from "./sv/header.json";
import svHero from "./sv/hero.json";
import svOffers from "./sv/offers.json";
import svOrder from "./sv/order.json";
import svProducts from "./sv/products.json";

// FRENCH
import frAbout from "./fr/about.json";
import frBlog from "./fr/blog.json";
import frButtons from "./fr/buttons.json";
import frCart from "./fr/cart.json";
import frCommon from "./fr/common.json";
import frDescriptions from "./fr/descriptions.json";
import frExplore from "./fr/explore.json";
import frFooter from "./fr/footer.json";
import frHeader from "./fr/header.json";
import frHero from "./fr/hero.json";
import frOffers from "./fr/offers.json";
import frOrder from "./fr/order.json";
import frProducts from "./fr/products.json";

// SPANISH
import esAbout from "./es/about.json";
import esBlog from "./es/blog.json";
import esButtons from "./es/buttons.json";
import esCart from "./es/cart.json";
import esCommon from "./es/common.json";
import esDescriptions from "./es/descriptions.json";
import esExplore from "./es/explore.json";
import esFooter from "./es/footer.json";
import esHeader from "./es/header.json";
import esHero from "./es/hero.json";
import esOffers from "./es/offers.json";
import esOrder from "./es/order.json";
import esProducts from "./es/products.json";

const translations = {
  en: {
    about: enAbout,
    blog: enBlog,
    buttons: enButtons,
    cart: enCart,
    common: enCommon,
    descriptions: enDescriptions,
    explore: enExplore,
    footer: enFooter,
    header: enHeader,
    hero: enHero,
    offers: enOffers,
    order: enOrder,
    products: enProducts,
  },
  sv: {
    about: svAbout,
    blog: svBlog,
    buttons: svButtons,
    cart: svCart,
    common: svCommon,
    descriptions: svDescriptions,
    explore: svExplore,
    footer: svFooter,
    header: svHeader,
    hero: svHero,
    offers: svOffers,
    order: svOrder,
    products: svProducts,
  },
  fr: {
    about: frAbout,
    blog: frBlog,
    buttons: frButtons,
    cart: frCart,
    common: frCommon,
    descriptions: frDescriptions,
    explore: frExplore,
    footer: frFooter,
    header: frHeader,
    hero: frHero,
    offers: frOffers,
    order: frOrder,
    products: frProducts,
  },
  es: {
    about: esAbout,
    blog: esBlog,
    buttons: esButtons,
    cart: esCart,
    common: esCommon,
    descriptions: esDescriptions,
    explore: esExplore,
    footer: esFooter,
    header: esHeader,
    hero: esHero,
    offers: esOffers,
    order: esOrder,
    products: esProducts,
  },
};

export function loadTranslations(lang) {
  return Object.values(translations[lang] || {}).reduce((acc, section) => {
    return { ...acc, ...section };
  }, {});
}
