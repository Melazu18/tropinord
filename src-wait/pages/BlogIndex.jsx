// src/pages/BlogIndex.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import posts from "../posts/posts.json";

export default function BlogIndex() {
  const [selectedTag, setSelectedTag] = useState(null);

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-yellow-500 mb-4">
        TropiNord Blog
      </h1>
      <p className="text-black dark:text-gray-300 mb-8 font-bold">
        Stories, inspiration, and knowledge from the heart of TropiNord's
        tropical and Nordic roots.
      </p>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm border ${
              !selectedTag
                ? "bg-green-700 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTag === tag
                  ? "bg-green-700 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Link
            to={`/blog/${post.slug}`}
            key={post.slug}
            className="block p-6 bg-white dark:bg-gray-800 shadow rounded-lg transition hover:shadow-md border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-1">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {new Date(post.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
              {post.excerpt || post.description || "Read more..."}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
