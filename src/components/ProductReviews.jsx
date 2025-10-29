import React, { useEffect, useState } from "react";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        setReviews(data.results || []);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet for this product.</p>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">🗣 Customer Reviews</h3>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border p-4 rounded shadow bg-white">
            <div className="flex items-center mb-2 gap-1">
              <span className="text-yellow-400 font-bold">
                {"★".repeat(review.rating)}
              </span>
              <span className="text-gray-400 text-sm ml-2">
                ({review.createdAt?.slice(0, 10)})
              </span>
            </div>
            <p className="text-gray-800 mb-2">{review.text}</p>
            {review.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs text-green-700">
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-100 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
