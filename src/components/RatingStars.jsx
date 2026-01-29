//src/components/RatingStars.jsx
import React from "react";

export default function RatingStars({
  value = 0,
  onChange,
  size = "md",
  readOnly = false,
}) {
  const stars = [1, 2, 3, 4, 5];
  const cls =
    size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={`inline-flex items-center gap-1 ${cls}`}>
      {stars.map((s) => {
        const filled = s <= value;
        return (
          <button
            key={s}
            type="button"
            onClick={readOnly || !onChange ? undefined : () => onChange(s)}
            className={readOnly ? "cursor-default" : "cursor-pointer"}
            aria-label={!readOnly ? `Rate ${s} stars` : undefined}
          >
            <span className={filled ? "text-yellow-400" : "text-slate-300"}>
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
}
