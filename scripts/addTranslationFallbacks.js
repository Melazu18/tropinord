const path = require("path");
const fs = require("fs");

const SRC_DIR = path.join(__dirname, "../src");
const EN_DIR = path.join(__dirname, "../src/i18n/en");
const BASE_OUTPUT_DIR = path.join(__dirname, "../src/i18n");

const flattenKeys = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, val]) =>
    typeof val === "object" && val !== null
      ? flattenKeys(val, `${prefix}${key}.`)
      : [[`${prefix}${key}`, val]]
  );

function loadAllTranslations() {
  const files = fs.readdirSync(EN_DIR).filter((f) => f.endsWith(".json"));
  const all = {};

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(EN_DIR, file), "utf8"));
    Object.assign(all, Object.fromEntries(flattenKeys(data)));
  }

  return all;
}

const translationMap = loadAllTranslations();

const tCallRegex = /t\(\s*["']([\w.-]+)["']\s*\)/g;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  if (!content.includes("t(")) return;

  let updated = content.replace(tCallRegex, (match, key) => {
    const fallback = translationMap[key];
    if (!fallback) return match;

    // Skip if already has a fallback or second arg
    const fallbackRegex = new RegExp(
      `t\\(\\s*["']${key}["']\\s*,\\s*{\\s*defaultValue`
    );
    if (fallbackRegex.test(content)) return match;

    const safeFallback = fallback.replace(/"/g, '\\"');
    return `t("${key}", { defaultValue: "${safeFallback}" })`;
  });

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`✅ Updated: ${path.relative(__dirname, filePath)}`);
  }
}

function walkDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(jsx?|tsx?)$/.test(file)) {
      updateFile(fullPath);
    }
  }
}

walkDir(SRC_DIR);
