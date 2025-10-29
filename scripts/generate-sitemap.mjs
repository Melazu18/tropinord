import { writeFileSync, statSync } from "fs";

const base = "https://www.tropinord.se";
// List ONLY your canonical routes (no /home if / is canonical)
const routes = [
  "/",
  "/services",
  "/about",
  "/products",
  "/tea",
  "/offers",
  "/faq",
  "/contact",
];

function iso(date) {
  return new Date(date).toISOString();
}

const today = iso(Date.now());
const urls = routes
  .map((p) => {
    // Try to read the built file’s mtime later if you want; for now use today
    return `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml.trim() + "\n");
console.log("Sitemap written to public/sitemap.xml");
