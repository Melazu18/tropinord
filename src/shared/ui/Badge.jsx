// src/shared/ui/Badge.jsx
import React from "react";

export const IconBadge = ({ tooltip, children }) => (
  <span className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 group">
    {children}
    {tooltip && (
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        {tooltip}
      </span>
    )}
  </span>
);

export const LeafIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden>
    <path
      d="M19.9 4.2C14.3 3.8 9.6 6 5.9 9.7A8.5 8.5 0 0 0 5 19l.3.3A8.5 8.5 0 0 0 14.3 18c3.7-3.7 5.9-8.4 5.4-14zm-4.4 5.2c-2.8 1.4-5.3 3.5-7.3 6.2l-1.2-.9c2.2-3 5-5.3 8.1-6.8l.4 1.5z"
      fill="currentColor"
    />
  </svg>
);

export const PressIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden>
    <path
      d="M7 4h10v3H7V4zm-2 5h14a2 2 0 0 1 2 2v1H3v-1a2 2 0 0 1 2-2zm-2 6h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z"
      fill="currentColor"
    />
  </svg>
);

export const CupIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden>
    <path
      d="M3 7h13v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V7Zm13 0h3a3 3 0 0 1 0 6h-3V7Z"
      fill="currentColor"
    />
  </svg>
);

export const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden>
    <path
      d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Zm-1 14-4-4 1.4-1.4L11 12.2l5.6-5.6L18 8l-7 8Z"
      fill="currentColor"
    />
  </svg>
);
