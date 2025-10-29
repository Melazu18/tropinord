import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import productImages from "../data/productImages";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import AgroContactForm from "../components/AgroContactForm";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  let foundProduct = null;
  let isAgro = false;

  // 🔍 Search across all product categories and detect if Agro
  for (const cat in productImages) {
    for (const sub in productImages[cat]) {
      const product = productImages[cat][sub].find((p) => p.slug === slug);
      if (product) {
        foundProduct = product;
        if (cat === "agro") isAgro = true;
        break;
      }
    }
    if (foundProduct) break;
  }

  if (!foundProduct) {
    return (
      <div className="text-center text-red-600 mt-20">
        {t("product.notFound", "Product not found")}
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...foundProduct, quantity: Number(quantity) });
    toast.success(t("order.addedToCart", "Added to cart!"));
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const titleKey = isAgro
    ? `agro.items.${foundProduct.slug}.title`
    : `${foundProduct.id}.label`;

  const descKey = isAgro
    ? `agro.items.${foundProduct.slug}.description`
    : `${foundProduct.id}.description`;

  const displayPrice = isAgro
    ? t("product.contactForPricing", "Contact for pricing")
    : `${foundProduct.price.toFixed(2)} SEK`;

  return (
    <main className="pt-36">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={foundProduct.image}
            alt={foundProduct.label}
            className="w-full md:w-1/2 rounded shadow"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              {t(titleKey, {
                ns: "products",
                defaultValue: foundProduct.label,
              })}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t(descKey, {
                ns: "products",
                defaultValue:
                  foundProduct.description ||
                  t(
                    "product.noDescription",
                    "No detailed description available."
                  ),
              })}
            </p>

            <p className="text-lg text-green-600 font-semibold mb-2">
              {t("price", { ns: "product", defaultValue: "Price" })}:{" "}
              {displayPrice}
            </p>

            {/* Only show quantity and add-to-cart for non-agro */}
            {!isAgro ? (
              <>
                <div className="flex items-center gap-4 mt-4">
                  <label htmlFor="qty" className="text-sm font-medium">
                    {t("quantity", { ns: "order", defaultValue: "Quantity" })}
                  </label>
                  <input
                    id="qty"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border rounded px-2 py-1 w-20 text-center bg-white text-black"
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {t("order.addToCart", "Add to Cart")}
                </button>

                {added && (
                  <p className="mt-4 text-green-600">
                    ✅ {t("order.addedToCart", "Added to Cart")}
                  </p>
                )}
              </>
            ) : (
              <div className="mt-8">
                <AgroContactForm product={foundProduct} />
              </div>
            )}

            <button
              onClick={() => navigate("/products")}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {t("buttons:backToProducts", "Back to Products")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
