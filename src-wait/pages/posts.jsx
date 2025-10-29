// src/pages/Post.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import posts from "../blog/posts.json";

export default function Post() {
  const { slug } = useParams();
  const [MDXContent, setMDXContent] = React.useState(null);

  React.useEffect(() => {
    import(`../blog/posts/${slug}.mdx`)
      .then((mod) => setMDXContent(() => mod.default))
      .catch(() => setMDXContent(null));
  }, [slug]);

  const post = posts.find((p) => p.slug === slug);
  if (!post) return <div className="text-red-500">Post not found</div>;

  return (
    <article className="prose dark:prose-invert max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
        {post.title}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date(post.date).toLocaleDateString()}
      </p>
      {MDXContent ? (
        <MDXProvider>
          <MDXContent />
        </MDXProvider>
      ) : (
        <p>Loading content...</p>
      )}
    </article>
  );
}
