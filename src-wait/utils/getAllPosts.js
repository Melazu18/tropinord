import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.resolve("src/posts");

export default async function getAllPosts() {
  const files = fs.readdirSync(postsDir);
  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const { data } = matter(content);
      return {
        ...data,
        slug: data.slug || file.replace(/\.mdx$/, ""),
      };
    })
  );

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  const rawContent = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(rawContent);

  const { compile } = await import("@mdx-js/mdx");
  const { default: React } = await import("react");
  const { run } = await import("@mdx-js/mdx");

  const compiled = await compile(content, { outputFormat: "function-body" });
  const { default: Content } = await run(compiled, {
    jsx: React.createElement,
  });

  return { meta: data, content: Content };
}
