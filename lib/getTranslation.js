const fs = require("fs");
const path = require("path");

function getTranslation(locale = "en") {
  try {
    const filePath = path.join(
      __dirname,
      "../server/locales",
      locale,
      "order.json"
    );
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    const fallback = path.join(__dirname, "../server/locales/en/order.json");
    return JSON.parse(fs.readFileSync(fallback, "utf8"));
  }
}

module.exports = getTranslation;
