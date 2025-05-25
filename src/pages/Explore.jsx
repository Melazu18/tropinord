import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import products from "../data/products";
import { motion } from "framer-motion";

function Explore() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const filtered = products.filter((product) =>
    t(`products.${product.slug}.name`)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6 text-center text-green-800"
      >
        {t("explore.title")}
      </motion.h2>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder={t("explore.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <motion.div
            key={product.slug}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate(`/products/${product.slug}`)}
          >
            <img
              src={product.image}
              alt={t(`products.${product.slug}.name`)}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">
                {t(`products.${product.slug}.name`)}
              </h3>
              <p className="text-sm text-gray-600">
                {t(`products.${product.slug}.description`)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
