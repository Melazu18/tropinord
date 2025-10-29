const { sendConfirmationEmail } = require("./mailer.js");
const { generateOrderDetailsHtml } = require("./htmlHelpers.js");
const { generateOrderPDF } = require("./pdfHelpers.js");
const { notifyWhatsApp } = require("./notify.js");
const { calculateTotal, getItemList } = require("./order-utils.js");

const bankgiroNumber = process.env.VITE_BANKGIRO_NUMBER;

async function handleBankgiroPayment({
  name,
  email,
  phone,
  street,
  postal,
  city,
  country,
  items,
  currency = "EUR",
}) {
  const itemList = getItemList(items, currency);
  const totalAmount = calculateTotal(items, currency);
  const address = `${street}, ${postal} ${city}, ${country}`;
  const subject = " Your TropiNord Order – Bankgiro";

  const html = `
    ${generateOrderDetailsHtml(name, itemList, address)}
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <p>Please transfer <strong>${totalAmount}</strong> to:</p>
    <ul>
      <li><strong>Bankgiro Number:</strong> ${bankgiroNumber}</li>
      <li><strong>Reference:</strong> ${email}</li>
    </ul>
  `;

  const adminHtml = `
    <h2>New Bankgiro Order</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Total:</strong> ${totalAmount}</p>
    <ul>${itemList
      .map(
        (item) =>
          `<li><strong>${item.name}</strong> – Qty: ${item.quantity} – Price: ${item.price}</li>`
      )
      .join("")}</ul>
  `;

  const pdfBuffer = await generateOrderPDF({
    name,
    email,
    phone,
    address,
    items: itemList,
    total: totalAmount,
    method: "bankgiro",
  });

  await sendConfirmationEmail({
    to: email,
    subject,
    html,
    attachments: [
      {
        filename: "TropiNord-Order.pdf",
        content: pdfBuffer,
      },
    ],
  });

  await sendConfirmationEmail({
    to: process.env.EMAIL_USER,
    subject: " New TropiNord Order (Bankgiro)",
    html: adminHtml,
  });

  try {
    await notifyWhatsApp?.({ name, email, totalAmount, items });
  } catch (err) {
    console.warn(" WhatsApp notification failed:", err.message);
  }

  return `${
    process.env.CLIENT_URL
  }/success?method=bankgiro&amount=${encodeURIComponent(
    totalAmount
  )}&reference=${encodeURIComponent(email)}`;
}

module.exports = handleBankgiroPayment;
