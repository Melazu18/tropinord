const teaCatalogData = {
  // ─────────────────────────────────────────────
  // ✅ New packaged teas from your label names
  // ─────────────────────────────────────────────
  "tea-gentle-garden": {
    id: "tea-gentle-garden",
    productCode: "TN-TEA-GG-050-001",
    slug: "tea-gentle-garden",
    i18nKey: "gentle-garden",
    name: "Gentle Garden",
    image: null,
    description:
      "A soothing fruit and herbal infusion with apple, hibiscus, fennel, and star anise, evoking natural balance.",
    history: "",
    originCountry: null,
    benefits: [],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Apple", "Hibiscus", "Fennel", "Star anise"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 8, max: 10, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "fruity",
    flavour: ["Apple", "Hibiscus", "Spice"],

    safetyNotice: { type: "fruit" },
    productUrl: "/products/tea/gentle-garden",
  },

  "tea-warm-resolve": {
    id: "tea-warm-resolve",
    productCode: "TN-TEA-WR-050-001",
    slug: "tea-warm-resolve",
    i18nKey: "warm-resolve",
    name: "Warm Resolve",
    image: null,
    description:
      "A caffeine-free organic herbal and spice blend that delivers gentle warmth, strength, and comfort.",
    history: "",
    originCountry: null,
    benefits: [],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Herbal blend", "Spices (final blend TBD)"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 8, max: 10, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "spiced",
    flavour: ["Warm spices"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/warm-resolve",
  },

  "tea-quiet-morning": {
    id: "tea-quiet-morning",
    productCode: "TN-TEA-QM-050-001",
    slug: "tea-quiet-morning",
    i18nKey: "quiet-morning",
    name: "Quiet Morning",
    image: null,
    description:
      "A refined organic black tea with bright bergamot notes, capturing the calm clarity of an early day.",
    history: "",
    originCountry: null,
    benefits: [],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "black",
    ingredients: ["Black tea", "Bergamot (final blend TBD)"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 3, max: 5, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "citrusy",
    flavour: ["Bergamot", "Black tea"],

    safetyNotice: { type: "black" },
    productUrl: "/products/tea/quiet-morning",
  },

  "tea-soft-horizon": {
    id: "tea-soft-horizon",
    productCode: "TN-TEA-SH-050-001",
    slug: "tea-soft-horizon",
    i18nKey: "soft-horizon",
    name: "Soft Horizon",
    image: null,
    description:
      "A refreshing wellness blend with fruity tones of apple, lemon, and rosemary, suggesting lightness and renewal.",
    history: "",
    originCountry: null,
    benefits: [],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Apple", "Lemon", "Rosemary"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 6, max: 8, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "citrusy",
    flavour: ["Apple", "Lemon", "Rosemary"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/soft-horizon",
  },

  "tea-moonlight-talk": {
    id: "tea-moonlight-talk",
    productCode: "TN-TEA-MT-050-001",
    slug: "tea-moonlight-talk",
    i18nKey: "moonlight-talk",
    name: "Moonlight Talk",
    image: null,
    description:
      "A soft, calming evening herbal blend with delicate tropical notes, made for quiet nighttime moments.",
    history: "",
    originCountry: null,
    benefits: [],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Evening herbal blend (final blend TBD)"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 8, max: 10, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "herbal",
    flavour: ["Calming herbs"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/moonlight-talk",
  },

  // ─────────────────────────────────────────────
  // Original teas continue here...
  // ─────────────────────────────────────────────
  "tea-hibiscus": {
    id: "tea-hibiscus",
    productCode: "TN-TEA-HIB-050-001",
    slug: "tea-hibiscus",
    i18nKey: "hibiscus",
    name: "Hibiscus Herbal Tea",
    image: "/images/hibiscusDrink03.jpg",
    description:
      "Known for its vibrant color and tart flavor, hibiscus tea is rich in antioxidants.",
    history: "Rooted in Egyptian and West African traditions.",
    originCountry: "Nigeria",
    benefits: [
      "Supports heart health",
      "Lowers blood pressure",
      "Rich in Vitamin C",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Dried hibiscus calyces (Hibiscus sabdariffa)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 8, max: 10, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "fruity",
    flavour: ["Hibiscus"],

    safetyNotice: { type: "fruit" },

    // QR should point here
    productUrl: "/products/tea/hibiscus-herbal-tea",
  },

  "tea-mountain-herbs": {
    id: "tea-mountain-herbs",
    productCode: "TN-TEA-MFH-050-001",
    slug: "tea-mountain-herbs",
    i18nKey: "mountain-forest",
    name: "Mountain Forest Herbal Tea",
    image: "/images/tea03.jpg",
    description:
      "A blend of Nordic and alpine botanicals for natural energy and immunity.",
    history:
      "Inspired by traditional Scandinavian herbal medicine and alpine foraging practices.",
    originCountry: "Sweden",
    benefits: [
      "Boosts natural energy",
      "Supports immune system",
      "Enhances mental clarity",
      "Rich in antioxidants",
    ],
    prices: { SEK: 5, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: [
      "Spruce tips (Picea abies)",
      "Juniper berry (Juniperus communis)",
      "Birch leaf (Betula pendula)",
      "Nettle leaf (Urtica dioica)",
      "Lemon balm (Melissa officinalis)",
    ],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 8, max: 10, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "herbal",
    flavour: ["Forest herbs"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/mountain-forest-herbal-tea",
  },

  "tea-brennessel": {
    id: "tea-brennessel",
    productCode: "TN-TEA-NET-050-001",
    slug: "tea-brennessel",
    i18nKey: "nettle",
    name: "Nettle Leaves (Brennessel)",
    image: "/images/tea-nettle.jpg",
    description:
      "Herbal classic that supports kidney and joint health with mineral-rich properties.",
    history:
      "Used in European folk medicine for centuries as a spring tonic and detoxifier.",
    originCountry: "Germany",
    benefits: [
      "Supports kidney function",
      "Reduces inflammation in joints",
      "Rich in iron and minerals",
      "Natural detoxification support",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Nettle leaf (Urtica dioica)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 8, max: 10, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "herbal",
    flavour: ["Nettle"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/nettle-leaves-brennessel",
  },

  "tea-pfefferminz": {
    id: "tea-pfefferminz",
    productCode: "TN-TEA-PEP-050-001",
    slug: "tea-pfefferminz",
    i18nKey: "peppermint",
    name: "Peppermint (Pfefferminz)",
    image: "/images/tea-peppermint.jpg",
    description:
      "Cooling, minty cup that soothes digestion and clears the mind.",
    history:
      "Ancient Egyptian and Greek remedy for digestive issues and respiratory health.",
    originCountry: "United States",
    benefits: [
      "Aids digestion and relieves bloating",
      "Soothes headaches and tension",
      "Clears respiratory system",
      "Natural stress relief",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Peppermint leaf (Mentha × piperita)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 6, max: 8, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "minty",
    flavour: ["Peppermint"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/peppermint-pfefferminz",
  },

  "tea-kamille": {
    id: "tea-kamille",
    productCode: "TN-TEA-CHA-050-001",
    slug: "tea-kamille",
    i18nKey: "chamomile",
    name: "Chamomile (Kamille)",
    image: "/images/tea-chamomile.jpg",
    description: "Gentle floral tea to unwind, calm and support restful sleep.",
    history:
      "Ancient Egyptian, Roman, and Greek herbal remedy for relaxation and healing.",
    originCountry: "Egypt",
    benefits: [
      "Promotes relaxation and sleep",
      "Reduces anxiety and stress",
      "Soothes digestive system",
      "Anti-inflammatory properties",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Chamomile flower (Matricaria chamomilla)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 6, max: 8, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "floral",
    flavour: ["Chamomile"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/chamomile-kamille",
  },

  "tea-lemongrass": {
    id: "tea-lemongrass",
    productCode: "TN-TEA-LEM-050-001",
    slug: "tea-lemongrass",
    i18nKey: "lemongrass",
    name: "Lemongrass (Zitronengras)",
    image: "/images/tea-lemongrass.jpg",
    description:
      "Fresh, zesty, citrusy infusion often enjoyed after meals for digestion.",
    history:
      "Traditional Southeast Asian remedy for digestive health and fever reduction.",
    originCountry: "Thailand",
    benefits: [
      "Aids digestion and relieves bloating",
      "Rich in antioxidants",
      "Supports healthy cholesterol levels",
      "Natural diuretic properties",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Lemongrass (Cymbopogon citratus)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 6, max: 8, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "citrusy",
    flavour: ["Lemongrass"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/lemongrass-zitronengras",
  },

  "tea-frauenmantel": {
    id: "tea-frauenmantel",
    productCode: "TN-TEA-LM-050-001",
    slug: "tea-frauenmantel",
    i18nKey: "ladys-mantle",
    name: "Lady's Mantle (Frauenmantel)",
    image: "/images/tea-frauenmantel.jpg",
    description:
      "Traditionally used to support hormonal balance and women's wellbeing.",
    history:
      "Medieval European herb for women's health, wound healing, and vitality.",
    originCountry: "Poland",
    benefits: [
      "Supports hormonal balance",
      "Anti-inflammatory properties",
      "Promotes skin health",
      "Aids menstrual comfort",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Lady's mantle leaf (Alchemilla vulgaris)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 8, max: 10, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "herbal",
    flavour: ["Lady's Mantle"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/ladys-mantle-frauenmantel",
  },

  "tea-melisse": {
    id: "tea-melisse",
    productCode: "TN-TEA-LB-050-001",
    slug: "tea-melisse",
    i18nKey: "lemon-balm",
    name: "Lemon Balm (Melisse)",
    image: "/images/tea-melisse.jpg",
    description:
      "Soft lemon-herbal aroma; known for calming and anxiety-relieving properties.",
    history:
      "Ancient Greek and Roman remedy for anxiety, sleep issues, and cognitive function.",
    originCountry: "Mediterranean Region",
    benefits: [
      "Reduces stress and anxiety",
      "Improves sleep quality",
      "Antiviral properties",
      "Supports cognitive function",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "herbal",
    ingredients: ["Lemon balm leaf (Melissa officinalis)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 2, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 6, max: 8, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "herbal",
    flavour: ["Lemon balm"],

    safetyNotice: { type: "herbal" },
    productUrl: "/products/tea/lemon-balm-melisse",
  },

  // Green teas
  "tea-sencha": {
    id: "tea-sencha",
    productCode: "TN-TEA-SEN-050-001",
    slug: "tea-sencha",
    i18nKey: "sencha",
    name: "Sencha Green Tea",
    image: null,
    description:
      "Classic Japanese steamed green tea with grassy flavor and rich antioxidants.",
    history:
      "Traditional Japanese tea dating back to the 18th century, popular for daily consumption.",
    originCountry: "Japan",
    benefits: [
      "Rich in antioxidants (catechins)",
      "Boosts metabolism",
      "Supports heart health",
      "Enhances mental alertness",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
    ingredients: ["Green tea leaves (Camellia sinensis)"],
    productionYear: "2024",
    bestBefore: "2025",
    naturallyGrown: false,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 2, max: 3, unit: "min" },
    brewTemperature: { value: 80, unit: "C" },
    flavouring: "fresh",
    flavour: ["Green tea"],
    safetyNotice: { type: "green" },

    productUrl: "/products/tea/sencha-green-tea",
  },

  "tea-gunpowder": {
    id: "tea-gunpowder",
    productCode: "TN-TEA-GUN-050-001",
    slug: "tea-gunpowder",
    i18nKey: "gunpowder",
    name: "Gunpowder Green Tea",
    image: null,
    description:
      "Tightly rolled green tea leaves that unfurl when steeped, offering a bold and slightly smoky flavor.",
    history:
      "Originated in Zhejiang Province, China during the Tang Dynasty, named for pellet-like appearance.",
    originCountry: "China",
    benefits: [
      "High in antioxidants",
      "Supports weight management",
      "Boosts immune system",
      "Improves dental health",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
    ingredients: ["Green tea leaves (Camellia sinensis)"],
    productionYear: "2024",
    bestBefore: "2025",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 2, max: 3, unit: "min" },
    brewTemperature: { value: 85, unit: "C" },
    flavouring: "bold",
    flavour: ["Green tea"],
    safetyNotice: { type: "green" },

    productUrl: "/products/tea/gunpowder-green-tea",
  },

  "tea-jasmine-green": {
    id: "tea-jasmine-green",
    productCode: "TN-TEA-JAS-050-001",
    slug: "tea-jasmine-green",
    i18nKey: "jasmine-green",
    name: "Jasmine Green Tea",
    image: null,
    description:
      "Green tea delicately infused with aromatic jasmine blossoms for a floral experience.",
    history:
      "Chinese tradition dating back to the Song Dynasty, where tea was scented with fresh jasmine flowers.",
    originCountry: "China",
    benefits: [
      "Calming and relaxing effects",
      "Rich in antioxidants",
      "Supports digestive health",
      "Natural stress relief",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
    ingredients: [
      "Green tea leaves (Camellia sinensis)",
      "Jasmine blossoms (Jasminum officinale)",
    ],
    productionYear: "2024",
    bestBefore: "2025",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 2, max: 3, unit: "min" },
    brewTemperature: { value: 80, unit: "C" },
    flavouring: "floral",
    flavour: ["Jasmine", "Green tea"],
    safetyNotice: { type: "green" },

    productUrl: "/products/tea/jasmine-green-tea",
  },

  // Black teas
  "tea-assam": {
    id: "tea-assam",
    productCode: "TN-TEA-ASS-050-001",
    slug: "tea-assam",
    i18nKey: "assam",
    name: "Assam Black Tea",
    image: null,
    description:
      "Strong, malty, and robust black tea from the Assam region of India.",
    history:
      "Discovered in Assam, India in the 19th century, now one of the world's most popular black teas.",
    originCountry: "India",
    benefits: [
      "Boosts energy and alertness",
      "Supports heart health",
      "Rich in theaflavins",
      "Aids digestion",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "black",
    ingredients: ["Black tea leaves (Camellia sinensis, Assamica cultivar)"],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 3, max: 5, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "malty",
    flavour: ["Black tea"],
    safetyNotice: { type: "black" },

    productUrl: "/products/tea/assam-black-tea",
  },

  "tea-earl-grey": {
    id: "tea-earl-grey",
    productCode: "TN-TEA-EG-050-001",
    slug: "tea-earl-grey",
    i18nKey: "earl-grey",
    name: "Earl Grey",
    image: null,
    description:
      "Classic British black tea with distinctive citrusy bergamot flavor and aroma.",
    history:
      "Named after Charles Grey, 2nd Earl Grey, British Prime Minister in the 1830s.",
    originCountry: "United Kingdom",
    benefits: [
      "Mood enhancement",
      "Digestive support",
      "Antioxidant properties",
      "Mental clarity and focus",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "black",
    ingredients: [
      "Black tea leaves (Camellia sinensis)",
      "Natural bergamot oil (Citrus bergamia)",
    ],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: false,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 3, max: 5, unit: "min" },
    brewTemperature: { value: 100, unit: "C" },
    flavouring: "citrusy",
    flavour: ["Bergamot", "Black tea"],
    safetyNotice: { type: "black" },

    productUrl: "/products/tea/earl-grey",
  },

  // White teas
  "tea-white-peony": {
    id: "tea-white-peony",
    productCode: "TN-TEA-WP-050-001",
    slug: "tea-white-peony",
    i18nKey: "white-peony",
    name: "White Peony (Bai Mudan)",
    image: null,
    description:
      "Delicate white tea with mild, sweet flavor and subtle floral notes.",
    history:
      "Traditional Chinese white tea from Fujian province, known for its delicate processing.",
    originCountry: "China",
    benefits: [
      "Highest antioxidant content among teas",
      "Supports skin health",
      "Gentle on stomach",
      "Natural anti-aging properties",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "white",
    ingredients: ["White tea buds and young leaves (Camellia sinensis)"],
    productionYear: "2024",
    bestBefore: "2027",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 4, max: 6, unit: "min" },
    brewTemperature: { value: 85, unit: "C" },
    flavouring: "delicate",
    flavour: ["White tea"],
    safetyNotice: { type: "white" },

    productUrl: "/products/tea/white-peony-bai-mudan",
  },

  "tea-silver-needle": {
    id: "tea-silver-needle",
    productCode: "TN-TEA-SN-050-001",
    slug: "tea-silver-needle",
    i18nKey: "silver-needle",
    name: "Silver Needle (Bai Hao Yin Zhen)",
    image: null,
    description:
      "Premium white tea made exclusively from young, unopened buds with silvery appearance.",
    history:
      "Imperial Chinese tea reserved for royalty during the Song Dynasty, representing the pinnacle of white tea.",
    originCountry: "China",
    benefits: [
      "Ultra-high antioxidant content",
      "Supports immune system",
      "Promotes radiant skin",
      "Gentle energy boost",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "white",
    ingredients: ["White tea buds (Camellia sinensis)"],
    productionYear: "2024",
    bestBefore: "2027",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 4, max: 6, unit: "min" },
    brewTemperature: { value: 85, unit: "C" },
    flavouring: "delicate",
    flavour: ["White tea"],
    safetyNotice: { type: "white" },

    productUrl: "/products/tea/silver-needle",
  },

  // Existing featured one (kept, but fixed "story" -> "history" for consistency)
  "tea-floral-green": {
    id: "tea-floral-green",
    productCode: "TN-TEA-FG-050-001",
    slug: "tea-floral-green",
    i18nKey: "floral-green",
    name: "Floral Green",
    image: "/images/tea03.jpg",
    description:
      "A delicate green tea with soft floral notes—bright, clean, and calm.",
    history:
      "Floral Green is designed for clarity and calm—an easy daily green tea with a light floral finish. Ideal for mornings or early afternoons when you want focus without heaviness.",
    originCountry: "China",
    benefits: ["Rich in antioxidants", "Supports focus and alertness"],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    category: "green",
    ingredients: [
      "Green tea leaves (Camellia sinensis)",
      "Natural floral aroma",
    ],
    productionYear: "2024",
    bestBefore: "2026",
    naturallyGrown: true,

    articleNo: null,
    dosage: { amount: 1.5, unit: "tsp", volumeMl: 250 },
    brewingTime: { min: 2, max: 3, unit: "min" },
    brewTemperature: { value: 80, unit: "C" },
    flavouring: "floral",
    flavour: ["Floral", "Green tea"],
    safetyNotice: { type: "green" },
    featuredPage: true,

    productUrl: "/products/tea/floral-green",
  },
};

export default teaCatalogData;
