const express = require("express");
const cors = require("cors");
require("dotenv").config();

const webhookRoute = require("./webhook");
const createCheckoutSessionRoute = require("./routes/createCheckoutSession");
const contactRoute = require("./routes/contact");
const subscribeRoutes = require("./routes/subscribe");

const app = express();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ Stripe secret key not set in .env file.");
}

app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("🟢 TropiNord backend is up and running");
});

app.use("/api/create-checkout-session", createCheckoutSessionRoute);
app.use("/api/contact", contactRoute);
app.use("/webhook", webhookRoute);

app.use((err, req, res, next) => {
  console.error("❌ Internal Error:", err.stack);
  res.status(500).json({ error: "Server error occurred." });
});

app.listen(3001, () =>
  console.log("✅ Stripe server running on http://localhost:3001")
);

app.use("/api/subscribe", subscribeRoutes);
app.use("/api/contact-message", require("./routes/contact-general"));
