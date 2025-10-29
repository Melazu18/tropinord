const teaCatalogData = {
  // 🌿 Herbal Teas
  "tea-hibiscus": {
    id: "tea-hibiscus",
    name: "Hibiscus Herbal Tea",
    slug: "hibiscus-herbal-tea",
    image: "/images/hibiscusDrink03.jpg",
    description:
      "Known for its vibrant color and tart flavor, hibiscus tea is rich in antioxidants.",
    history: "Rooted in Egyptian and West African traditions.",
    benefits: [
      "Supports heart health",
      "Lowers blood pressure",
      "Rich in Vitamin C",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },
  "tea-mountain-herbs": {
    id: "tea-mountain-herbs",
    name: "Mountain Forest Herbal Tea",
    slug: "mountain-forest-herbal-tea",
    image: "/images/tea03.jpg",
    description:
      "A blend of Nordic and alpine botanicals for natural energy and immunity.",
    history: "Inspired by Scandinavian herbal medicine.",
    benefits: ["Boosts energy", "Supports immunity", "Enhances clarity"],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },
  "tea-brennessel": {
    id: "tea-brennessel",
    name: "Nettle Leaves (Brennessel)",
    slug: "nettle-leaves-brennessel",
    image: "/images/tea-nettle.jpg",
    description: "Supports kidney and joint health.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },
  "tea-pfefferminz": {
    id: "tea-pfefferminz",
    name: "Peppermint (Pfefferminz)",
    slug: "peppermint-pfefferminz",
    image: "/images/tea-peppermint.jpg",
    description: "Digestive and relaxing herbal infusion.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },
  "tea-kamille": {
    id: "tea-kamille",
    name: "Chamomile (Kamille)",
    slug: "chamomile-kamille",
    image: "/images/tea-chamomile.jpg",
    description: "Calming tea for sleep and stress relief.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },
  "tea-lemongrass": {
    id: "tea-lemongrass",
    name: "Lemongrass (Zitronengras)",
    slug: "lemongrass-zitronengras",
    image: "/images/tea-lemongrass.jpg",
    description: "Fresh, zesty, and great for digestion.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },
  "tea-frauenmantel": {
    id: "tea-frauenmantel",
    name: "Lady’s Mantle (Frauenmantel)",
    slug: "ladys-mantle-frauenmantel",
    image: "/images/tea-frauenmantel.jpg",
    description: "Traditionally used for hormonal balance.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },
  "tea-melisse": {
    id: "tea-melisse",
    name: "Lemon Balm (Melisse)",
    slug: "lemon-balm-melisse",
    image: "/images/tea-melisse.jpg",
    description: "Calming and anxiety-relieving herbal tea.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
  },

  // 🍃 Green Tea (Placeholder)
  "tea-sencha": {
    id: "tea-sencha",
    name: "Sencha Green Tea",
    slug: "sencha-green-tea",
    image: null,
    description:
      "Classic steamed green tea with grassy flavor and antioxidants.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
  },
  "tea-gunpowder": {
    id: "tea-gunpowder",
    name: "Gunpowder Green Tea",
    slug: "gunpowder-green-tea",
    image: null,
    description:
      "Tightly rolled green tea leaves that unfurl when steeped, offering a bold and slightly smoky flavor.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
  },
  "tea-jasmine-green": {
    id: "tea-jasmine-green",
    name: "Jasmine Green Tea",
    slug: "jasmine-green-tea",
    image: null,
    description: "Green tea infused with aromatic jasmine blossoms.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
  },

  // 🍂 Black Tea (Placeholder)
  "tea-assam": {
    id: "tea-assam",
    name: "Assam Black Tea",
    slug: "assam-black-tea",
    image: null,
    description: "Strong and malty black tea from India.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "black",
  },
  "tea-earl-grey": {
    id: "tea-earl-grey",
    name: "Earl Grey",
    slug: "earl-grey",
    image: null,
    description: "Black tea with citrusy bergamot flavor.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "black",
  },

  // 🕊️ White Tea (Placeholder)
  "tea-white-peony": {
    id: "tea-white-peony",
    name: "White Peony (Bai Mudan)",
    slug: "white-peony-bai-mudan",
    image: null,
    description: "Delicate white tea with floral notes.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "white",
  },
  "tea-silver-needle": {
    id: "tea-silver-needle",
    name: "Silver Needle",
    slug: "silver-needle",
    image: null,
    description: "Premium white tea made from young unopened buds.",
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "white",
  },
};

module.exports = teaCatalogData; // CJS
module.exports.default = teaCatalogData;
