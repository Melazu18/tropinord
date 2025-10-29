// scripts/generatePosts.js
import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";

const postsDir = path.resolve("src/posts");
const outputFile = path.resolve("src/posts/posts.json");

async function generatePosts() {
  try {
    const files = fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith(".mdx"));
    const posts = files.map((file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const { data } = matter(content);

      return {
        title: data.title || "Untitled",
        slug: data.slug || file.replace(/\.mdx$/, ""),
        date: data.date || null,
        excerpt: data.excerpt || "",
      };
    });

    const sortedPosts = posts.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
    console.log(`✅ Blog post metadata written to ${outputFile}`);
  } catch (err) {
    console.error("❌ Error generating blog post metadata:", err);
    process.exit(1);
  }
}

generatePosts();
