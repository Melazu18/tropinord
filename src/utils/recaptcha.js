// src/utils/recaptcha.js
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() || "";

function loadRecaptcha(siteKey) {
  return new Promise((resolve, reject) => {
    if (!siteKey) return reject(new Error("No site key"));
    // already loaded?
    if (window.grecaptcha?.execute) return resolve();
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      // script tag exists but not ready; wait below in waitForReady
      return resolve();
    }
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
      siteKey
    )}`;
    s.async = true;
    s.defer = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load reCAPTCHA script"));
    document.head.appendChild(s);
  });
}

function waitForReady(maxMs = 8000) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (function loop() {
      if (window.grecaptcha?.ready) return window.grecaptcha.ready(resolve);
      if (Date.now() - t0 > maxMs)
        return reject(new Error("grecaptcha not available"));
      setTimeout(loop, 50);
    })();
  });
}

export async function getRecaptchaToken(action = "checkout") {
  if (!SITE_KEY) return null;
  try {
    await loadRecaptcha(SITE_KEY); // ← loads with ?render=<SITE_KEY>
    await waitForReady();
    const token = await window.grecaptcha.execute(SITE_KEY, { action });
    if (!token)
      console.warn(
        "[reCAPTCHA] execute returned empty token. Check key type (v3) + domain allowlist."
      );
    return token || null;
  } catch (e) {
    console.warn("[reCAPTCHA]", e?.message || e);
    return null;
  }
}
