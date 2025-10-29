// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationStatus from "../components/artisan/ApplicationStatus";
import ProductUpload from "../components/creator/ProductUpload";
import { productsAPI } from "../services/api";

const Dashboard = () => {
  // Load the dashboard namespace (and fall back to default if a key is missing)
  const { t } = useTranslation("dashboard");

  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMine = async () => {
    try {
      const { data } = await productsAPI.mine();
      // Backend returns { ok, items } (new); keep a fallback to { products } for safety
      setMine(data.items || data.products || []);
    } catch {
      // silent: same behavior as before
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMine();
  }, []);

  return (
    <div className="dashboard max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">
        {t("title", { defaultValue: "Dashboard" })}
      </h1>

      {/* Always show application status */}
      <ApplicationStatus />

      {/* Product uploader for approved users */}
      <ProductUpload onCreated={loadMine} />

      {/* My products */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">
          {t("myProducts", { defaultValue: "My Products" })}
        </h3>

        {loading ? (
          <p className="text-sm text-gray-600">
            {t("loading", { defaultValue: "Loading..." })}
          </p>
        ) : mine.length === 0 ? (
          <p className="text-sm text-gray-600">
            {t("noProductsYet", { defaultValue: "No products yet." })}
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-4">
            {mine.map((p) => (
              <li
                key={p.id}
                className="p-4 border rounded bg-white dark:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  {p.images?.[0] && (
                    <img
                      src={
                        typeof p.images[0] === "string"
                          ? p.images[0]
                          : p.images[0]?.url
                      }
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="text-sm text-gray-500">
                      {p.status} •{" "}
                      {p.auctionEnabled
                        ? t("auction", { defaultValue: "Auction" })
                        : t("fixed", { defaultValue: "Fixed" })}{" "}
                      {typeof p.price === "number"
                        ? `• ${(p.price / 100).toFixed(2)} SEK`
                        : ""}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
