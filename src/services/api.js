// src/services/api.js
import axios from "axios";
import { API_ORIGIN } from "../utils/api";

const api = axios.create({
  baseURL: API_ORIGIN, // we call /api/... below
  withCredentials: true, // send/receive cookies
});

// Helper: are we already on an auth page?
const isOnAuthPage = () =>
  /\/(en|sv)\/(login|logga-in|register|registrera)/.test(location.pathname);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const cfg = error?.config || {};
    if (status === 401) {
      // 1) Allow specific requests to opt-out of redirect
      if (cfg.__skip401Redirect) return Promise.reject(error);

      // 2) Never redirect while we're *already* on login/register
      if (isOnAuthPage()) return Promise.reject(error);

      // 3) Ignore self-checks for /auth/me (they run often after login)
      const fullUrl = (cfg.baseURL || "") + (cfg.url || "");
      if (/\/api\/auth\/me\b/.test(fullUrl)) return Promise.reject(error);

      // 4) If we're already on an auth page, don't loop-redirect
      const onAuth = /\/(en|sv)\/(login|logga-in|register|registrera)/.test(
        location.pathname
      );
      if (onAuth) return Promise.reject(error);

      // 5) Go to bare login (no ?next here — CTAs add it explicitly)
      const lang = (localStorage.getItem("lang") || "en").slice(0, 2);
      const loginPath = lang === "sv" ? "/sv/logga-in" : "/en/login";
      location.replace(loginPath);
      // stop promise chain
      return;
    }
    return Promise.reject(error);
  }
);

// ---------- API groups ----------
export const authAPI = {
  // NOTE: all endpoints include /api/ because baseURL is API_ORIGIN
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (userData) => api.post("/api/auth/register", userData),
  logout: () => api.post("/api/auth/logout"),
  // Let /me fail silently without redirecting the whole app
  getMe: () => api.get("/api/auth/me", { __skip401Redirect: true }),
};

export const accountAPI = {
  me: () => api.get("/api/account/me"),
  uploadAvatar: (file) => {
    const f = new FormData();
    f.append("image", file);
    return api.post("/api/account/avatar", f, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadIdentity: (file) => {
    const f = new FormData();
    f.append("image", file);
    return api.post("/api/account/identity", f, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  // Admin-only
  adminGetIdentity: (userId) => api.get(`/api/account/identity/${userId}`),
};

export const artisanAPI = {
  apply: (applicationData) => api.post("/api/artisan/apply", applicationData),
  getStatus: () => api.get("/api/artisan/me"),
};

export const productsAPI = {
  /* ----- existing calls (kept) ----- */
  create: (data) => api.post("/api/products", data),

  // Upload images for a product (owner or admin). Accepts FileList or File[]
  uploadImages: (productId, files) => {
    const form = new FormData();
    [...files].forEach((f) => form.append("images", f));
    return api.post(`/api/products/${productId}/images`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Creator dashboard list
  mine: () => api.get("/api/products/mine"),

  // Admin moderation queue (kept)
  adminQueue: () => api.get("/api/products/admin/queue"),
  adminReview: (id, status) =>
    api.post(`/api/products/admin/${id}/review`, { status }),

  /* ----- small helpers (added, non-breaking) ----- */
  // Public list (catalog)
  listPublic: () => api.get("/api/products"),

  // Fetch a single product (handy for edit screens)
  get: (id) => api.get(`/api/products/${id}`),

  // Update a product. Owners can update their own draft; admins can update any.
  patch: (id, payload) => api.patch(`/api/products/${id}`, payload),

  // Delete a product. Owners can delete their own draft; admins can delete any.
  remove: (id) => api.delete(`/api/products/${id}`),

  // Submit a product for review (owner) — admins can also force-submit.
  submit: (id) => api.post(`/api/products/${id}/submit`),

  // Explicit admin shortcuts (map to backend’s approve/reject endpoints)
  approve: (id) => api.post(`/api/products/${id}/approve`),
  reject: (id) => api.post(`/api/products/${id}/reject`),
};

export const subscribeAPI = {
  set: (type, active = true) => api.post("/api/subscribe", { type, active }),
};

// --- Sellers / Artisan applications ---
export const sellersAPI = {
  apply: (data) => api.post("/api/sellers/apply", data),
  mine: () => api.get("/api/sellers/me"),

  admin: {
    pending: () => api.get("/api/sellers/pending"),
    approved: () => api.get("/api/sellers/approved"),
    approve: (id) => api.post(`/api/sellers/${id}/approve`),
    reject: (id) => api.post(`/api/sellers/${id}/reject`),
  },
};

export default api;
