const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { copyFileSync, mkdirSync, existsSync, rmSync } = fs;

const SRC_DIR = path.join(__dirname, "../src");
const UNDO_BACKUP_DIR = path.join(SRC_DIR, "__undo_restore__");
const SAFETY_BACKUP_DIR = path.join(SRC_DIR, "__pre_undo_backup__");

function walk(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, callback);
    else if (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))
      callback(fullPath);
  });
}

function safeCopyFile(src, dest) {
  mkdirSync(path.dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

function backupCurrentState() {
  if (existsSync(SAFETY_BACKUP_DIR)) {
    rmSync(SAFETY_BACKUP_DIR, { recursive: true, force: true });
  }
  walk(UNDO_BACKUP_DIR, (undoPath) => {
    const relPath = path.relative(UNDO_BACKUP_DIR, undoPath);
    const srcFile = path.join(SRC_DIR, relPath);
    const destBackup = path.join(SAFETY_BACKUP_DIR, relPath);
    if (existsSync(srcFile)) {
      safeCopyFile(srcFile, destBackup);
    }
  });
  console.log("🛡️  Current files backed up to __pre_undo_backup__");
}

function restoreFromUndo() {
  walk(UNDO_BACKUP_DIR, (undoFilePath) => {
    const relPath = path.relative(UNDO_BACKUP_DIR, undoFilePath);
    const destPath = path.join(SRC_DIR, relPath);
    safeCopyFile(undoFilePath, destPath);
    console.log(`↩️  Undone: ${relPath}`);
  });

  rmSync(UNDO_BACKUP_DIR, { recursive: true, force: true });
  console.log("🧹 Cleaned up __undo_restore__ directory");
}

function confirmAndRun() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "⚠️  This will undo the last restore, overwrite files, and delete __undo_restore__.\nProceed? (yes/no): ",
    (answer) => {
      rl.close();
      if (answer.toLowerCase().startsWith("y")) {
        backupCurrentState();
        restoreFromUndo();
        console.log("✅ Undo complete.");
      } else {
        console.log("❌ Undo cancelled.");
      }
    }
  );
}

if (!existsSync(UNDO_BACKUP_DIR)) {
  console.error("❌ Cannot undo: __undo_restore__ does not exist.");
  process.exit(1);
}

confirmAndRun();
