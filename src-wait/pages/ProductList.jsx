import React from "react";
import { useNavigate } from "react-router-dom";
import productImages from "../data/productImages";
import { Link } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();

  const handleOrder = (label) => {
    navigate("/order", {
      state: {
        preselect: {
          label: label || "Product",
          quantity: 1,
        },
      },
    });

    // Optionally redirect to cart after order
    // setTimeout(() => navigate("/cart"), 1000);
  };

  const whatsappUrl = (label) =>
    `https://wa.me/2349012345678?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(
      label
    )}%20from%20your%20agro%20products`;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Explore Our Products
      </h1>

      {Object.entries(productImages).map(([groupName, subcategories]) => (
        <div key={groupName} className="mb-10">
          <h2 className="text-2xl font-semibold text-amber-600 mb-4 capitalize">
            {groupName}
          </h2>

          {Object.entries(subcategories).map(([subName, items]) => (
            <div key={`${groupName}-${subName}`} className="mb-6">
              <h3 className="text-xl font-semibold text-green-700 mb-2 capitalize">
                {subName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(({ label, image, price }, index) => (
                  <div
                    key={`${groupName}-${subName}-${label ?? `item-${index}`}`}
                    className="border p-4 rounded-lg shadow bg-white flex flex-col items-center text-center"
                  >
                    <img
                      src={image}
                      alt={label || "Unnamed Product"}
                      className="w-full h-40 object-cover mb-3 rounded"
                    />
                    <h3 className="text-lg font-semibold mb-1 text-black">
                      {label || "Unnamed Product"}
                    </h3>

                    {price !== undefined ? (
                      <p className="text-sm text-gray-600 mb-2">
                        Price: €{price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic mb-2">
                        Contact for pricing
                      </p>
                    )}

                    {groupName === "agro" && price === undefined ? (
                      <a
                        href={whatsappUrl(label)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Contact via WhatsApp
                      </a>
                    ) : (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => handleOrder(label)}
                      >
                        Order Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
