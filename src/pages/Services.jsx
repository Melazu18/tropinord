import React from "react";

const services = [
  {
    title: "Organic & Essential Oils",
    description:
      "Pure oils like coconut, almond, avocado, neem, and frankincense — sustainably sourced for wellness and beauty.",
    image: "https://via.placeholder.com/300x180?text=Oils",
    link: "#",
  },
  {
    title: "Natural Soaps",
    description:
      "Traditional black soap, shea butter bars, and apple peel soap rooted in African heritage and made with care.",
    image: "https://via.placeholder.com/300x180?text=Soaps",
    link: "#",
  },
  {
    title: "Agro & Eco Imports",
    description:
      "Banana leaves, plant stems, natural charcoal, bones, and small farm machines supporting eco-farming.",
    image: "https://via.placeholder.com/300x180?text=Agro+Imports",
    link: "#",
  },
];

export default function Services() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-10">
        Our Products & Services
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <a
                href={service.link}
                className="inline-block text-blue-600 hover:underline"
              >
                Learn more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
