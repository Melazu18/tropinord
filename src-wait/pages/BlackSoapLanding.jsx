import React from "react";
import { Link } from "react-router-dom";
import AddToCartCTA from "../components/AddToCartCTA";

const blackSoapProducts = [
  {
    id: "black-soap",
    name: "African Black Soap (100g)",
    description:
      "Traditional handcrafted bar for face & body, ideal for daily cleansing and sensitive skin.",
    price: 59,
    image: "/images/blog/blacksoap01.jpg",
  },
  {
    id: "black-soap-original",
    name: "Black Soap Original (100g)",
    description:
      "Classic recipe with intense cleansing power, loved for its exfoliating properties.",
    price: 59,
    image: "/images/blog/BlackSoapOriginal01.png",
  },
  {
    id: "black-soap-liquid",
    name: "Liquid African Black Soap (250ml)",
    description:
      "Perfect for handwashing and body care during winter. Antibacterial and hydrating.",
    price: 69,
    image: "/images/blog/LiquidSoap01.png",
  },
];

export default function BlackSoapLanding() {
  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto prose dark:prose-invert">
      <h1 className="text-4xl font-bold text-green-800 dark:text-green-300 mb-2">
        🌿 African Black Soap Collection
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
        Discover our range of authentic African Black Soaps — hand-crafted using
        natural ingredients, ideal for cleansing, exfoliating, and protecting
        skin year-round.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {blackSoapProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-md p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="rounded-lg w-full object-cover mb-4 h-48"
            />
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {product.description}
            </p>
            <p className="font-bold text-green-800 dark:text-green-200 mb-4">
              kr{product.price}
            </p>

            <AddToCartCTA
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 bg-green-100 dark:bg-green-900 p-4 rounded-xl border border-green-300 dark:border-green-700">
        <p className="font-medium text-green-900 dark:text-green-100 text-sm">
          🌱 TropiNord supports permanent carbon removal. 0.5% of every order
          funds climate solutions.
        </p>
        <blockquote className="italic text-green-700 dark:text-green-300 mt-2">
          “Shop naturally, give back globally — every TropiNord order helps
          remove CO₂ from the atmosphere.”
        </blockquote>
      </div>

      <div className="mt-8">
        <Link
          to="/blog/african-black-soap"
          className="inline-block mt-4 text-green-700 dark:text-green-400 hover:underline"
        >
          Read more about African Black Soap →
        </Link>
      </div>
    </main>
  );
}
