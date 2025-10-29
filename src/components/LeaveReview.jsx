import React, { useState } from "react";
import { Star, Smile, ImageIcon, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LeaveReview({ productId, orderId, email }) {
  const { t } = useTranslation("review");

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tags, setTags] = useState([]);
  const tagOptions = [
    t("tags.fastShipping", "Fast shipping"),
    t("tags.nicePackaging", "Nice packaging"),
    t("tags.worthPrice", "Worth the price"),
  ];

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: send to backend
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {t("title", "⭐ Leave a Review")}
      </h2>

      {submitted ? (
        <motion.div
          className="text-center text-green-600 flex flex-col items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
          <p className="text-lg font-semibold">
            {t("thankYou", "Thanks for your review!")}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                onClick={() => setRating(i)}
                className={`w-8 h-8 cursor-pointer ${
                  i <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {tagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  tags.includes(tag)
                    ? "bg-green-200 text-green-800 border-green-400"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t(
              "placeholder",
              "Tell us what you loved (or didn’t)..."
            )}
            className="w-full p-3 rounded-md border dark:bg-gray-800 dark:text-white"
            required
          />

          {/* Image Upload */}
          <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer">
            <ImageIcon className="w-5 h-5" />
            {t("uploadPhoto", "Upload Photo")}
            <input type="file" className="hidden" />
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {t("submit", "Submit Review")}
          </button>
        </form>
      )}
    </div>
  );
}
