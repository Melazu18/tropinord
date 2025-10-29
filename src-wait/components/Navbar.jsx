// components/Navbar.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button"; // adjust path if needed

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center gap-6">
      <span>{t("nav.home", { defaultValue: "Home" })}</span>
      <span>{t("nav.services", { defaultValue: "Services" })}</span>
      <span>{t("nav.explore", { defaultValue: "Explore" })}</span>
      <span>{t("nav.contact", { defaultValue: "Contact" })}</span>
      <span>{t("nav.about", { defaultValue: "About" })}</span>
      <Button className="bg-green-600 text-white font-semibold">
        🌍 {t("common.placeOrder", { defaultValue: "Place Order" })}
      </Button>
    </nav>
  );
};

export default Navbar;
