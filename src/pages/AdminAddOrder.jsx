import React, { useState } from "react";
import IdentityUploader from "../components/account/IdentityUploader";

export default function AdminAddOrder() {
  const [order, setOrder] = useState({
    email: "",
    amount: "",
    method: "swish",
    reference: "",
    status: "Pending Payment",
    items: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const parsedItems = order.items.split(",").map((i) => {
      const [label, qty] = i.trim().split("×");
      return { label: label.trim(), quantity: Number(qty || 1) };
    });

    const payload = {
      ...order,
      amount: Number(order.amount) * 100, // Convert to öre
      items: parsedItems,
    };

    try {
      const res = await fetch("/api/add-manual-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setResult("✅ Order saved!");
      } else {
        setResult("❌ Error: " + data.error);
      }
    } catch (err) {
      setResult("❌ Failed to save order");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📝 Add Manual Order</h2>

      {["email", "amount", "reference", "status", "items"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={order[field]}
          onChange={handleChange}
          className="w-full border mb-2 p-2 rounded"
        />
      ))}

      <select
        name="method"
        value={order.method}
        onChange={handleChange}
        className="w-full border mb-2 p-2 rounded"
      >
        <option value="swish">Swish</option>
        <option value="bankgiro">Bankgiro</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Save Order
      </button>

      {result && <p className="mt-3 text-sm">{result}</p>}
    </div>
  );
}
