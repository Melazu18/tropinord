import React, { useEffect, useState } from "react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews?status=pending");
      const data = await res.json();
      setReviews(data.results || []);
    } catch (err) {
      setError("Failed to fetch reviews.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModeration = async (id, action) => {
    try {
      await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, passcode: ADMIN_PASS }),
      });
      fetchReviews();
    } catch (err) {
      console.error(`Failed to ${action} review:`, err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    try {
      await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, passcode: ADMIN_PASS }),
      });
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err.message);
    }
  };

  if (loading) return <div className="p-6">Loading reviews...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠️ Moderate Reviews</h1>

      {reviews.length === 0 ? (
        <p>No pending reviews.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="p-4 rounded border shadow-sm bg-white dark:bg-gray-800"
            >
              <p className="text-sm text-gray-500 mb-1">
                {review.productId} | {review.email} | ⭐ {review.rating}
              </p>
              <p className="mb-2">{review.text}</p>
              {review.tags?.length > 0 && (
                <p className="text-xs text-gray-400 mb-2">
                  Tags: {review.tags.join(", ")}
                </p>
              )}
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => handleModeration(review.id, "approve")}
                  className="text-green-600 hover:underline"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleModeration(review.id, "reject")}
                  className="text-yellow-600 hover:underline"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
