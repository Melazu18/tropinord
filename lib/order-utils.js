// lib/order-utils.js
const productCatalog = require("./productCatalog");

function getItemList(items, currency = "EUR") {
  const symbol = currency === "EUR" ? "€" : "kr";
  return items.map(({ id, quantity }) => ({
    name: id,
    quantity,
    price: `${symbol}${(
      ((productCatalog[id] || 1000) * quantity) /
      100
    ).toFixed(2)}`,
  }));
}

function calculateTotal(items, currency = "EUR") {
  const symbol = currency === "EUR" ? "€" : "kr";
  const total = items.reduce((sum, item) => {
    const unit = productCatalog[item.id] || 1000;
    return sum + unit * item.quantity;
  }, 0);
  return `${symbol}${(total / 100).toFixed(2)}`;
}

function buildStripeLineItems(items, currency = "EUR") {
  return items.map(({ id, quantity }) => ({
    price_data: {
      currency: currency.toLowerCase(),
      product_data: { name: id },
      unit_amount: productCatalog[id] || 1000,
    },
    quantity,
  }));
}

module.exports = {
  getItemList,
  calculateTotal,
  buildStripeLineItems,
};
