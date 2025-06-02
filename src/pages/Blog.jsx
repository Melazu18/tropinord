import React from "react";
import { Helmet } from "react-helmet";

export default function Blog() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Helmet>
        <title>Blog | TropiNord</title>
        <meta
          name="description"
          content="TropiNord blog - stories, tips and traditions in organic wellness and eco imports."
        />
      </Helmet>

      <h1 className="text-4xl font-bold text-green-700 mb-6">TropiNord Blog</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-12">
        Stories, inspiration, and knowledge from the heart of TropiNord’s
        tropical and Nordic roots.
      </p>

      {/* Placeholder Posts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
            How African Black Soap is Made
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Discover the age-old process and cultural heritage behind this
            natural soap.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
            Why Cold-Pressed Oils Matter
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            A breakdown of why purity and technique shape the power of natural
            oils.
          </p>
        </div>
      </div>
    </div>
  );
}
