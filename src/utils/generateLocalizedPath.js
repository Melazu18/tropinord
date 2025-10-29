// src/utils/generateLocalizedPath.js
import { routeMap } from "../routes/routeMap";

/**
 * Generate a localized URL path
 * @param {string} routeKey - The key in routeMap (e.g., "home", "about")
 * @param {string} lang - Language code ("en" or "sv")
 * @param {Object} [params] - Optional dynamic route params
 * @returns {string} Full localized path
 */
export function generateLocalizedPath(routeKey, lang = "en", params = {}) {
  const localizedSlug = routeMap[routeKey]?.[lang];

  if (!localizedSlug) {
    console.warn(`Missing route mapping for: ${routeKey} (${lang})`);
    return "/";
  }

  // Replace dynamic params if present (e.g., ":id")
  let path = `/${lang}/${localizedSlug}`;
  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key]);
  });

  return path;
}
