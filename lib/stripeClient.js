const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing from environment!");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;
