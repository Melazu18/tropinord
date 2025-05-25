import React from "react";

const OrderForm = () => {
  console.log("✅ OrderForm component loaded.");

  return (
    <div style={{ padding: "2rem" }}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSePSc0eb42eMrU-KGKZiPbTtXGKmItQU6ds2Mw4KuuS-cFbdA/viewform?embedded=true"
        width="100%"
        height="4860"
        style={{ border: "none" }}
        title="TropiNord Order Form"
        allowFullScreen
      >
        Loading…
      </iframe>
    </div>
  );
};

export default OrderForm;
