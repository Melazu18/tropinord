import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/session-status?sessionId=${sessionId}`);
        const data = await res.json();
        setStatus(data.payment_status);
      } catch (err) {
        console.error("Error fetching order status:", err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) checkStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          🧾 Order Status
        </h1>

        {loading ? (
          <p className="text-gray-600">Checking status...</p>
        ) : status === "error" ? (
          <p className="text-red-600">Unable to retrieve status.</p>
        ) : (
          <p className="text-gray-800 dark:text-white">
            Current status:{" "}
            <span className="font-semibold text-green-700">{status}</span>
          </p>
        )}
      </div>
    </div>
  );
}
