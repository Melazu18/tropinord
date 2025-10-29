// src/shared/ui/FilterControls.jsx
import React from "react";

export default function FilterControls({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {items.map(({ label, value, onChange, options, key }) => (
        <div className="flex items-center gap-2" key={key || label}>
          <label className="text-sm text-gray-800 dark:text-gray-200">
            {label}
          </label>
          <select
            className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700"
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
