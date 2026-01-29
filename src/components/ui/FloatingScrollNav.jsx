// src/components/FloatingScrollNav.jsx
import React, { useEffect, useState } from "react";

export default function FloatingScrollNav() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const toggleButton = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", toggleButton);
    return () => window.removeEventListener("scroll", toggleButton);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    // moved slightly higher: bottom-24 ➜ bottom-32
    <div className="fixed left-4 bottom-32 flex flex-col items-center gap-3 z-40">
      {showButton && (
        <>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full shadow-md bg-green-600 text-white hover:bg-green-700 transition"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            ↑
          </button>
          <button
            onClick={scrollToBottom}
            className="p-2 rounded-full shadow-md bg-green-600 text-white hover:bg-green-700 transition"
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        </>
      )}
    </div>
  );
}
