const transporter = require("./utils/mailer");
const generateOrderDetailsHtml = require("./utils/generateOrderDetailsHtml");

const translations = {
  sv: {
    greeting: "Hej",
    thanks:
      "Tack för din beställning från TropiNord! Här är dina orderdetaljer:",
    processing:
      "Vi behandlar din beställning inom kort och meddelar dig när den skickats.",
    regards: "Vänliga hälsningar",
  },
  en: {
    greeting: "Hello",
    thanks:
      "Thank you for your order from TropiNord! Here are your order details:",
    processing:
      "We are processing your order and will notify you once it ships.",
    regards: "Kind regards",
  },
};

async function sendConfirmationEmail({
  to,
  customerName,
  order,
  currency = "EUR",
  language = "en",
}) {
  const htmlContent = generateOrderDetailsHtml(customerName, order, currency);
  const t = translations[language] || translations.en;

  const mailOptions = {
    from: `"TropiNord" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🧾 TropiNord Order Confirmation - Thank You, ${customerName}! (${currency})`,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2>${t.greeting} ${customerName},</h2>
        <p>${t.thanks}</p>
        ${htmlContent}
        <p>${t.processing}</p>
        <p style="margin-top: 20px;">${t.regards},<br/>TropiNord Teamet</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Confirmation email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
}

module.exports = sendConfirmationEmail;
