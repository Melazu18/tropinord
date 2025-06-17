// components/Navbar.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button"; // adjust path if needed

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center gap-6">
      <span>{t("nav.home")}</span>
      <span>{t("nav.services")}</span>
      <span>{t("nav.explore")}</span>
      <span>{t("nav.contact")}</span>
      <span>{t("nav.about")}</span>
      <Button className="bg-green-600 text-white font-semibold">
        🌍 {t("common.placeOrder")}
      </Button>
    </nav>
  );
};

export default Navbar;
