// scripts/updateRates.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const fallbackPath = path.join(__dirname, "../data/fallbackRates.json");

async function updateRates() {
  try {
    const res = await axios.get(
      "https://api.exchangerate.host/latest?base=EUR"
    );

    if (!res.data || !res.data.rates) {
      throw new Error("Invalid or missing exchange rates in response");
    }

    const supported = [
      "USD",
      "GBP",
      "SEK",
      "NOK",
      "DKK",
      "CHF",
      "PLN",
      "CAD",
      "AUD",
      "NZD",
      "JPY",
      "CNY",
      "INR",
      "ZAR",
      "TRY",
      "BRL",
      "MXN",
      "CZK",
      "HUF",
      "EUR",
    ];

    const filtered = Object.fromEntries(
      Object.entries(res.data.rates).filter(([k]) => supported.includes(k))
    );

    // Always include EUR
    filtered["EUR"] = 1;

    fs.writeFileSync(fallbackPath, JSON.stringify(filtered, null, 2));
    console.log("✅ fallbackRates.json updated!");
  } catch (err) {
    console.error("❌ Failed to update exchange rates:", err.message);

    // Optional: Print raw API response for debugging
    if (err.response?.data) {
      console.error(
        "🔎 API response:",
        JSON.stringify(err.response.data, null, 2)
      );
    }
  }
}

updateRates();
