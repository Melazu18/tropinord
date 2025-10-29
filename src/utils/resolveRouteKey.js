// src/utils/resolveRouteKey.js
import { routeMap } from "../routes/routeMap";

/**
 * Resolves a route key (e.g., "home") from a given URL path.
 * @param {string} path - The full path, e.g., "/sv/hem"
 * @returns {object|null} Returns { routeKey, lang } or null if not found
 */
export function resolveRouteKey(path) {
  const segments = path.split("/").filter(Boolean); // removes leading/trailing slashes

  if (segments.length < 2) return null;

  const [lang, slug] = segments;

  for (const [routeKey, langs] of Object.entries(routeMap)) {
    if (langs[lang] === slug) {
      return { routeKey, lang };
    }
  }

  return null;
}
