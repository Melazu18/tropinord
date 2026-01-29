// src/utils/i18nProductHelpers.js
export const nameT = (t, ns, id, def) =>
  t(`${id}.name`, { ns, defaultValue: def });

export const descT = (t, ns, id, def = "") =>
  t(`${id}.description`, { ns, defaultValue: def });

/** Map a product category to the translation namespace you chose */
export const nsFor = (cat) =>
  cat === "tea"
    ? "teas"
    : cat === "oils"
    ? "oils"
    : cat === "coffee"
    ? "coffee"
    : "superfoods";

/* ===========================
   ADDITIONS (product detail)
   =========================== */

/**
 * Tea detail pages may use ids like "tea-hibiscus" while products.teas.json uses "hibiscus".
 * This keeps TeaPage unchanged and gives you a dedicated helper for detail pages.
 */
const normalizeTeaProductKey = (idOrSlug = "") =>
  String(idOrSlug).replace(/^tea-/, "");

/**
 * Reads product translations from products.teas.<key>.name/description
 * Use ONLY on the product detail page.
 *
 * Requires that your i18n has a "products" namespace loaded
 * containing: { "teas": { "<key>": { name, description } } }
 */
export const teaProductNameT = (t, idOrSlug, def) => {
  const key = normalizeTeaProductKey(idOrSlug);
  return t(`teas.${key}.name`, { ns: "products", defaultValue: def });
};

export const teaProductDescT = (t, idOrSlug, def = "") => {
  const key = normalizeTeaProductKey(idOrSlug);
  return t(`teas.${key}.description`, { ns: "products", defaultValue: def });
};
