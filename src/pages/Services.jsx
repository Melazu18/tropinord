import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Natural Products & Organic Essentials",
    description:
      "High-quality natural oils, black soaps, and plant-based skincare — inspired by African and Pacific traditions, and aligned with modern health-conscious living.",
    image: "/images/service-oils.jpg",
    link: "/services/oils",
  },
  {
    title: "Agro Product Sourcing & Import Support",
    description:
      "Connecting eco-conscious businesses with natural raw materials and small-scale agro supplies — dried herbs, seeds, charcoal, tools and more.",
    image: "/images/service-agro.jpg",
    link: "/services/agro",
  },
  {
    title: "Youth Empowerment Through Sports & Education",
    description:
      "Organizing football programs, mentoring, and working with NGOs and schools — using sport and education as tools for growth.",
    image: "/images/service-sports.jpg",
    link: "/services/sports",
  },
  {
    title: "Workshops & Natural Living Events",
    description:
      "Sharing real-life knowledge through skincare and wellness workshops — from healthy oil use to understanding clean ingredients.",
    image: "/images/service-workshops.jpg",
    link: "/services/workshops",
  },
  {
    title: "Partnerships, Wholesale & Small Business Support",
    description:
      "We support local producers and wellness brands with product development, white-label supply, and marketing advice.",
    image: "/images/service-partnerships.jpg",
    link: "/services/partnerships",
  },
];

export default function Services() {
  return (
    <div className="relative p-6">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/leaves01.jpg')" }}
      ></div>
      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10 text-green-800"
        >
          What We Offer at TropiNord
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white bg-opacity-90"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-green-800">
                  {service.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {service.description}
                </p>
                <Link
                  to={service.link}
                  className="inline-block text-green-700 hover:text-green-900 font-medium"
                >
                  Learn more →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
