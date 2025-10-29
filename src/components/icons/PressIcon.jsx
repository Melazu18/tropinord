import React from "react";

/**
 * TropiNord PressIcon
 * - Compact, readable at small sizes
 * - Uses currentColor so it inherits text color
 * - Pass className/size props to style via Tailwind or CSS
 *
 * Usage:
 *   <PressIcon className="w-6 h-6 text-emerald-600" />
 */
export default function PressIcon({
  className = "w-6 h-6",
  strokeWidth = 1.8,
  ...props
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Top press beam */}
      <rect x="3" y="4" width="18" height="3" rx="1.5" />

      {/* Screw shaft */}
      <path d="M12 7v6" />

      {/* Press plates */}
      <rect x="6" y="9.5" width="12" height="3" rx="1.2" />
      <rect x="6" y="13.5" width="12" height="3" rx="1.2" />

      {/* Base tray */}
      <rect x="4.5" y="17.5" width="15" height="2.5" rx="1.2" />

      {/* Oil drop */}
      <path
        d="M12 15.5c1.8 1.9 1.8 3.7 0 5.3-1.8-1.6-1.8-3.4 0-5.3z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M12 15.25v1.1" />

      {/* Feet */}
      <path d="M6 20h-2" />
      <path d="M20 20h-2" />
    </svg>
  );
}
