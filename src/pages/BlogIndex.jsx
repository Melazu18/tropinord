// src/pages/BlogIndex.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import posts from "../posts/posts.json";

export default function BlogIndex() {
  const [selectedTag, setSelectedTag] = useState(null);
  const { t } = useTranslation(["blog", "blogPosts"]);
  const location = useLocation();
  const currentLang = location.pathname.split("/")[1] || "en";

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  return (
    <main className="pt-32">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">
          {t("blog.heading", { defaultValue: "TropiNord Blog" })}
        </h1>
        <p className="text-black dark:text-gray-300 mb-8 font-bold">
          {t("blog.intro", {
            defaultValue:
              "Stories, inspiration, and knowledge from the heart of TropiNord's tropical and Nordic roots.",
          })}
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
              {t("blog.all", { defaultValue: "All" })}
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
              to={`/${currentLang}/${currentLang === "sv" ? "blogg" : "blog"}/${
                post.slug
              }`}
              key={post.slug}
              className="block p-6 bg-white dark:bg-gray-800 shadow rounded-lg transition hover:shadow-md border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-1">
                {t(`${post.slug}.title`, {
                  ns: "blogPosts",
                  defaultValue: post.title || "Untitled Post",
                })}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {post.date
                  ? new Date(post.date).toLocaleDateString()
                  : t("blog.unknownDate", { defaultValue: "Unknown date" })}
              </p>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {t(`${post.slug}.excerpt`, {
                  ns: "blogPosts",
                  defaultValue:
                    post.excerpt ||
                    post.description ||
                    t("blog.readMore", { defaultValue: "Read more..." }),
                })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
