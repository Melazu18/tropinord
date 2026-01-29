import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "tn_wishlist_v1";

export function WishlistProvider({ children }) {
  const [likedIds, setLikedIds] = useState([]);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setLikedIds(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load wishlist", e);
    }
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [likedIds]);

  const toggleLike = (productId) => {
    setLikedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isLiked = (productId) => likedIds.includes(productId);

  return (
    <WishlistContext.Provider value={{ likedIds, toggleLike, isLiked }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
