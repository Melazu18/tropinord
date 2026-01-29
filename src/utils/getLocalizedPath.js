//src/utils/getLocalizedPath.js
import { routeMap } from "../routes/routeMap";

// --- utils ---
const norm = (s = "") => s.replace(/^\/+|\/+$/g, "");
const cleanSlug = (s) => (typeof s === "string" ? s.replace(/^\/+/, "") : "");

// Build supported URL languages from routeMap (union of all langs used)
function collectSupportedLangs() {
  const langs = new Set(["en", "sv"]);
  for (const key of Object.keys(routeMap || {})) {
    const mapping = routeMap[key];
    if (mapping && typeof mapping === "object") {
      Object.keys(mapping).forEach((k) => langs.add(k.slice(0, 2)));
    }
  }
  langs.add("fr");
  langs.add("es");
  return Array.from(langs);
}

export const SUPPORTED_URL_LANGS = collectSupportedLangs();

function pickUrlLang(requestedLang) {
  const req = (requestedLang || "en").slice(0, 2);
  if (SUPPORTED_URL_LANGS.includes(req)) return req;

  if (typeof window !== "undefined") {
    const path = window.location.pathname || "";
    for (const l of SUPPORTED_URL_LANGS) {
      if (path.startsWith(`/${l}/`) || path === `/${l}`) return l;
    }
  }
  return "en";
}

/** Prefer exact lang; fall back to EN; then first available. */
function pickSlug(mapping, urlLang) {
  if (!mapping) return "";
  if (mapping[urlLang]) return cleanSlug(mapping[urlLang]);
  if (mapping.en) return cleanSlug(mapping.en);
  const first = Object.values(mapping).find(Boolean);
  return cleanSlug(first || "");
}

/** Build a localized absolute path from a route key */
export const getLocalizedPath = (routeKey, lang = "en") => {
  const urlLang = pickUrlLang(lang);
  const mapping = routeMap[routeKey];

  if (!mapping) {
    console.warn(`[getLocalizedPath] Unknown routeKey: ${routeKey}`);
    // ✅ IMPORTANT: don't silently send users to home.
    // return a best-effort path so bugs are visible and navigation doesn't "randomly" go home.
    return `/${urlLang}/${cleanSlug(routeKey)}`;
  }

  const slug = pickSlug(mapping, urlLang);
  return slug ? `/${urlLang}/${slug}` : `/${urlLang}`;
};

/** Build localized path + trailing dynamic segments (e.g. teaDetail + /:slug) */
export const getLocalizedDynamicPath = (routeKey, lang = "en", rest = "") => {
  const base = getLocalizedPath(routeKey, lang);
  const tail = cleanSlug(rest);
  return tail ? `${base}/${tail}` : base;
};

/**
 * Find which routeMap key matches the current pathname for a given lang.
 * It matches by LONGEST slug (supports nested slugs like "origin/tea").
 * Returns { key, slug, rest } or null.
 */
export function detectRouteKey(pathname, lang) {
  const trimmed = norm(pathname);
  const parts = trimmed.split("/");
  if (!parts[0] || parts[0] !== lang) return null;

  const afterLang = parts.slice(1).join("/");
  let best = null;

  for (const [key, mapping] of Object.entries(routeMap)) {
    const slug = cleanSlug(mapping?.[lang]);
    if (!slug) continue;

    if (afterLang === slug) {
      return { key, slug, rest: "" };
    }
    if (afterLang.startsWith(slug + "/")) {
      const rest = afterLang.slice(slug.length + 1);
      if (!best || slug.length > best.slug.length) {
        best = { key, slug, rest };
      }
    }
  }
  return best;
}

/**
 * Translate the *current* path (absolute or relative) to another language.
 * Works for nested slugs and keeps any trailing dynamic segments.
 */
export function translateExistingPath(fullPath, toLang) {
  const target = pickUrlLang(toLang);

  const url = new URL(fullPath, "http://dummy.local");
  const pathname = url.pathname || "/";
  const parts = norm(pathname).split("/");

  const currentLang = parts[0];
  if (!SUPPORTED_URL_LANGS.includes(currentLang)) {
    const homeSlug = pickSlug(routeMap.home || {}, target);
    const p = homeSlug ? `/${target}/${homeSlug}` : `/${target}`;
    return `${p}${url.search}${url.hash}`;
  }

  const hit = detectRouteKey(pathname, currentLang);

  if (hit && routeMap[hit.key]?.[target]) {
    const translatedSlug = cleanSlug(routeMap[hit.key][target]);
    const rebuilt =
      `/${target}/${translatedSlug}` + (hit.rest ? `/${hit.rest}` : "");
    return `${rebuilt}${url.search}${url.hash}`;
  }

  // Fallback: keep trailing after lang, but swap only language
  const after = parts.slice(1).join("/");
  const fallback = after ? `/${target}/${after}` : `/${target}`;
  return `${fallback}${url.search}${url.hash}`;
}

// Optional legacy export (keep if other code uses it)
export const ROUTES = {
  accountSecurity: {
    en: "/account",
    sv: "/konto",
    fr: "/compte",
    es: "/cuenta",
  },
};
