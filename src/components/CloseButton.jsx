// src/components/CloseButton.jsx
import React from "react";

export default function CloseButton({
  onClick,
  label = "Close",
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        "absolute top-3 right-3 z-20 flex items-center justify-center h-9 w-9 rounded-full " +
        "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md " +
        "hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition " +
        className
      }
    >
      <span className="text-lg leading-none">✕</span>
    </button>
  );
}
