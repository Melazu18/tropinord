// server/routes/contact-general.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const { sendConfirmationEmail } = require("../utils/mailer");

router.post("/", async (req, res) => {
  const { name, email, message, token } = req.body;

  if (!name || !email || !message || !token) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const verifyRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    if (!verifyRes.data.success || verifyRes.data.score < 0.5) {
      return res.status(400).json({ error: "reCAPTCHA verification failed." });
    }

    // ✅ Email admin
    await sendConfirmationEmail({
      to: process.env.EMAIL_USER,
      subject: `📬 Contact Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // ✅ Optionally: Send confirmation to user
    await sendConfirmationEmail({
      to: email,
      subject: `✅ TropiNord – Message Received`,
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting TropiNord. We have received your message and will get back to you soon.</p>
        <p>Your message:</p>
        <blockquote>${message.replace(/\n/g, "<br>")}</blockquote>
        <p>Best regards,<br/>TropiNord Team</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Contact message error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
