// /api/teaCatalog.cjs  (Vercel Serverless Function - CommonJS)
const teaCatalog = require("../lib/teaCatalogData.js"); // your existing CJS data file

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json(teaCatalog);
};
