import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReviews } from "../contexts/ReviewsContext";
import RatingStars from "./RatingStars";

/**
 * Mood keys (stable, language-agnostic)
 */
const MOODS = [
  "morningEnergy",
  "eveningWindDown",
  "afterWorkout",
  "withFriends",
  "focusStudy",
];

export default function ProductReviews({ productId }) {
  const { t } = useTranslation(["common", "teas"]);
  const { reviewsByProduct, addReview } = useReviews();
  const reviews = reviewsByProduct[productId] || [];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [mood, setMood] = useState("");
  const [tip, setTip] = useState("");

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    addReview(productId, {
      rating,
      comment: comment.trim(),
      mood: mood || null,
      tip: tip.trim() || null,
    });

    setComment("");
    setMood("");
    setTip("");
    setRating(5);
  };

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
          {t("detail.reviews", { defaultValue: "Reviews" })}
        </h3>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <RatingStars value={Number(avgRating)} readOnly size="sm" />
            <span>
              {avgRating} · {reviews.length}{" "}
              {t("review", {
                count: reviews.length,
                defaultValue: "review",
              })}
            </span>
          </div>
        )}
      </div>

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="mb-4 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/60 dark:bg-slate-900/40"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            {t("yourRating", { defaultValue: "Your rating" })}
          </span>
          <RatingStars value={rating} onChange={setRating} />
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder={t("reviewPlaceholder", {
            defaultValue: "How does it taste? How do you use it?",
          })}
          className="w-full text-sm px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 mb-2"
        />

        <div className="flex flex-wrap gap-2 mb-2">
          {MOODS.map((m) => {
            const active = mood === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMood(active ? "" : m)}
                className={`text-xs px-2 py-1 rounded-full border ${
                  active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                }`}
              >
                {t(`moods.${m}`, { defaultValue: m })}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder={t("reviewTipPlaceholder", {
            defaultValue: "Optional: your brew/use tip",
          })}
          className="w-full text-sm px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 mb-2"
        />

        <button
          type="submit"
          className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          disabled={!comment.trim()}
        >
          {t("submit", { defaultValue: "Submit" })}
        </button>
      </form>

      {/* list */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("noReviews", {
              defaultValue:
                "No reviews yet — be the first to share your experience.",
            })}
          </p>
        ) : (
          reviews.map((r) => (
            <article
              key={r.id}
              className="text-sm border-b border-slate-200 dark:border-slate-800 pb-2"
            >
              <div className="flex items-center justify-between mb-1">
                <RatingStars value={r.rating} readOnly size="sm" />
                <span className="text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              {r.mood && (
                <span className="inline-block text-[11px] mb-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {t(`moods.${r.mood}`, { defaultValue: r.mood })}
                </span>
              )}

              <p className="text-slate-700 dark:text-slate-200 mb-1">
                {r.comment}
              </p>

              {r.tip && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  {t("tipLabel", { defaultValue: "Tip:" })} {r.tip}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
