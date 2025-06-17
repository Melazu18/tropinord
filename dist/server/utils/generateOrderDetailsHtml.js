function generateOrderDetailsHtml(name, order) {
  const itemsHtml = order
    .map(
      (item) =>
        `<li><strong>${item.name}</strong> - Quantity: ${item.quantity} - Price: ${item.price}</li>`
    )
    .join("");

  return `
    <h2>Hi ${name},</h2>
    <p>Thanks for your purchase from TropiNord!</p>
    <p>Here's a summary of your order:</p>
    <ul>${itemsHtml}</ul>
    <p>We'll be in touch with delivery info shortly.</p>
    <p>Warm regards,<br/>The TropiNord Team</p>
  `;
}

module.exports = generateOrderDetailsHtml;
