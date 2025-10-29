// lib/notify.js
const { URLSearchParams } = require("url");
const fetch = require("node-fetch"); // ⚠️ Ensure this is installed via: npm install node-fetch

async function notifyWhatsApp({ name, email, totalAmount, items }) {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_FROM,
    TWILIO_WHATSAPP_TO,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_TO) {
    console.warn(" Twilio credentials missing, skipping WhatsApp notification");
    return;
  }

  const message = `🛍 *New TropiNord Order*
 *${name || "Unknown"}*
 ${email}

 *Total:* ${totalAmount}
 ${items.map((i) => `${i.name} x${i.quantity}`).join(", ")}`;

  const payload = new URLSearchParams({
    To: TWILIO_WHATSAPP_TO,
    From: TWILIO_WHATSAPP_FROM,
    Body: message,
  });

  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    }
  );
}

module.exports = { notifyWhatsApp };
