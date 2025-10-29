import React from "react";
import i18n from "i18next";
import { Navigate } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import ChangePasswordCard from "../components/auth/ChangePasswordCard";
import SubscribeToggles from "../components/account/SubscribeToggles";

export default function AccountSecurity() {
  const { me, loading } = useMe();
  const lang = i18n.language || "en";

  // Block access if not logged in
  if (!loading && !me) {
    return <Navigate to={getLocalizedPath("login", lang)} replace />;
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-semibold mb-6">Account security</h1>
      <ChangePasswordCard />

      <div className="mt-8">
        <SubscribeToggles />
      </div>
    </div>
  );
}
