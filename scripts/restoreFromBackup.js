const fs = require("fs");
const path = require("path");
const readline = require("readline");

const SRC_DIR = path.join(__dirname, "../src");
const BACKUP_DIR = path.join(
  __dirname,
  "../src/__backup_before_fallback_removal__"
);
const UNDO_RESTORE_BACKUP_DIR = path.join(__dirname, "../src/__undo_restore__");

// Recursively walk and apply a function to every JS/JSX file
function walk(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, callback);
    else if (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))
      callback(fullPath);
  });
}

// Copy file and ensure directory exists
function safeCopyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// Before overwriting files, backup the current state for undo
function backupForUndo() {
  console.log("📦 Backing up current files to __undo_restore__...");
  walk(SRC_DIR, (file) => {
    const relPath = path.relative(SRC_DIR, file);
    const backupPath = path.join(UNDO_RESTORE_BACKUP_DIR, relPath);
    safeCopyFile(file, backupPath);
  });
  console.log("✅ Undo backup complete.");
}

// Restore from backup directory
function restoreFile(backupFilePath) {
  const relPath = path.relative(BACKUP_DIR, backupFilePath);
  const destPath = path.join(SRC_DIR, relPath);
  safeCopyFile(backupFilePath, destPath);
  console.log(`🔄 Restored: ${relPath}`);
}

// Ask user before proceeding
function askConfirmation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "⚠️  This will overwrite current files with backup versions.\nDo you want to continue and create an undo point? (yes/no): ",
    (answer) => {
      rl.close();
      if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
        backupForUndo();
        walk(BACKUP_DIR, restoreFile);
        console.log(
          "✅ Files restored from backup. Undo available in __undo_restore__."
        );
      } else {
        console.log("❌ Restore cancelled.");
      }
    }
  );
}

if (!fs.existsSync(BACKUP_DIR)) {
  console.error("❌ Backup directory not found. Nothing to restore.");
  process.exit(1);
}

askConfirmation();
