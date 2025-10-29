// src/utils/recaptcha.js
export async function getRecaptchaToken(action = "checkout") {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim();
  // If no site key is configured, gracefully skip (dev/local)
  if (!siteKey) return null;

  // Script is already in index.html. Wait until grecaptcha is ready.
  if (!window.grecaptcha || !window.grecaptcha.execute) {
    // give it a moment to load if needed
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!window.grecaptcha || !window.grecaptcha.execute) {
    // still not available → skip (don’t block checkout)
    return null;
  }

  await new Promise((resolve) => window.grecaptcha.ready(resolve));
  try {
    const token = await window.grecaptcha.execute(siteKey, { action });
    return token || null;
  } catch {
    return null; // don’t crash UI if reCAPTCHA fails
  }
}
