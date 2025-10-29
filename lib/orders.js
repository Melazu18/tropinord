const fs = require("fs");
const path = require("path");

const ORDERS_FILE = path.join(__dirname, "../orders.json");

function readOrders() {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function findOrderByEmail(email) {
  const orders = readOrders();
  return (
    orders.find((order) => order.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
}

function saveOrder(order) {
  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);
}

module.exports = {
  findOrderByEmail,
  saveOrder,
};
