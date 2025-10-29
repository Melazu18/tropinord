// server/api/teaCatalog.js
const express = require("express");
const router = express.Router();
const teaCatalogData = require("../../lib/teaCatalogData"); // ✅ CommonJS is fine here

router.get("/teas", (req, res) => {
  res.json(teaCatalogData);
});

module.exports = router;
