// src/pages/CoffeeProductDetail.jsx
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import coffeeCatalog from "../shared/coffeeCatalogData";
import { useCart } from "../contexts/CartContext";
import ProductImageCarousel from "../components/ProductImageCarousel";
import PriceTag from "../components/PriceTag";
import LikeButton from "../components/LikeButton";
import ProductReviews from "../components/ProductReviews";
import BackButton from "../components/BackButton";
import { nameT, descT } from "../utils/i18nProductHelpers";

export default function CoffeeProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation(["coffee", "common", "buttons"]);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const product = useMemo(() => {
    return (
      coffeeCatalog?.[slug] ||
      Object.values(coffeeCatalog || {}).find((x) => x.slug === slug) ||
      null
    );
  }, [slug]);

  if (!product) {
    return (
      <main className="pt-24 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-red-600">
          {t("products.notFound", { ns: "common", defaultValue: "Product not found" })}
        </div>
      </main>
    );
  }

  const basePrice = product.prices?.SEK ?? product.price ?? 0;

  const add = () => {
    addToCart({
      id: product.id,
      label: product.name,
      image: product.image,
      price: basePrice,
      quantity: qty,
    });
  };

  return (
    <main className="pt-24 px-4 py-10 max-w-5xl mx-auto">
      <div className="mb-4">
        <BackButton fallbackRouteKey="coffee" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ProductImageCarousel
            images={product.images || [product.image || "/images/placeholder.jpg"]}
            alt={product.name}
            className="h-80"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold">
              {nameT(t, "products.coffee", product.id, product.name)}
            </h1>
            <LikeButton productId={product.id} size="md" />
          </div>

          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {descT(t, "products.coffee", product.id, product.description)}
          </p>

          <div className="mt-4">
            <PriceTag product={{ ...product, price: basePrice, prices: product.prices }} />
          </div>

          {(product.originCountry ||
            product.productionYear ||
            product.bestBefore ||
            product.naturallyGrown) && (
            <div className="mt-4 text-sm space-y-2">
              <div className="font-semibold">
                {t("modal.detailsHeading", { defaultValue: "Coffee details" })}
              </div>

              {product.originCountry && (
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("modal.originLabel", {
                      defaultValue: "Origin (country of production)",
                    })}
                  </span>
                  <span className="font-medium">{product.originCountry}</span>
                </div>
              )}

              {product.productionYear && (
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("modal.productionYearLabel", { defaultValue: "Roast year" })}
                  </span>
                  <span className="font-medium">{product.productionYear}</span>
                </div>
              )}

              {product.bestBefore && (
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("modal.bestBeforeLabel", { defaultValue: "Best before" })}
                  </span>
                  <span className="font-medium">{product.bestBefore}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 p-2 border rounded text-center dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              onClick={add}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {t("addToCart", { ns: "buttons", defaultValue: "Add to Cart" })}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold">
          {t("detail.reviews", { ns: "coffee", defaultValue: "Reviews" })}
        </h2>
        <ProductReviews productId={product.id} />
      </section>
    </main>
  );
}
