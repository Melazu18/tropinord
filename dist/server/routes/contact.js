// server/routes/contact.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const router = express.Router();
const { sendConfirmationEmail } = require("../utils/mailer");

const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

router.post("/", async (req, res) => {
  const {
    name,
    email,
    phone,
    street,
    postal,
    city,
    country,
    products,
    currency,
    total,
    vat,
    notes,
    token,
  } = req.body;

  if (!name || !email || !products || !total || !token) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const verifyRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const { success, score, "error-codes": errorCodes } = verifyRes.data;

    if (!success || score < 0.5) {
      console.warn("⚠️ reCAPTCHA failed", {
        success,
        score,
        errorCodes,
        client: email,
      });
      return res.status(400).json({ error: "reCAPTCHA verification failed." });
    }

    const fullAddress = `${street}, ${postal} ${city}, ${country}`;

    const logEntry = {
      name,
      email,
      phone,
      address: fullAddress,
      products,
      currency,
      total,
      vat,
      notes,
      date: new Date().toISOString(),
    };

    // ✅ Email admin
    await sendConfirmationEmail({
      to: process.env.EMAIL_USER,
      subject: `📦 New Order from ${name}`,
      html: `
        <h2 style="margin-bottom:10px;">New Order Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${fullAddress}</p>
        <p><strong>Products:</strong><br/>${products.replace(/\n/g, "<br>")}</p>
        <p><strong>Currency:</strong> ${currency}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>VAT:</strong> ${vat}</p>
        <p><strong>Notes:</strong><br/>${
          notes?.replace(/\n/g, "<br>") || "-"
        }</p>
      `,
    });

    // ✅ Email user
    await sendConfirmationEmail({
      to: email,
      subject: `🧾 Your TropiNord Order Confirmation`,
      html: `
        <h2 style="margin-bottom:10px;">Thank you for your order, ${name}!</h2>
        <p>We’ve received your order and will process it soon.</p>
        <p><strong>Products:</strong><br/>${products.replace(/\n/g, "<br>")}</p>
        <p><strong>Total:</strong> ${total} ${currency}</p>
        <p><strong>Delivery Address:</strong><br/>${fullAddress}</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Warm regards,<br/>TropiNord Team</p>
      `,
    });

    // ✅ Log to file
    const logPath = path.join(__dirname, "../logs/order-submissions.json");
    fs.promises.mkdir(path.dirname(logPath), { recursive: true });
    fs.promises
      .readFile(logPath, "utf-8")
      .then((data) => JSON.parse(data))
      .catch(() => [])
      .then((log) =>
        fs.promises.writeFile(
          logPath,
          JSON.stringify([...log, logEntry], null, 2)
        )
      )
      .catch((err) => console.error("Logging error:", err));

    // ✅ Forward to Google Sheets
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      axios.post(GOOGLE_SHEET_WEBHOOK_URL, logEntry).catch((err) => {
        console.warn("Google Sheet logging failed:", err.message);
      });
    }

    // ✅ Send WhatsApp via Twilio if set
    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_WHATSAPP_FROM,
      TWILIO_WHATSAPP_TO,
    } = process.env;

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      const payload = new URLSearchParams({
        To: TWILIO_WHATSAPP_TO,
        From: TWILIO_WHATSAPP_FROM,
        Body: `🛍 *New TropiNord Order!*\n\n👤 *Name:* ${name}\n📧 ${email}\n📦 *Products:* ${products}\n💰 *Total:* ${total} ${currency}\n📍 *Address:* ${fullAddress}\n📝 ${
          notes || "–"
        }`,
      });

      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        payload,
        {
          auth: {
            username: TWILIO_ACCOUNT_SID,
            password: TWILIO_AUTH_TOKEN,
          },
        }
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to process order:", err);
    res.status(500).json({ error: "Failed to send order." });
  }
});

module.exports = router;
