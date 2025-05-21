import React from "react";

export default function About() {
  return (
    <div className="relative min-h-screen text-gray-800 dark:text-gray-100">
      <video
        poster="/images/naturetropi01.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 hidden sm:block motion-safe:animate-fade-in"
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src="/videos/tropinord-bg.mp4" type="video/mp4" />
        <img
          src="/images/naturetropi01.jpg"
          alt="Nature fallback"
          className="w-full h-full object-cover"
        />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 bg-white/70 dark:bg-black/50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 space-y-10 scroll-smooth animate-fade-in">
          <header className="text-center py-12">
            <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-400 drop-shadow-md">
              🌿 About TropiNord
            </h1>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 italic">
              Our story, our roots, our mission
            </p>
          </header>

          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
            <p>
              TropiNord is more than just a brand — it’s a journey that brings
              together the rich traditions of the tropics with the clean,
              conscious lifestyle of the Nordic region.
            </p>
            <p>
              Founded in Sweden by Paul Abejegah, TropiNord was inspired by
              personal experiences across Nigeria, the Fiji Islands, Vanuatu,
              and Sweden. Having lived in diverse cultures and communities, Paul
              witnessed both the beauty of nature in its raw form and the
              potential to share it with others in a meaningful way.
            </p>
            <p>
              TropiNord began with a simple belief: that natural products should
              be honest, sustainable, and rooted in real stories. Today, it’s a
              growing platform for organic wellness, cultural connection, and
              sustainable trade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p>
              We exist to make natural living accessible, trustworthy, and
              globally connected. Our mission is to provide:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Pure, organic oils and soaps made from traditional ingredients
              </li>
              <li>
                Ethical and sustainable product sourcing that supports small
                producers
              </li>
              <li>
                A bridge between cultures — connecting African heritage with
                Nordic quality
              </li>
            </ul>
            <p>
              We want our customers to feel confident not just in what they buy,
              but in why they buy it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Our Roots & Sourcing
            </h2>
            <p>
              At TropiNord, we carefully select our ingredients and partners. We
              work with small-scale producers in Africa, the South Pacific, and
              other tropical regions to source raw, high-quality ingredients
              like:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Coconut oil</li>
              <li>Almond oil</li>
              <li>Shea butter</li>
              <li>Black soap</li>
              <li>Neem, hibiscus, turmeric, and more</li>
            </ul>
            <p>
              Our focus is on ethical sourcing, fair pricing, and transparency —
              because how something is made matters just as much as the product
              itself.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Our Impact and Outreach
            </h2>
            <p>
              TropiNord is also a socially driven brand. Beyond selling natural
              products, we aim to support:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Local communities through ethical trade</li>
              <li>
                Youth outreach through sports and education (especially in
                Africa and Sweden)
              </li>
              <li>
                Environmental awareness, with a focus on eco-friendly packaging
                and low-waste logistics
              </li>
            </ul>
            <p>
              As we grow, we’re committed to creating partnerships that reflect
              our values — both in business and community development.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Join the Journey</h2>
            <p>
              Whether you're buying a bottle of coconut oil or exploring a
              long-term collaboration, you're part of something bigger.
            </p>
            <p>
              TropiNord is for people who believe in real products, real people,
              and real purpose.
            </p>
            <p className="italic text-green-700 dark:text-green-400">
              Thanks for being here — we’re just getting started.
            </p>
          </section>

          <div className="text-center pt-4">
            <a
              href="/explore"
              className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
            >
              Explore Our Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
