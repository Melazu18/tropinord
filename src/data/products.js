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
        slug: "lavender-oil",
        description: "Soothing and calming, great for skin and relaxation.",
      },
      {
        src: "/images/cosmeticsoils02.jpg",
        name: "Lemon Oil",
        slug: "lemon-oil",
        description: "Bright and zesty, helps purify and uplift mood.",
      },
      {
        src: "/images/avocadooil.jpg",
        name: "Avocado Oil",
        slug: "avocado-oil",
        description: "Rich in vitamins, nourishes and softens the skin.",
      },
      {
        src: "/images/cosmeticsoils04.jpg",
        name: "Tea Tree Oil",
        slug: "tea-tree-oil",
        description:
          "Powerful natural antiseptic, great for blemish-prone skin.",
      },
      {
        src: "/images/cosmeticsoils05.jpg",
        name: "Peppermint Oil",
        slug: "peppermint-oil",
        description: "Refreshing and invigorating, supports mental clarity.",
      },
      {
        src: "/images/neemoil.jpg",
        name: "Neem Oil",
        slug: "neem-oil",
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
      {
        src: "/images/organicsoap0001.jpg",
        name: "Natural Soap Cover",
        slug: "natural-soap-cover",
        description: "Category cover image",
      },
      {
        src: "/images/liquidsoap01.jpg",
        name: "Herbal Liquid Soap",
        slug: "herbal-liquid-soap",
        description:
          "Gentle, plant-based liquid soap enriched with essential oils for a clean, natural wash.",
      },
      {
        src: "/images/liquidsoap02.jpg",
        name: "Moisturizing Liquid Cleanser",
        slug: "moisturizing-liquid-cleanser",
        description:
          "Hydrating liquid soap with shea and aloe, ideal for dry and sensitive skin.",
      },
      {
        src: "/images/blacksoap02.jpg",
        name: "Raw African Black Soap",
        slug: "raw-african-black-soap",
        description:
          "Traditional raw African black soap made from plantain skins and cocoa pods, known for deep cleansing and natural healing.",
      },
      {
        src: "/images/flowersoap01.jpg",
        name: "Floral Infused Soap Bar",
        slug: "floral-infused-soap-bar",
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
    gallery: [
      {
        src: "/images/bananaleaves01.jpg",
        name: "Banana Leaves",
        slug: "banana-leaves",
        description: "Naturally harvested banana leaves for various uses.",
      },
    ],
  },
];

export default products;
