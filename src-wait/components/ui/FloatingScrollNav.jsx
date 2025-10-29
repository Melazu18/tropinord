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
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-3 z-50">
      {showButton && (
        <>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full shadow-md bg-green-600 text-white hover:bg-green-700 transition"
            title="Scroll to top"
          >
            ↑
          </button>
          <button
            onClick={scrollToBottom}
            className="p-2 rounded-full shadow-md bg-green-600 text-white hover:bg-green-700 transition"
            title="Scroll to bottom"
          >
            ↓
          </button>
        </>
      )}
    </div>
  );
}
