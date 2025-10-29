// src/components/auth/UserBadge.jsx
import React from "react";
import { displayName, avatarUrl } from "../../utils/userDisplay";

export default function UserBadge({ user, onClick }) {
  if (!user) return null;

  const name = displayName(user);
  const img = avatarUrl(user, 96);
  const isAdmin = user.role === "ADMIN";

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1 px-2 py-1 rounded hover:bg-white/5 focus:outline-none"
      aria-label="Account menu"
    >
      <img
        src={img}
        alt={name}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
        loading="eager"
        decoding="async"
      />
      <span className="mt-0.5 text-[11px] leading-none text-gray-100 group-hover:text-white truncate max-w-[84px]">
        {name}
      </span>
      {isAdmin && (
        <span className="mt-0.5 text-[10px] leading-none px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
          ADMIN
        </span>
      )}
    </button>
  );
}
