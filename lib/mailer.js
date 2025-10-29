// lib/mailer.js
const nodemailer = require("nodemailer");

const isProd = process.env.NODE_ENV === "production";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// If no creds in dev, create a dummy sender that just logs.
let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  if (!isProd) {
    transporter.verify((err) => {
      if (err)
        console.error("✉️  Email transporter setup failed:", err.message);
      else console.log("✉️  Email transporter ready");
    });
  }
} else if (!isProd) {
  console.warn(
    "✉️  EMAIL_USER/EMAIL_PASS not set — dev mode will log emails instead of sending."
  );
}

function stripHtml(html = "") {
  return html
    .replace(/<br\s*\/?>(\n)?/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

async function sendConfirmationEmail({ to, subject, html, attachments = [] }) {
  if (!to || !subject || !html) {
    console.error("✉️  Missing email parameters:", { to, subject });
    return;
  }

  const text = stripHtml(html);

  // Dev fallback: no transporter → just log
  if (!transporter) {
    console.log("---- DEV EMAIL (not sent) ----");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Text:", text);
    if (attachments?.length) {
      console.log(
        "Attachments:",
        attachments.map((a) => a.filename).join(", ")
      );
    }
    console.log("------------------------------");
    return;
  }

  // Real send
  try {
    await transporter.sendMail({
      from: `"TropiNord" <${EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
      attachments,
    });

    if (attachments.length > 0) {
      const filenames = attachments.map((a) => a.filename).join(", ");
      console.log(`📎 Email sent to ${to} with attachments: ${filenames}`);
    } else {
      console.log(`✉️  Email sent to ${to}`);
    }
  } catch (err) {
    console.error("✉️  Email sending failed:", err.message);
    if (isProd) throw err; // only fail hard in production
  }
}

function generateReviewLinks(items, orderId, email) {
  /* unchanged */
}
async function sendDeliveryConfirmationEmail({ to, name, orderId, items }) {
  /* unchanged */
}

module.exports = {
  sendConfirmationEmail,
  generateReviewLinks,
  sendDeliveryConfirmationEmail,
};
