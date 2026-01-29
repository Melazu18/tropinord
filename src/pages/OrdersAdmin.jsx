// src/pages/Admin/OrdersAdmin.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "../utils/api";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, { credentials: "include" });
      const j = await res.json();
      setOrders(j.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markPaid = async (orderId) => {
    setMarking(orderId);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/mark-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to mark paid");
      }
      await load();
    } catch (e) {
      alert(e.message || "Could not mark as paid");
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders (Admin)</h1>
      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Order ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Method</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId} className="border-b">
                  <td className="py-2 pr-4">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">{o.orderId}</td>
                  <td className="py-2 pr-4">{o.name}</td>
                  <td className="py-2 pr-4">{o.email}</td>
                  <td className="py-2 pr-4">{o.method?.toUpperCase()}</td>
                  <td className="py-2 pr-4">
                    {o.amount} {o.currency}
                  </td>
                  <td className="py-2 pr-4">{o.status}</td>
                  <td className="py-2 pr-4">
                    <button
                      onClick={() => markPaid(o.orderId)}
                      disabled={marking === o.orderId || o.status === "paid"}
                      className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      {o.status === "paid"
                        ? "Already Paid"
                        : marking === o.orderId
                        ? "Marking…"
                        : "Mark Paid & Send Receipt"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
