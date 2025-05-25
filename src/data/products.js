const products = [
  {
    id: 1,
    name: "Organic Oils",
    slug: "organic-oils",
    description: "Cold-pressed oils like coconut, almond, neem, etc.",
    image: "/images/organicoil03.jpg", // sample image used for explore page only
    link: "https://yourstore.com/organic-oils", // ✅ Replace with actual link
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
    link: "https://yourstore.com/natural-soaps", // ✅ Replace with actual link
    gallery: ["/images/organicsoap0001.jpg"],
  },
  {
    id: 3,
    name: "Agro Imports",
    slug: "agro-imports",
    description: "Banana leaves, bone charcoal, and small farm tools.",
    image: "/images/bananaleaves01.jpg",
    link: "https://yourstore.com/agro-imports", // ✅ Replace with actual link
    gallery: ["/images/bananaleaves01.jpg"],
  },
];

export default products;
