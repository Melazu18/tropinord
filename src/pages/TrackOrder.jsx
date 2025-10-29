import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TrackOrder() {
  const { t } = useTranslation("track");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!email) {
      setError(t("errorEnterEmail"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/order-status?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("errorFetchOrder"));
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">🔍 {t("title")}</h2>

      <input
        type="email"
        placeholder={t("emailPlaceholder")}
        className="w-full p-2 border rounded mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={fetchOrders}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        {t("trackButton")}
      </button>

      {loading && <p className="text-center mt-4">{t("loading")}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="p-4 border rounded bg-gray-100 dark:bg-gray-800"
            >
              <p>
                <strong>{t("orderDate")}:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>{t("status")}:</strong> {order.status || t("pending")}
              </p>
              <p>
                <strong>{t("total")}:</strong> {(order.amount / 100).toFixed(2)}{" "}
                SEK
              </p>
              <p>
                <strong>{t("paymentMethod")}:</strong> {order.method}
              </p>

              {order.receiptFilename && (
                <p>
                  <strong>{t("receipt")}:</strong>{" "}
                  <a
                    href={`/receipts/${order.receiptFilename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {t("download")}
                  </a>
                </p>
              )}

              <p>
                <strong>{t("items")}:</strong>{" "}
                {order.items
                  ?.map((i) => `${i.label || i.id} × ${i.quantity}`)
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
