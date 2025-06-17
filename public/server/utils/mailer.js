const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu", // Use smtp.zoho.com if you're outside the EU
  port: 465,
  secure: true, // True for SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password from Zoho
  },
});

// Optional: verify connection on startup (helpful in dev)
if (process.env.NODE_ENV !== "production") {
  transporter.verify((err, success) => {
    if (err) {
      console.error("❌ Email transporter setup failed:", err.message);
    } else {
      console.log("✅ Email transporter ready");
    }
  });
}

// ✅ Strip HTML for plain-text fallback
const stripHtml = (html = "") =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

// ✅ Define and export the sendConfirmationEmail function
const sendConfirmationEmail = async ({ to, subject, html }) => {
  if (!to || !subject || !html) {
    console.error("❌ Missing email parameters:", { to, subject, html });
    return;
  }

  const text = stripHtml(html);

  try {
    await transporter.sendMail({
      from: `"TropiNord" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text, // ✅ Fallback for clients that don't support HTML
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
};

module.exports = { sendConfirmationEmail };
