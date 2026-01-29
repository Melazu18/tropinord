// src/shared/ui/FilterControls.jsx
import React from "react";

export default function FilterControls({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {items.map(({ label, value, onChange, options, key }) => (
        <div className="flex items-center gap-2" key={key || label}>
          <label className="text-sm text-slate-800 dark:text-slate-200">
            {label}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="
              px-3 py-2 rounded border
              bg-white text-slate-900 border-slate-300
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
              dark:bg-gray-800 dark:text-slate-100 dark:border-gray-700
            "
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
