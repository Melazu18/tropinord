// src/routes/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const lang = location.pathname.startsWith("/sv") ? "sv" : "en";
  const loginPath = lang === "sv" ? "/sv/logga-in" : "/en/login";
  const dashPath = lang === "sv" ? "/sv/instrumentpanel" : "/en/dashboard";

  // 1) Must be logged in
  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // 2) Role-gated routes
  if (Array.isArray(roles) && roles.length > 0) {
    const allowed = roles.includes(user.role);
    if (!allowed) {
      return <Navigate to={dashPath} replace />;
    }
  }

  return children;
}
