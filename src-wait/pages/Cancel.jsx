import React from "react";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 text-center p-6">
      <div className="max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Payment Cancelled
        </h1>
        <p className="mb-6 text-gray-600">
          Your payment was cancelled. If this was a mistake, you can try again
          below.
        </p>
        <Link
          to="/order"
          className="inline-block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
