// src/components/chat/ChatWidget.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../utils/api";
import ChatProductSuggestions from "./ChatProductSuggestions";
import { useCart } from "../../contexts/CartContext";

export default function ChatWidget() {
  const { i18n } = useTranslation();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const userLanguage = (i18n.language || "en").slice(0, 2);

  const makeId = (prefix) =>
    `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    const newUserMsg = {
      id: makeId("user"),
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const existingSession = localStorage.getItem("tn_chat_session");
      const chatSessionId =
        existingSession ||
        (() => {
          const id = makeId("session");
          localStorage.setItem("tn_chat_session", id);
          return id;
        })();

      const cartPayload = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name,
      }));

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          userLanguage,
          tone: "default",
          chatSessionId,
          cart: cartPayload,
        }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId("assistant"),
            role: "assistant",
            content:
              userLanguage === "sv"
                ? "Tyvärr, jag kunde inte svara just nu."
                : "Sorry, I couldn't respond right now.",
          },
        ]);
        return;
      }

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId("assistant"),
            role: "assistant",
            content:
              userLanguage === "sv"
                ? "Tyvärr, jag kunde inte svara just nu."
                : "Sorry, I couldn't respond right now.",
          },
        ]);
      } else {
        if (data.cartAction?.action) {
          const action = data.cartAction.action;
          const items = data.cartAction.items || [];

          if (action === "ADD_TO_CART") {
            items.forEach((item) => {
              addToCart({
                id: item.productId,
                quantity: item.quantity || 1,
                name: item.name,
                source: "chat-intent",
              });
            });
          } else if (action === "REMOVE_FROM_CART") {
            items.forEach((item) => removeFromCart(item.productId));
          } else if (action === "UPDATE_QUANTITY") {
            items.forEach((item) =>
              updateQuantity(item.productId, item.quantity || 1)
            );
          } else if (action === "CLEAR_CART") {
            clearCart();
          }
        }

        const assistantMsg = {
          id: makeId("assistant"),
          role: "assistant",
          content: data.reply,
          productSuggestions: data.productSuggestions || [],
          language: data.language || userLanguage,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId("assistant"),
          role: "assistant",
          content:
            userLanguage === "sv"
              ? "Tekniskt fel. Försök igen lite senare."
              : "Technical issue. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating open/close button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-40 rounded-full shadow-lg px-4 py-2 text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-800 transition"
      >
        {open ? "×" : "Chat"}
      </button>

      {open && (
        <div className="fixed bottom-36 right-4 z-40 w-80 max-h-[70vh] flex flex-col rounded-2xl shadow-xl border border-emerald-100 bg-white [color-scheme:light] dark:[color-scheme:dark]">
          <div className="px-3 py-2 border-b border-emerald-50 bg-emerald-700 text-white rounded-t-2xl flex items-center justify-between">
            <span className="text-sm font-semibold">
              TropiNord Assistant 🌿
            </span>
            <button
              type="button"
              className="text-xs opacity-80 hover:opacity-100"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-emerald-50/20"
          >
            {/* messages */}
            {messages.length === 0 && (
              <div className="text-xs text-gray-500">
                {userLanguage === "sv"
                  ? "Hej! Fråga gärna om teer, oljor eller frakt."
                  : "Hi! Ask me about teas, oils, or shipping."}
              </div>
            )}

            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id || idx}
                  className={isUser ? "text-right" : "text-left"}
                >
                  <div
                    className={
                      "inline-block px-2 py-1 rounded-lg max-w-[90%] " +
                      (isUser
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-emerald-100 text-gray-800")
                    }
                  >
                    {m.content}
                  </div>

                  {!isUser &&
                    Array.isArray(m.productSuggestions) &&
                    m.productSuggestions.length > 0 && (
                      <ChatProductSuggestions
                        suggestions={m.productSuggestions}
                        language={m.language || userLanguage}
                        onAddToCart={(productId, quantity = 1) => {
                          const suggestion = m.productSuggestions.find(
                            (p) => p.productId === productId
                          );
                          addToCart({
                            id: productId,
                            quantity,
                            name: suggestion?.name,
                            source: "chat-suggestion",
                          });
                        }}
                      />
                    )}
                </div>
              );
            })}

            {loading && (
              <div className="text-xs text-gray-500">
                {userLanguage === "sv" ? "Tänker …" : "Thinking…"}
              </div>
            )}
          </div>

          {/* FIXED INPUT FIELD */}
          <form
            onSubmit={sendMessage}
            className="flex border-t border-emerald-50"
          >
            <input
              className="
                tn-chat-input
                flex-1 px-2 py-2 text-xs outline-none rounded-bl-2xl
                bg-white text-gray-900 placeholder-gray-500
                dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400
              "
              placeholder={
                userLanguage === "sv"
                  ? "Skriv din fråga här…"
                  : "Type your question here…"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 text-xs font-medium border-l border-emerald-50 bg-emerald-600 text-white rounded-br-2xl hover:bg-emerald-700 disabled:opacity-60"
            >
              {userLanguage === "sv" ? "Skicka" : "Send"}
            </button>
          </form>

          <div className="px-3 py-1 text-[10px] text-gray-400 text-center border-t border-emerald-50">
            AI-assistenten kan göra misstag. Vid viktiga frågor, kontakta oss
            direkt.
          </div>
        </div>
      )}
    </>
  );
}
