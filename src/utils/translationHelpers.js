export const getTranslatedLabel = (product, category, t) => {
  if (category === "agro") {
    return t(`agro.items.${product.slug}.title`, {
      ns: "products",
      defaultValue: product.label,
    });
  }
  return t(`${product.id}.label`, {
    ns: "products",
    defaultValue: product.label,
  });
};

export const getTranslatedDescription = (product, category, t) => {
  if (category === "agro") {
    return t(`agro.items.${product.slug}.description`, {
      ns: "products",
      defaultValue: product.description || "",
    });
  }
  return t(`${product.id}.description`, {
    ns: "products",
    defaultValue: product.description || "",
  });
};
