import React from "react";
import { useNavigate } from "react-router-dom";
import productImages from "../data/productImages";

const ProductList = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Explore Our Products
      </h1>

      {Object.entries(productImages).map(([groupName, items]) => (
        <div key={groupName} className="mb-10">
          <h2 className="text-2xl font-semibold text-amber-600 mb-4 capitalize">
            {groupName}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(({ label, image, price }) => (
              <div
                key={label}
                className="border p-4 rounded-lg shadow bg-white flex flex-col items-center text-center"
              >
                <img
                  src={image}
                  alt={label}
                  className="w-full h-40 object-cover mb-3 rounded"
                />
                <h3 className="text-lg font-semibold mb-1 text-black">
                  {label}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Price: €{price.toFixed(2)}
                </p>

                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() =>
                    navigate("/order", {
                      state: {
                        preselect: {
                          label: label,
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
      ))}
    </div>
  );
};

export default ProductList;
