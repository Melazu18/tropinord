// src/utils/priceDisplay.js

/**
 * Safely get the "base" price (in SEK by default):
 * - For catalog items: use product.prices.SEK if > 0
 * - For DB products:   use product.price (Decimal/string/number) if > 0
 */
export function basePrice(product, baseCurrency = "SEK") {
  if (!product) return 0;

  // 1) Catalog-style pricing: prices.{currency}
  if (
    product.prices &&
    typeof product.prices[baseCurrency] === "number" &&
    product.prices[baseCurrency] > 0
  ) {
    return product.prices[baseCurrency];
  }

  // 2) DB-style pricing: price as number/Decimal/string
  const raw = product.price ?? product.basePrice;
  const n =
    typeof raw === "string"
      ? Number(raw)
      : typeof raw === "number"
      ? raw
      : Number(raw); // handles Prisma Decimal

  if (Number.isFinite(n) && n > 0) return n;

  return 0;
}

/**
 * Decide which price to show:
 * - For now: if there's a valid salePrice < original and sale not expired, show it.
 * - Otherwise: just show the base price.
 */
export function priceToDisplay(product) {
  const original = basePrice(product, "SEK");

  let sale = null;

  if (product && product.salePrice != null) {
    const rawSale =
      typeof product.salePrice === "string"
        ? Number(product.salePrice)
        : product.salePrice;
    if (Number.isFinite(rawSale) && rawSale > 0 && rawSale < original) {
      if (product.saleEndsAt) {
        const end = new Date(product.saleEndsAt);
        if (!Number.isNaN(end.getTime()) && end > new Date()) {
          sale = rawSale;
        }
      } else {
        sale = rawSale;
      }
    }
  }

  if (sale != null) {
    return {
      showSale: true,
      current: sale,
      original: original || sale,
    };
  }

  // No sale: just use original
  return {
    showSale: false,
    current: original,
    original,
  };
}
