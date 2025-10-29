// src/components/CreatorGate.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { getLocalizedPath } from "../../utils/getLocalizedPath";

export default function CreatorGate({ children }) {
  const { me, loading } = useMe();
  if (loading) return null;

  const status = me?.sellerProfile?.status;

  if (status !== "APPROVED") {
    const lang = (me?.lang || "en").slice(0, 2);
    const applyPath = getLocalizedPath("apply", lang);

    return (
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Apply to sell</h2>
        <p className="mb-4">
          You need an approved creator account to upload products.
        </p>
        <Link
          className="inline-block px-4 py-2 rounded bg-green-600 text-white"
          to={applyPath}
        >
          Start application
        </Link>
      </div>
    );
  }

  return children;
}
