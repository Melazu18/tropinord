// src/pages/ProductDetailRouter.jsx
import React from "react";
import { useParams } from "react-router-dom";
import productImages from "../data/productImages";
import ProductDetail from "./ProductDetail";

export default function ProductDetailRouter() {
  const { slug } = useParams();

  // Search all products
  let isAgro = false;
  let found = false;

  for (const category in productImages) {
    for (const subcat in productImages[category]) {
      const foundProduct = productImages[category][subcat].find(
        (p) => p.slug === slug
      );
      if (foundProduct) {
        found = true;
        isAgro = category === "agro";
        break;
      }
    }
    if (found) break;
  }

  return isAgro ? <AgroProductDetail /> : <ProductDetail />;
}
