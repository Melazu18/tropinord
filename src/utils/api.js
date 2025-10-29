// src/utils/api.js (or wherever this lives)

// Safe "isLocal" (doesn't crash in SSR/build)
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Prefer VITE_API_BASE if provided (may already include `/api`), otherwise VITE_API_URL (origin only).
const RAW_INPUT =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  (isLocal
    ? "http://localhost:3001"
    : "https://tropinord-backend.onrender.com");

// Trim trailing slashes
const TRIMMED = String(RAW_INPUT).replace(/\/+$/, "");

// If TRIMMED already ends with `/api`, keep it as API_BASE and also expose the origin.
// Otherwise, append `/api` to form API_BASE.
let API_ORIGIN_INTERNAL = TRIMMED;
let API_BASE_INTERNAL = TRIMMED;

if (/\/api$/i.test(TRIMMED)) {
  API_ORIGIN_INTERNAL = TRIMMED.replace(/\/api$/i, "");
  API_BASE_INTERNAL = TRIMMED; // already includes /api
} else {
  API_ORIGIN_INTERNAL = TRIMMED;
  API_BASE_INTERNAL = `${TRIMMED}/api`;
}

export const API_ORIGIN = API_ORIGIN_INTERNAL;
export const API_BASE = API_BASE_INTERNAL;
