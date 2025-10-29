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
      { label: "Lavender Oil", value: "lavender-oil", price: 10 },
      { label: "Lemon Oil", value: "lemon-oil", price: 10 },
      { label: "Avocado Oil", value: "avocado-oil", price: 12 },
      { label: "Tea Tree Oil", value: "tea-tree-oil", price: 11 },
      { label: "Peppermint Oil", value: "peppermint-oil", price: 10 },
      { label: "Neem Oil", value: "neem-oil", price: 9 },
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
        src: "/images/liquidsoap01.jpg",
        name: "Herbal Liquid Soap",
        slug: "herbal-liquid-soap",
        description: "Gentle, plant-based soap with essential oils.",
      },
      {
        src: "/images/liquidsoap02.jpg",
        name: "Moisturizing Liquid Cleanser",
        slug: "moisturizing-liquid-cleanser",
        description: "Hydrating with shea and aloe, ideal for dry skin.",
      },
      {
        src: "/images/blacksoap02.jpg",
        name: "Raw African Black Soap",
        slug: "raw-african-black-soap",
        description: "Made from plantain skins and cocoa pods.",
      },
      {
        src: "/images/flowersoap01.jpg",
        name: "Floral Infused Soap Bar",
        slug: "floral-infused-soap-bar",
        description: "Handcrafted with floral extracts and oils.",
      },
    ],
    options: [
      { label: "Herbal Liquid Soap", value: "herbal-liquid-soap", price: 7 },
      {
        label: "Moisturizing Liquid Cleanser",
        value: "moisturizing-liquid-cleanser",
        price: 8,
      },
      {
        label: "Raw African Black Soap",
        value: "raw-african-black-soap",
        price: 6,
      },
      {
        label: "Floral Infused Soap Bar",
        value: "floral-infused-soap-bar",
        price: 7,
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
      {
        src: "/images/charcoal.jpg",
        name: "Charcoal (Bulk)",
        slug: "charcoal-bulk",
        description: "High-quality BBQ/industrial charcoal in bulk.",
      },
      {
        src: "/images/drybones01.jpg",
        name: "Dry Bones (Feed)",
        slug: "dry-bones",
        description: "Sun-dried bones ideal for animal feed.",
      },
    ],
    options: [
      { label: "Banana Leaves", value: "banana-leaves", price: 15 },
      { label: "Charcoal (Bulk)", value: "charcoal-bulk", price: 25 },
      { label: "Dry Bones (Feed)", value: "dry-bones", price: 18 },
    ],
  },
  {
    id: 4,
    name: "Roll-On",
    slug: "roll-on",
    description: "Essential oil roll-ons for convenient application.",
    image: "/images/roll-on03.jpg",
    link: "https://yourstore.com/roll-on",
    gallery: [
      {
        src: "/images/roll-on03.jpg",
        name: "Essential Oil Roll-On",
        slug: "essential-oil-roll-on",
        description: "Convenient roll-on applicator for essential oil blends.",
      },
    ],
    options: [
      {
        label: "Essential Oil Roll-On",
        value: "essential-oil-roll-on",
        price: 12,
      },
    ],
  },
];

export default products;
