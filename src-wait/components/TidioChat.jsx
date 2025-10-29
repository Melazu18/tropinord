import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TidioChat() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const [loading, setLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    let hasInteracted = false;

    const loadTidio = () => {
      if (hasInteracted || scriptLoaded) return;
      hasInteracted = true;

      const script = document.createElement("script");
      script.src = "https://code.tidio.co/dnl2phhmisljdoefgclng1nwuusxf55k.js";
      script.async = true;

      script.onload = () => {
        setLoading(false);
        setScriptLoaded(true);

        const trySetLanguage = () => {
          if (
            window.tidioChatApi &&
            typeof window.tidioChatApi.setLanguage === "function"
          ) {
            window.tidioChatApi.setLanguage(language);
          }
        };

        if (window.tidioChatApi && window.tidioChatApi.on) {
          window.tidioChatApi.on("ready", trySetLanguage);
        } else {
          // Fallback retry after a short delay
          setTimeout(trySetLanguage, 1500);
        }
      };

      document.body.appendChild(script);
    };

    const interactionEvents = ["scroll", "mousemove", "touchstart", "keydown"];
    interactionEvents.forEach((event) =>
      window.addEventListener(event, loadTidio, { once: true })
    );

    return () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, loadTidio)
      );
    };
  }, [scriptLoaded]);

  useEffect(() => {
    if (
      window.tidioChatApi &&
      typeof window.tidioChatApi.setLanguage === "function"
    ) {
      window.tidioChatApi.setLanguage(language);
    }
  }, [language]);

  return loading ? (
    <div className="fixed bottom-4 right-4 text-xs text-gray-500">
      💬 Loading chat...
    </div>
  ) : null;
}
