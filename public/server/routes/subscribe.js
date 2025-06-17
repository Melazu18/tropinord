// server/routes/subscribe.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Send subscription email to your Zoho admin inbox
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"TropiNord" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Subscription",
      text: `New subscriber: ${email}`,
      html: `<p><strong>New subscriber:</strong> ${email}</p>`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Zoho email error:", err.message);
    res.status(500).json({ error: "Failed to send subscription" });
  }
});

module.exports = router;
