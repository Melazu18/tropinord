import React from "react";

export default function Success() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
      <p className="mt-4">A confirmation email has been sent to your inbox.</p>
    </div>
  );
}
