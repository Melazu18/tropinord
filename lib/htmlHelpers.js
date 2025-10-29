function generateOrderDetailsHtml(name, order, address = "", extra = {}) {
  const itemsHtml = order
    .map(
      (item) =>
        `<li><strong>${item.name}</strong> – Quantity: ${item.quantity} – Price: ${item.price}</li>`
    )
    .join("");

  const { email, phone, city, postal, country, paymentMethod, totalAmount } =
    extra;

  return `
    <h2>Hi ${name},</h2>
    <p>Thanks for your purchase from TropiNord!</p>

    <p><strong>Contact:</strong><br/>
      ${email || "N/A"}<br/>
      ${phone || ""}
    </p>

    <p><strong>Shipping Address:</strong><br/>
      ${address || `${postal || ""} ${city || ""}, ${country || ""}`}
    </p>

    <p>Here's a summary of your order:</p>
    <ul>${itemsHtml}</ul>

    <p><strong>Total:</strong> ${totalAmount}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod || "N/A"}</p>

    <p>We'll be in touch with delivery info shortly.</p>
    <p>Warm regards,<br/>The TropiNord Team</p>
  `;
}

module.exports = {
  generateOrderDetailsHtml,
};
