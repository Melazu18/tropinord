const { generateSwishQrBuffer } = require("./qrHelpers.js");
const { sendConfirmationEmail } = require("./mailer.js");
const { generateOrderDetailsHtml } = require("./htmlHelpers.js");
const { generateOrderPDF } = require("./pdfHelpers.js");
const { notifyWhatsApp } = require("./notify.js");
const { calculateTotal, getItemList } = require("./order-utils.js");

const productCatalog = require("./productCatalog.js");
const teaCatalog = require("../shared/teaCatalog.js");

// ✅ Merge catalogs
const fullCatalog = {
  ...productCatalog,
  ...teaCatalog,
};

async function handleSwishPayment({
  name,
  email,
  phone,
  street,
  postal,
  city,
  country,
  items,
  currency,
}) {
  const swishNumber = process.env.VITE_SWISH_NUMBER;

  // ✅ Lookup items using full catalog
  const itemList = items.map(({ id, quantity }) => {
    const product = fullCatalog[id] || {};
    return {
      id,
      name: product.name || id,
      image: product.image || null,
      quantity,
    };
  });

  // ✅ Calculate total
  const totalAmount = itemList.reduce((sum, item) => {
    const price = fullCatalog[item.id]?.prices?.[currency] || 0;
    return sum + price * item.quantity;
  }, 0);

  const address = `${street || "-"}, ${postal || "-"} ${city || "-"}, ${country || "-"}`;

  const htmlForCustomer = generateOrderDetailsHtml(
    name || "Customer",
    itemList,
    address
  );

  const htmlWithSwishInfo = `
    <h2 style="color: #15803d;">Thank you for your order, ${name || "Customer"}!</h2>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <p>We kindly ask you to Swish <strong>${totalAmount}</strong> to the number below:</p>
    <ul>
      <li><strong>Swish number:</strong> ${swishNumber}</li>
      <li><strong>Reference:</strong> ${email}</li>
    </ul>
    <p>You can also scan this QR code to pay:</p>
    <img src="cid:swishqr@tropinord" alt="Swish QR Code" width="180" />
    <hr/>
    ${htmlForCustomer}
  `;

  const pdfBuffer = await generateOrderPDF({
    name,
    email,
    phone,
    address,
    items: itemList,
    total: totalAmount,
    method: "Swish",
  });

  const qrBuffer = await generateSwishQrBuffer(swishNumber, totalAmount, email);

  // ✅ Send customer email with QR + receipt
  await sendConfirmationEmail({
    to: email,
    subject: "✅ Your TropiNord Order – Swish Payment Instructions",
    html: htmlWithSwishInfo,
    attachments: [
      {
        filename: "swish-qr.png",
        content: qrBuffer,
        contentType: "image/png",
        cid: "swishqr@tropinord",
      },
      {
        filename: "receipt.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  // ✅ Send admin copy
  await sendConfirmationEmail({
    to: process.env.EMAIL_USER,
    subject: "🛒 New TropiNord Order (Swish)",
    html: htmlForCustomer,
  });

  // ✅ Optional WhatsApp notification
  try {
    await notifyWhatsApp?.({ name, email, totalAmount, items: itemList });
  } catch (err) {
    console.warn("WhatsApp notification failed:", err.message);
  }

  // ✅ Return redirect to thank-you page with params
  return `${process.env.CLIENT_URL}/thank-you?method=swish&amount=${encodeURIComponent(
    totalAmount
  )}&reference=${encodeURIComponent(email)}&name=${encodeURIComponent(name || "")}`;
}

module.exports = handleSwishPayment;
