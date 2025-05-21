import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import { useTranslation } from "react-i18next";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          {t("products.notFound")}
        </h2>
        <button
          onClick={() => navigate("/explore")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {t("explore.title")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Image Gallery */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {(product.gallery || [product.image]).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${t(`products.${slug}.name`)} ${index + 1}`}
            className="w-full h-64 object-cover rounded"
          />
        ))}
      </div>

      {/* Product Name & Description */}
      <h2 className="text-3xl font-bold mb-4">{t(`products.${slug}.name`)}</h2>
      <p className="text-lg text-gray-700 mb-6">
        {t(`products.${slug}.description`)}
      </p>

      {/* External Link */}
      {product.link && (
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition mr-4"
        >
          {t("products.shopNow")}
        </a>
      )}

      {/* Contact Button */}
      <button
        onClick={() => navigate("/contact")}
        className="bg-gray-100 text-green-700 px-6 py-2 rounded border border-green-600 hover:bg-green-50 transition"
      >
        {t("contact.title")}
      </button>
    </div>
  );
}
