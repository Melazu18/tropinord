// src/components/ui/TidioChat.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TidioChat() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
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
        setScriptLoaded(true);

        const onReady = () => {
          try {
            // Set UI language and ensure the small launcher is visible
            window.tidioChatApi?.setLanguage?.(language);
            window.tidioChatApi?.show?.();
            window.tidioChatApi?.close?.(); // keep panel closed by default
          } catch {}

          // --- Remove waving-hand (and any emoji) from the greeting bubble ---
          const removeEmojis = (root) => {
            if (!root) return;
            // Regex for emoji (covers 👋 and most unicode emojis)
            const EMOJI_RE =
              /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\uFE0F|\u200D)/gu;

            // Scrub all text nodes under the greeting/popup container
            const walker = document.createTreeWalker(
              root,
              NodeFilter.SHOW_TEXT,
              null
            );
            const toChange = [];
            while (walker.nextNode()) {
              const n = walker.currentNode;
              if (EMOJI_RE.test(n.nodeValue)) toChange.push(n);
            }
            toChange.forEach((n) => {
              n.nodeValue = n.nodeValue
                .replace(EMOJI_RE, "")
                .replace(/\s+/g, " ")
                .trim();
            });
          };

          // Try to find the popup/greeting container next to the iframe
          const scrubNow = () => {
            const host = document.getElementById("tidio-chat") || document.body;
            // common containers Tidio uses for the launcher popup/greeting
            const candidates = host.querySelectorAll(
              [
                '[data-testid*="launcher"]',
                '[data-testid*="popup"]',
                ".tidio-chat-popup",
                ".tidio-chat-bubble",
                '.tidio-chat [class*="popup"]',
                '.tidio-chat [class*="greeting"]',
              ].join(",")
            );
            candidates.forEach((el) => removeEmojis(el));
          };

          // Initial pass
          scrubNow();

          // Keep it clean if Tidio re-renders
          const mo = new MutationObserver(() => scrubNow());
          mo.observe(document.body, { childList: true, subtree: true });

          // Stop observing when page unloads
          window.addEventListener("beforeunload", () => mo.disconnect(), {
            once: true,
          });
          // Also when Tidio is destroyed (defensive)
          window.tidioChatApi?.on?.("destroy", () => mo.disconnect());
        };

        if (window.tidioChatApi?.on) {
          window.tidioChatApi.on("ready", onReady);
        } else {
          setTimeout(onReady, 1200);
        }
      };

      document.body.appendChild(script);
    };

    // Lazy-load after the first interaction for performance
    ["scroll", "mousemove", "touchstart", "keydown"].forEach((ev) =>
      window.addEventListener(ev, loadTidio, { once: true })
    );

    return () => {
      ["scroll", "mousemove", "touchstart", "keydown"].forEach((ev) =>
        window.removeEventListener(ev, loadTidio)
      );
    };
  }, [scriptLoaded, language]);

  return null; // use Tidio’s own small launcher
}
