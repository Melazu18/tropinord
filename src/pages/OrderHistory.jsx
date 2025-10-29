// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "../utils/getLocalizedPath";

export default function OrderHistory() {
  const { t, i18n } = useTranslation(["dashboard"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = "customer@example.com"; // same behavior as before

  const lang = (i18n.language || "en").slice(0, 2);

  // Build the base path to the localized reviews route
  const reviewsBase = (() => {
    try {
      // if you have routeMap.reviews set up, this will use it
      return getLocalizedPath("reviews", lang).replace(/\/$/, "");
    } catch {
      // safe fallback that matches your LocalizedRoutes
      return lang === "sv" ? "/sv/recensioner" : "/en/reviews";
    }
  })();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orderStatus?email=${email}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch order history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10">
        {t("orders.loading", { defaultValue: "🔄 Loading your orders..." })}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        {t("noOrdersForEmail", { email })}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {t("orders.title", { defaultValue: "📦 Order History" })}
      </h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="mb-6 border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
        >
          <p className="font-semibold mb-2">
            {t("orders.orderId", { defaultValue: "Order ID" })}: {order.id}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {t("orders.date", { defaultValue: "Date" })}:{" "}
            {new Date(order.date || order.createdAt).toLocaleDateString()}
          </p>

          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center mb-3"
            >
              <span>{item.name}</span>
              <Link
                to={`${reviewsBase}/${item.productId}?orderId=${order.id}&email=${email}`}
                className="text-sm text-green-600 hover:underline"
              >
                {t("orders.leaveReview", { defaultValue: "Leave a Review" })}
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
