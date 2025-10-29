import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import productImages from "../data/productImages";

const ProductListByCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const grouped = productImages[category];

  if (!grouped) {
    return (
      <main className="pt-32">
        <div className="p-6 text-center text-red-600">
          <h2 className="text-2xl font-semibold mb-4">Category Not Found</h2>
          <button
            onClick={() => navigate("/explore")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Back to Explore
          </button>
        </div>
      </main>
    );
  }

  // Flatten subgroups (e.g. Hair, Skin, etc.)
  const allProducts = Object.values(grouped).flat();

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center capitalize">
        {category} Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allProducts.map(({ label, image, price, slug }) => (
          <div
            key={label}
            className="border p-4 rounded-lg shadow bg-white text-center dark:bg-gray-800"
          >
            <Link to={`/products/detail/${slug}`}>
              <img
                src={image}
                alt={label}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h3 className="text-lg font-semibold mb-1 text-black dark:text-white">
                {label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Price: €{price.toFixed(2)}
              </p>
            </Link>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
              onClick={() =>
                navigate("/order", {
                  state: {
                    preselect: {
                      label,
                      quantity: 1,
                    },
                  },
                })
              }
            >
              Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListByCategory;
