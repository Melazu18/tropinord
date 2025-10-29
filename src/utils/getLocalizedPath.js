import { routeMap } from "../routes/routeMap";

// --- utils ---
const norm = (s = "") => s.replace(/^\/+|\/+$/g, ""); // trim leading/trailing slashes
const cleanSlug = (s) => (typeof s === "string" ? s.replace(/^\/+/, "") : "");

// Build supported URL languages from routeMap (union of all langs used)
function collectSupportedLangs() {
  const langs = new Set(["en", "sv"]); // keep canonical defaults
  for (const key of Object.keys(routeMap || {})) {
    const mapping = routeMap[key];
    if (mapping && typeof mapping === "object") {
      Object.keys(mapping).forEach((k) => langs.add(k.slice(0, 2)));
    }
  }
  // Ensure fr & es are included for your new content
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
    const homeSlug = pickSlug(routeMap.home || {}, urlLang);
    return homeSlug ? `/${urlLang}/${homeSlug}` : `/${urlLang}`;
  }

  const slug = pickSlug(mapping, urlLang);
  return slug ? `/${urlLang}/${slug}` : `/${urlLang}`;
};

/**
 * Find which routeMap key matches the current pathname for a given lang.
 * It matches by LONGEST slug (supports nested slugs like "origin/tea").
 * Returns { key, slug, rest } or null.
 */
export function detectRouteKey(pathname, lang) {
  const trimmed = norm(pathname);
  const parts = trimmed.split("/"); // e.g. ["en","origin","tea"]
  if (!parts[0] || parts[0] !== lang) return null;

  const afterLang = parts.slice(1).join("/"); // e.g. "origin/tea"
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

  // Parse safely even if fullPath is relative
  const url = new URL(fullPath, "http://dummy.local");
  const pathname = url.pathname || "/";
  const parts = norm(pathname).split("/"); // ["en", "..."] or [""]

  // If no known lang prefix → just send to home in target
  const currentLang = parts[0];
  if (!SUPPORTED_URL_LANGS.includes(currentLang)) {
    const homeSlug = pickSlug(routeMap.home || {}, target);
    const p = `/${target}/${homeSlug}`;
    return `${p}${url.search}${url.hash}`;
  }

  // Detect which route we're on (supports nested slugs)
  const hit = detectRouteKey(pathname, currentLang);

  // Build new path
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
