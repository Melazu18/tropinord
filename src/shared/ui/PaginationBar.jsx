// src/shared/ui/PaginationBar.jsx
import React from "react";

export default function PaginationBar({ page, setPage, total, pageSize = 9 }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const go = (p) => setPage(Math.min(totalPages, Math.max(1, p)));

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        className="px-3 py-1 rounded border dark:border-gray-700"
        onClick={() => go(page - 1)}
      >
        ‹ Prev
      </button>
      {pages.map((p, idx) => (
        <button
          key={`${p}-${idx}`}
          className={`px-3 py-1 rounded border dark:border-gray-700 ${
            p === page ? "bg-green-600 text-white" : ""
          }`}
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border dark:border-gray-700"
        onClick={() => go(page + 1)}
      >
        Next ›
      </button>
    </div>
  );
}
