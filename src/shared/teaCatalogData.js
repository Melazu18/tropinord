// src/shared/teaCatalogData.js

const teaCatalogData = {
  "tea-hibiscus": {
    id: "tea-hibiscus",
    slug: "tea-hibiscus",
    name: "Hibiscus Herbal Tea",
    image: "/images/hibiscusDrink03.jpg",
    description:
      "Known for its vibrant color and tart flavor, hibiscus tea is rich in antioxidants.",
    history: "Rooted in Egyptian and West African traditions.",
    benefits: [
      "Supports heart health",
      "Lowers blood pressure",
      "Rich in Vitamin C",
    ],
    prices: { SEK: 45, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Dried hibiscus calyces (Hibiscus sabdariffa)"],
  },

  "tea-mountain-herbs": {
    id: "tea-mountain-herbs",
    slug: "tea-mountain-herbs",
    name: "Mountain Forest Herbal Tea",
    image: "/images/tea03.jpg",
    description:
      "A blend of Nordic and alpine botanicals for natural energy and immunity.",
    history: "Inspired by Scandinavian herbal medicine.",
    benefits: ["Boosts energy", "Supports immunity", "Enhances clarity"],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: [
      "Spruce tips",
      "Juniper berry",
      "Birch leaf",
      "Nettle leaf",
      "Lemon balm",
    ],
  },

  "tea-brennessel": {
    id: "tea-brennessel",
    slug: "tea-brennessel",
    name: "Nettle Leaves (Brennessel)",
    image: "/images/tea-nettle.jpg",
    description: "Supports kidney and joint health.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Nettle leaf (Urtica dioica)"],
  },

  "tea-pfefferminz": {
    id: "tea-pfefferminz",
    slug: "tea-pfefferminz",
    name: "Peppermint (Pfefferminz)",
    image: "/images/tea-peppermint.jpg",
    description: "Digestive and relaxing herbal infusion.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Peppermint leaf (Mentha × piperita)"],
  },

  "tea-kamille": {
    id: "tea-kamille",
    slug: "tea-kamille",
    name: "Chamomile (Kamille)",
    image: "/images/tea-chamomile.jpg",
    description: "Calming tea for sleep and stress relief.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Chamomile flower (Matricaria chamomilla)"],
  },

  "tea-lemongrass": {
    id: "tea-lemongrass",
    slug: "tea-lemongrass",
    name: "Lemongrass (Zitronengras)",
    image: "/images/tea-lemongrass.jpg",
    description: "Fresh, zesty, and great for digestion.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Lemongrass (Cymbopogon citratus)"],
  },

  "tea-frauenmantel": {
    id: "tea-frauenmantel",
    slug: "tea-frauenmantel",
    name: "Lady’s Mantle (Frauenmantel)",
    image: "/images/tea-frauenmantel.jpg",
    description: "Traditionally used for hormonal balance.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Lady’s mantle (Alchemilla vulgaris)"],
  },

  "tea-melisse": {
    id: "tea-melisse",
    slug: "tea-melisse",
    name: "Lemon Balm (Melisse)",
    image: "/images/tea-melisse.jpg",
    description: "Calming and anxiety-relieving herbal tea.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Lemon balm (Melissa officinalis)"],
  },

  "tea-sencha": {
    id: "tea-sencha",
    slug: "tea-sencha",
    name: "Sencha Green Tea",
    image: null,
    description:
      "Classic steamed green tea with grassy flavor and antioxidants.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
    ingredients: ["Green tea (Camellia sinensis)"],
  },

  "tea-gunpowder": {
    id: "tea-gunpowder",
    slug: "tea-gunpowder",
    name: "Gunpowder Green Tea",
    image: null,
    description:
      "Tightly rolled green tea leaves that unfurl when steeped, offering a bold and slightly smoky flavor.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
    ingredients: ["Green tea (Camellia sinensis)"],
  },

  "tea-jasmine-green": {
    id: "tea-jasmine-green",
    slug: "tea-jasmine-green",
    name: "Jasmine Green Tea",
    image: null,
    description: "Green tea infused with aromatic jasmine blossoms.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
    ingredients: ["Green tea (Camellia sinensis)", "Jasmine blossoms"],
  },

  "tea-assam": {
    id: "tea-assam",
    slug: "tea-assam",
    name: "Assam Black Tea",
    image: null,
    description: "Strong and malty black tea from India.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "black",
    ingredients: ["Black tea (Camellia sinensis, Assamica cultivar)"],
  },

  "tea-earl-grey": {
    id: "tea-earl-grey",
    slug: "tea-earl-grey",
    name: "Earl Grey",
    image: null,
    description: "Black tea with citrusy bergamot flavor.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "black",
    ingredients: ["Black tea (Camellia sinensis)", "Natural bergamot flavor"],
  },

  "tea-white-peony": {
    id: "tea-white-peony",
    slug: "tea-white-peony",
    name: "White Peony (Bai Mudan)",
    image: null,
    description: "Delicate white tea with floral notes.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "white",
    ingredients: ["White tea (Camellia sinensis—buds and young leaves)"],
  },

  "tea-silver-needle": {
    id: "tea-silver-needle",
    slug: "tea-silver-needle",
    name: "Silver Needle",
    image: null,
    description: "Premium white tea made from young unopened buds.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "white",
    ingredients: ["White tea buds (Camellia sinensis)"],
  },
};

export default teaCatalogData;
