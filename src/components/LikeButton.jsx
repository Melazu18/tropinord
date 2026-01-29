import React from "react";
import { useWishlist } from "../contexts/WishlistContext";

export default function LikeButton({ productId, size = "md" }) {
  const { isLiked, toggleLike } = useWishlist();
  const liked = isLiked(productId);

  const base = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <button
      type="button"
      onClick={() => toggleLike(productId)}
      className={`inline-flex items-center justify-center ${base} transition-transform hover:scale-110`}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={liked ? "text-red-500" : "text-slate-400"}>
        {liked ? "❤️" : "🤍"}
      </span>
    </button>
  );
}
