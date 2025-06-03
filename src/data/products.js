const products = [
  {
    id: 1,
    name: "Organic Oils",
    slug: "organic-oils",
    description: "Cold-pressed oils like coconut, almond, neem, etc.",
    image: "/images/organicoil03.jpg",
    link: "https://yourstore.com/organic-oils",
    gallery: [
      {
        src: "/images/cosmeticsoils01.jpg",
        name: "Lavender Oil",
        description: "Soothing and calming, great for skin and relaxation.",
      },
      {
        src: "/images/cosmeticsoils02.jpg",
        name: "Lemon Oil",
        description: "Bright and zesty, helps purify and uplift mood.",
      },
      {
        src: "/images/cosmeticsoils03.jpg",
        name: "Avocado Oil",
        description: "Rich in vitamins, nourishes and softens the skin.",
      },
      {
        src: "/images/cosmeticsoils04.jpg",
        name: "Tea Tree Oil",
        description:
          "Powerful natural antiseptic, great for blemish-prone skin.",
      },
      {
        src: "/images/cosmeticsoils05.jpg",
        name: "Peppermint Oil",
        description: "Refreshing and invigorating, supports mental clarity.",
      },
      {
        src: "/images/neemoil.jpg",
        name: "Neem Oil",
        description:
          "Known for its antibacterial properties and skin-soothing benefits.",
      },
    ],
    options: [
      { label: "Lavender Oil", value: "lavender" },
      { label: "Lemon Oil", value: "lemon" },
      { label: "Avocado Oil", value: "avocado" },
      { label: "Tea Tree Oil", value: "tea-tree" },
      { label: "Peppermint Oil", value: "peppermint" },
      { label: "Neem Oil", value: "neem" },
    ],
  },
  {
    id: 2,
    name: "Natural Soaps",
    slug: "natural-soaps",
    description: "African black soap, shea bars, fruit-based soaps.",
    image: "/images/organicsoap0001.jpg",
    link: "https://yourstore.com/natural-soaps",
    gallery: [
      "/images/organicsoap0001.jpg",
      {
        src: "/images/liquidsoap01.jpg",
        name: "Herbal Liquid Soap",
        description:
          "Gentle, plant-based liquid soap enriched with essential oils for a clean, natural wash.",
      },
      {
        src: "/images/liquidsoap02.jpg",
        name: "Moisturizing Liquid Cleanser",
        description:
          "Hydrating liquid soap with shea and aloe, ideal for dry and sensitive skin.",
      },
      {
        src: "/images/blacksoap02.jpg",
        name: "Raw African Black Soap",
        description:
          "Traditional raw African black soap made from plantain skins and cocoa pods, known for deep cleansing and natural healing.",
      },
      {
        src: "/images/flowersoap01.jpg",
        name: "Floral Infused Soap Bar",
        description:
          "Handcrafted soap with floral extracts and essential oils, offering a luxurious and aromatic bathing experience.",
      },
    ],
  },
  {
    id: 3,
    name: "Agro Imports",
    slug: "agro-imports",
    description: "Banana leaves, bone charcoal, and small farm tools.",
    image: "/images/bananaleaves01.jpg",
    link: "https://yourstore.com/agro-imports",
    gallery: ["/images/bananaleaves01.jpg"],
  },
];

export default products;
