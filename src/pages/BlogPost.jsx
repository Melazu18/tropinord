// src/pages/BlogPost.jsx
import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import mdxPosts from "../posts/posts";
import postMeta from "../posts/posts.json";
import calculateReadingTime from "../utils/calculateReadingTime";

export default function BlogPost() {
  const { slug } = useParams();
  const location = useLocation();
  const currentLang = location.pathname.split("/")[1] || "en";
  const { t, i18n } = useTranslation("blogPosts");

  const PostComponent = mdxPosts[slug];
  const meta = postMeta.find((p) => p.slug === slug);

  if (!PostComponent) {
    return <p className="text-center text-red-600 mt-20">Post not found</p>;
  }

  const estimatedTime = meta?.content
    ? calculateReadingTime(meta.content)
    : meta?.excerpt?.split(" ").length > 80
    ? "~4 min"
    : "~2 min";

  const related = postMeta
    .filter(
      (p) => p.slug !== slug && p.tags?.some((tag) => meta?.tags?.includes(tag))
    )
    .slice(0, 3);

  const blogKey = slug;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <article className="prose dark:prose-invert lg:prose-lg">
        {meta && (
          <>
            <h1>{t(`${blogKey}.title`, { defaultValue: meta.title })}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(meta.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              • {estimatedTime} read
            </p>
            {meta.author && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                By {meta.author}
              </p>
            )}
            {meta.image && (
              <img
                src={meta.image}
                alt={meta.title}
                className="my-4 rounded-xl w-full max-w-3xl mx-auto"
              />
            )}
            {meta.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-700 dark:text-gray-300 text-base mt-4">
              {t(`${blogKey}.description`, {
                defaultValue: meta.description || meta.excerpt,
              })}
            </p>
          </>
        )}
        <PostComponent />
      </article>

      {related.length > 0 && (
        <aside className="mt-16 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
            {t("relatedPosts", { defaultValue: "Related Posts" })}
          </h2>
          <ul className="space-y-2">
            {related.map((post) => (
              <li key={post.slug}>
                <Link
                  to={`/${currentLang}/${
                    currentLang === "sv" ? "blogg" : "blog"
                  }/${post.slug}`}
                  className="text-green-700 dark:text-green-400 hover:underline"
                >
                  {t(`${post.slug}.title`, { defaultValue: post.title })}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
