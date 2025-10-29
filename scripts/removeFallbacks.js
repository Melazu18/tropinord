const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "../src");
const BACKUP_DIR = path.join(
  __dirname,
  "../src/__backup_before_fallback_removal__"
);

function ensureBackupDirStructure(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(filePath, backupPath);
}

function walk(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, callback);
    else if (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))
      callback(fullPath);
  });
}

function removeFallbacks(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  const updated = content.replace(
    /t\((["'`].+?["'`])\s*,\s*["'`].+?["'`]\)/g,
    "t($1)"
  );

  if (updated !== content) {
    ensureBackupDirStructure(filePath);
    fs.writeFileSync(filePath, updated, "utf-8");
    console.log(`🧼 Cleaned: ${path.relative(SRC_DIR, filePath)}`);
  }
}

walk(SRC_DIR, removeFallbacks);
