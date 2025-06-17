const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sendConfirmationEmail = require("./sendConfirmation");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const metadata = session.metadata || {};
      const customerName = metadata.name || "Customer";
      const customerEmail = metadata.email || "orders@tropinord.com";
      const currency = metadata.currency || "EUR";

      let order = [];

      try {
        order = JSON.parse(metadata.order || "[]");
        if (!Array.isArray(order)) throw new Error("Invalid order format");
      } catch (parseErr) {
        console.error("❌ Failed to parse order metadata:", parseErr.message);
        order = []; // fallback to empty array
      }

      try {
        await sendConfirmationEmail({
          to: customerEmail,
          customerName,
          order,
          currency,
        });
        console.log("✅ Confirmation email sent to:", customerEmail);
        if (order.length) {
          console.table(order);
        }
      } catch (err) {
        console.error("❌ Failed to send confirmation email:", err.message);
      }
    }

    res.status(200).send("✅ Webhook received");
  }
);

module.exports = router;
