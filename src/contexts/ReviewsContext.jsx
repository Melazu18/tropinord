import React, { createContext, useContext, useEffect, useState } from "react";

const ReviewsContext = createContext();
const STORAGE_KEY = "tn_reviews_v1";

export function ReviewsProvider({ children }) {
  const [reviewsByProduct, setReviewsByProduct] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReviewsByProduct(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load reviews", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsByProduct));
    } catch (e) {
      console.error("Failed to save reviews", e);
    }
  }, [reviewsByProduct]);

  const addReview = (productId, review) => {
    setReviewsByProduct((prev) => {
      const existing = prev[productId] || [];
      const next = [
        {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...review,
        },
        ...existing,
      ];
      return { ...prev, [productId]: next };
    });
  };

  return (
    <ReviewsContext.Provider value={{ reviewsByProduct, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export const useReviews = () => useContext(ReviewsContext);
