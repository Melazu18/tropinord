/* scripts/generate-products-i18n.js
 * Usage:
 *   node scripts/generate-products-i18n.js                 // dry run (en,sv,fr,es)
 *   node scripts/generate-products-i18n.js --write         // write changes
 *   node scripts/generate-products-i18n.js --langs=fr,es --write
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.resolve(ROOT, "src/data/productImages.js");

// CLI flags
const args = process.argv.slice(2);
const DO_WRITE = args.includes("--write");
const langsArg = args.find((a) => a.startsWith("--langs="));
const LANGS = (langsArg ? langsArg.split("=")[1] : "en,sv,fr,es")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const normalizeSlug = (slug = "") =>
  String(slug).toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "");

const ensure = (obj, pathArr) => {
  let cur = obj;
  for (const key of pathArr) {
    if (cur[key] == null || typeof cur[key] !== "object") cur[key] = {};
    cur = cur[key];
  }
  return cur;
};

const setIfMissing = (obj, pathArr, value) => {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const key = pathArr[i];
    if (cur[key] == null || typeof cur[key] !== "object") cur[key] = {};
    cur = cur[key];
  }
  const last = pathArr[pathArr.length - 1];
  if (cur[last] == null) {
    cur[last] = value;
    return true; // added
  }
  return false; // already existed
};

const loadJSONIfExists = (p) => {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    console.warn(`⚠️  Could not parse ${p}:`, e.message);
    return null;
  }
};

const saveJSON = (p, obj) => {
  const pretty = JSON.stringify(obj, null, 2);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, pretty + "\n", "utf-8");
};

const isAgroBucket = (groupName, subName) =>
  groupName === "agro" || String(subName).toLowerCase() === "items";

// Baseline English strings we’ll use as placeholders for any language
const BASELINE = {
  fieldLabels: {
    description: "Description",
    origin: "Origin",
    history: "History",
    botanicalName: "Scientific Name",
    family: "Family",
    benefits: "Benefits",
    usage: "Usage",
    sideEffects: "Side Effects",
    productionDate: "Date of Production",
    bestBefore: "Best Before",
    price: "Price",
  },
  // We’ll override categories with actual keys from productImages
  categories: {
    cosmetics: "Cosmetic Products",
    healingBotanicals: "Healing Botanicals",
    agro: "Agro-Trade & Raw Materials",
  },
  subcategoriesFallback: (label) => label, // by default keep as-is
  buttons: {
    contactWhatsApp: "Contact via WhatsApp",
  },
  pageHeading: "Explore Our Products",
  order: {
    quantity: "Quantity",
    addToCart: "Add to Cart",
    addedToCart: "{{item}} (x{{qty}}) added to cart!",
  },
  product: {
    notFound: "Product not found",
    contactForPricing: "Contact for pricing",
    contactAdmin: "admin@tropinord.com",
  },
};

(async function main() {
  // Import productImages (ESM default export)
  const mod = await import(pathToFileURL(DATA_FILE).href);
  const productImages = mod.default;

  // Gather products + discover categories/subcategories
  const collected = [];
  const categoryKeys = new Set();
  const subcategoryKeys = new Set();

  for (const [groupName, subcats] of Object.entries(productImages || {})) {
    categoryKeys.add(groupName);
    for (const [subName, items] of Object.entries(subcats || {})) {
      subcategoryKeys.add(subName);
      if (!Array.isArray(items)) continue;
      for (const p of items) {
        collected.push({
          groupName,
          subName,
          id: p.id || null,
          slug: p.slug || null,
          label: p.label || "",
          description: p.description || "",
        });
      }
    }
  }

  console.log(
    `🧰 Found ${collected.length} products. Target langs: ${LANGS.join(", ")}`
  );
  if (!DO_WRITE) console.log("💡 Dry run. Add --write to save changes.\n");

  for (const lang of LANGS) {
    const filePath = path.resolve(ROOT, "src/i18n", lang, "products.json");
    let doc = loadJSONIfExists(filePath) || {};

    // Make sure common parents exist
    ensure(doc, ["byId"]);
    ensure(doc, ["agro", "items"]);
    ensure(doc, ["fieldLabels"]);
    ensure(doc, ["categories"]);
    ensure(doc, ["subcategories"]);
    ensure(doc, ["buttons"]);
    ensure(doc, ["order"]);
    ensure(doc, ["product"]);

    let added = 0;

    // 1) Seed fieldLabels
    for (const [k, v] of Object.entries(BASELINE.fieldLabels)) {
      if (setIfMissing(doc, ["fieldLabels", k], v)) {
        added++;
        console.log(`(${lang}) + fieldLabels.${k}`);
      }
    }

    // 2) Seed categories from actual data (use baseline labels for known ones)
    for (const c of categoryKeys) {
      const label =
        BASELINE.categories[c] ||
        c.replace(/([A-Z])/g, " $1").replace(/^\w/, (m) => m.toUpperCase());
      if (setIfMissing(doc, ["categories", c], label)) {
        added++;
        console.log(`(${lang}) + categories.${c}`);
      }
    }

    // 3) Seed subcategories from actual data (keep as-is by default)
    for (const s of subcategoryKeys) {
      const label = BASELINE.subcategoriesFallback(s);
      if (setIfMissing(doc, ["subcategories", s], label)) {
        added++;
        console.log(`(${lang}) + subcategories.${s}`);
      }
    }

    // 4) Buttons / pageHeading / order / product utility strings
    if (
      setIfMissing(
        doc,
        ["buttons", "contactWhatsApp"],
        BASELINE.buttons.contactWhatsApp
      )
    ) {
      added++;
      console.log(`(${lang}) + buttons.contactWhatsApp`);
    }
    if (setIfMissing(doc, ["pageHeading"], BASELINE.pageHeading)) {
      added++;
      console.log(`(${lang}) + pageHeading`);
    }
    for (const [k, v] of Object.entries(BASELINE.order)) {
      if (setIfMissing(doc, ["order", k], v)) {
        added++;
        console.log(`(${lang}) + order.${k}`);
      }
    }
    for (const [k, v] of Object.entries(BASELINE.product)) {
      if (setIfMissing(doc, ["product", k], v)) {
        added++;
        console.log(`(${lang}) + product.${k}`);
      }
    }

    // 5) byId.* and agro.items.*
    for (const item of collected) {
      if (item.id) {
        if (
          setIfMissing(doc, ["byId", item.id, "label"], item.label || "[TODO]")
        ) {
          added++;
          console.log(`(${lang}) + byId.${item.id}.label`);
        }
        if (
          setIfMissing(
            doc,
            ["byId", item.id, "description"],
            item.description || "[TODO]"
          )
        ) {
          added++;
          console.log(`(${lang}) + byId.${item.id}.description`);
        }
      }
      if (isAgroBucket(item.groupName, item.subName) && item.slug) {
        const key = normalizeSlug(item.slug);
        if (
          setIfMissing(
            doc,
            ["agro", "items", key, "title"],
            item.label || "[TODO]"
          )
        ) {
          added++;
          console.log(`(${lang}) + agro.items.${key}.title`);
        }
        if (
          setIfMissing(
            doc,
            ["agro", "items", key, "description"],
            item.description || "[TODO]"
          )
        ) {
          added++;
          console.log(`(${lang}) + agro.items.${key}.description`);
        }
      }
    }

    if (added === 0) {
      console.log(`✅ ${lang}: nothing to add.`);
    } else if (DO_WRITE) {
      saveJSON(filePath, doc);
      console.log(
        `💾 ${lang}: wrote ${added} key(s) to ${path.relative(
          ROOT,
          filePath
        )}\n`
      );
    } else {
      console.log(
        `🔎 ${lang}: would add ${added} key(s) to ${path.relative(
          ROOT,
          filePath
        )}\n`
      );
    }
  }

  if (!DO_WRITE) {
    console.log("Dry run complete. Re-run with --write to save.");
  }
})();
