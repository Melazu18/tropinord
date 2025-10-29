import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function TeaProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();

  const [teaCatalog, setTeaCatalog] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teaCatalog")
      .then((res) => res.json())
      .then((data) => {
        setTeaCatalog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tea catalog:", err);
        setLoading(false);
      });
  }, []);

  const tea = Object.values(teaCatalog).find(
    (item) => item.slug === slug || item.id === slug
  );

  if (loading) return <div className="p-6">Loading...</div>;
  if (!tea) {
    return (
      <div className="p-6 text-red-600">
        {t("product.notFound", { defaultValue: "Tea not found." })}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={tea.image}
        alt={tea.name}
        className="w-full h-64 object-cover rounded mb-6 shadow"
      />
      <h1 className="text-3xl font-bold mb-2 text-green-800">{tea.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{tea.description}</p>
      <p className="text-lg font-semibold text-green-700 mb-6">
        {tea.prices?.SEK} SEK
      </p>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          {t("product.historyTitle", {
            defaultValue: "Tea Origins & Benefits",
          })}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {tea.story ||
            t("product.defaultStory", {
              defaultValue:
                "This tea blend is cherished for its traditional wellness uses and unique taste.",
            })}
        </p>
      </div>
    </div>
  );
}
