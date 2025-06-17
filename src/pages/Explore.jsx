import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import products from "../data/products";
import { Link } from "react-router-dom";

export default function Explore() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in-up">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-green-800 drop-shadow mb-4">
          {t("explore.title")}
        </h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("explore.searchPlaceholder")}
          className="mt-2 px-5 py-3 rounded-lg w-full sm:w-1/2 border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 dark:text-gray-900 bg-white dark:bg-gray-100"
        />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.slug}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  {t(`products.${product.slug}.name`)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {t(`products.${product.slug}.description`)}
                </p>
                <ul className="mt-4 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {product.features?.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              <Link
                to={`/products/${product.slug}`}
                className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2 rounded-md text-center"
              >
                {t("products.shopNow")}
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-black-500">
            {t("products.notFound")}
          </p>
        )}
      </section>
    </div>
  );
}
