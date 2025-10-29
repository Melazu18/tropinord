// src/utils/loadRecaptcha.js
export function loadRecaptcha() {
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const localKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY_LOCAL?.trim() || "";
  const prodKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() || "";
  const siteKey = isLocal ? localKey || prodKey : prodKey || localKey;

  window.__RECAPTCHA_SITE_KEY__ = siteKey;
  if (!siteKey) return;

  // prevent double insert
  if (document.querySelector('script[data-recaptcha="v3"]')) return;

  const s = document.createElement("script");
  s.src = "https://www.google.com/recaptcha/api.js?render=" + siteKey;
  s.async = true;
  s.defer = true;
  s.setAttribute("data-recaptcha", "v3");
  document.head.appendChild(s);
}
