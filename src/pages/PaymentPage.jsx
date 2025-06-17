import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();

  const redirectToStripeCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              { id: "Lavender Oil", quantity: 1 },
              { id: "Neem Oil", quantity: 2 },
            ],
          }),
        }
      );

      const session = await response.json();
      if (session?.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Session URL not returned");
      }
    } catch (error) {
      console.error("❌ Failed to redirect to Stripe Checkout:", error);
      alert("Stripe checkout failed. See console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">
        Choose a Payment Method
      </h2>
      <div className="space-y-4">
        <button
          onClick={redirectToStripeCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded shadow"
        >
          Pay with PayPal (via Stripe)
        </button>
        <button
          onClick={() => alert("Klarna integration coming soon!")}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-5 rounded shadow"
        >
          Pay with Klarna
        </button>
        <button
          onClick={() => alert("Swish integration coming soon!")}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-5 rounded shadow"
        >
          Pay with Swish
        </button>
        <button
          onClick={() => alert("Bank transfer instructions coming soon!")}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 px-5 rounded shadow"
        >
          Pay via Bank Transfer
        </button>
        <button
          onClick={() => navigate("/order")}
          className="mt-6 w-full text-center text-sm text-gray-500 hover:underline"
        >
          ← Back to Order Form
        </button>
      </div>
    </div>
  );
}
