const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const productCatalog = require("../data/productCatalog");
const { sendConfirmationEmail } = require("../utils/mailer");

router.post("/", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not configured");
    }

    const { items, currency = "EUR", email, name } = req.body;

    // ✅ Basic validation
    if (!email || !items?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Validate that all product IDs exist
    items.forEach(({ id }) => {
      if (!productCatalog[id]) {
        throw new Error(`Invalid product: ${id}`);
      }
    });

    // ✅ Prepare line items for Stripe
    const line_items = items.map(({ id, quantity }) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: { name: id },
        unit_amount: productCatalog[id], // price in cents
      },
      quantity,
    }));

    // ✅ Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: email,
      metadata: {
        name: name || "",
        email,
        currency,
        order: JSON.stringify(items), // ✅ used by webhook
      },
    });

    // ✅ Optionally send confirmation email immediately (not required if handled by webhook)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendConfirmationEmail({
        to: email,
        subject: "Order Confirmation",
        text: `Thank you for your order, ${name || "Customer"}!`,
      });
    }

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
