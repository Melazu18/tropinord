// utils/flattenProductData.js

import productImages from "../data/productImages";

// Utility to slugify a label (for backward support)
const generateSlug = (label) =>
  label
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export const flattenProductData = (data = productImages) => {
  const result = [];

  Object.entries(data).forEach(([category, subgroups]) => {
    Object.entries(subgroups).forEach(([subgroup, products]) => {
      products.forEach((product) => {
        result.push({
          ...product,
          category,
          subgroup,
          slug: product.slug || generateSlug(product.label),
          name: product.label, // for use in ProductDetail.jsx
          src: product.image,
        });
      });
    });
  });

  return result;
};
