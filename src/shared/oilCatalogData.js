// src/shared/oilCatalogData.js
const oilCatalogData = {
  // ✅ Cold-Pressed Coconut Oil (100ml) — SEK 300
  "oil-coconut": {
    id: "oil-coconut",
    slug: "oil-coconut",
    productCode: "TN-COCO-100-001",
    name: "Cold-Pressed Coconut Oil",
    image: "/images/coconut-oil.jpg",
    description:
      "Single-ingredient cold-pressed coconut oil. Solid at cooler temperatures; melts on skin contact.",
    history:
      "Traditional tropical oil used for centuries in Africa, South Asian and Pacific Island cultures for cooking, hair care, and skin protection.",
    originCountry: "Mozambique",
    benefits: [
      "Deeply moisturizes skin and hair",
      "Natural cleansing feel",
      "Supports skin barrier comfort",
      "Rich in naturally occurring fatty acids",
    ],
    prices: { SEK: 300, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Cocos Nucifera Oil"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,
    netContent: "100ml",
    extractionMethod: "Cold-pressed",
  },

  // ✅ Heat-Processed Coconut Oil (100ml) — SEK 250
  "oil-coconut-heat": {
    id: "oil-coconut-heat",
    slug: "oil-coconut-heat",
    productCode: "TN-COCOH-100-001",
    name: "Heat-Processed Coconut Oil",
    image: "/images/coconut-oil-heat.jpg",
    description:
      "Single-ingredient coconut oil produced with heat processing. Suitable for culinary preparation or traditional external use.",
    history:
      "Coconut oil has long been used across tropical regions for household cooking and traditional personal care preparations.",
    originCountry: "Nigeria",
    benefits: [
      "Multi-purpose household staple",
      "Great for higher-heat cooking use",
      "Traditional oil base for recipes",
    ],
    prices: { SEK: 250, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Cocos Nucifera Oil"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,
    netContent: "100ml",
    extractionMethod: "Heat-processed",
  },

  // ✅ Castor Oil (100ml) — SEK 400
  "oil-castor": {
    id: "oil-castor",
    slug: "oil-castor",
    productCode: "TN-CAST-100-001",
    name: "Castor Oil",
    image: "/images/castor-oil.jpg",
    description:
      "Thick, traditional botanical oil commonly used in hair and scalp preparations.",
    history:
      "Used in historical grooming and traditional preparations across parts of Africa and Asia for generations.",
    originCountry: "Nigeria",
    benefits: [
      "Popular in traditional hair routines",
      "Rich texture for blending",
      "Common base oil for DIY mixes",
    ],
    prices: { SEK: 400, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Ricinus Communis Seed Oil"],
    productionYear: "2026",
    bestBefore: "2028",
    naturallyGrown: true,
    netContent: "100ml",
    extractionMethod: "Cold-pressed",
  },

  // ✅ Moringa Seed Oil (100ml)
  "oil-moringa-seed": {
    id: "oil-moringa-seed",
    slug: "oil-moringa-seed",
    productCode: "TN-MORI-100-001",
    name: "Moringa Seed Oil",
    image: "/images/moringa-oil.jpg",
    description:
      "Light, fast-absorbing oil rich in oleic acid; used in traditional skin and hair preparations.",
    history:
      "The moringa tree has a long history of traditional use in several regions for household and preparation purposes.",
    originCountry: "Gambia",
    benefits: ["Light feel", "Blends well", "Traditional oil for routines"],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Moringa Oleifera Seed Oil"],
    productionYear: "2026",
    bestBefore: "2028",
    naturallyGrown: true,
    netContent: "100ml",
    extractionMethod: "Cold-pressed",
  },

  // ✅ Palm Kernel Oil (50ml) — SEK 250
  "oil-palm-kernel": {
    id: "oil-palm-kernel",
    slug: "oil-palm-kernel",
    productCode: "TN-PALM-50-001",
    name: "Palm Kernel Oil",
    image: "/images/palm-kernel-oil.jpg",
    description:
      "Traditional West African botanical oil with rich feel; commonly used in soaps and hair butters.",
    history:
      "Centuries-old West African traditional oil, used in household formulations and cultural preparations.",
    originCountry: "Nigeria",
    benefits: ["Rich texture", "Traditional formulation oil", "Heritage staple"],
    prices: { SEK: 250, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Elaeis Guineensis Kernel Oil"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,
    netContent: "50ml",
    extractionMethod: "Traditional / pressed",
  },

  // ✅ Avocado Oil (100ml)
  "oil-avocado": {
    id: "oil-avocado",
    slug: "oil-avocado",
    productCode: "TN-AVOC-100-001",
    name: "Avocado Oil",
    image: "/images/avocado-oil.jpg",
    description:
      "Deeply emollient botanical oil used as a traditional carrier for skin and hair routines.",
    history:
      "Historically used in parts of Central America in household preparations and traditional practices.",
    originCountry: "Kenya",
    benefits: ["Great carrier oil", "Smooth feel", "Blends well"],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Persea Gratissima Oil"],
    productionYear: "2026",
    bestBefore: "2027",
    naturallyGrown: true,
    netContent: "100ml",
    extractionMethod: "Cold-pressed",
  },

  // ✅ Shea Butter (200g) — SEK 350
  "butter-shea": {
    id: "butter-shea",
    slug: "butter-shea",
    productCode: "TN-SHEA-200-001",
    name: "Shea Butter",
    image: "/images/shea-butter.jpg",
    description:
      "Unrefined shea butter with rich, creamy texture. A versatile base for traditional DIY blends and balms.",
    history:
      "Traditional West African botanical butter used for generations in household and cultural preparations.",
    originCountry: "Nigeria",
    benefits: ["Versatile base", "Traditional staple", "Great for DIY blends"],
    prices: { SEK: 350, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Butyrospermum Parkii Butter"],
    productionYear: "2025",
    bestBefore: "2027",
    naturallyGrown: true,
    netContent: "200g",
    extractionMethod: "Unrefined",
  },

  // ✅ Black Seed Oil (50ml) — SEK 200
  "oil-black-seed": {
    id: "oil-black-seed",
    slug: "oil-black-seed",
    productCode: "TN-BLACK-50-001",
    name: "Black Seed Oil",
    image: "/images/black-seed-oil.jpg",
    description:
      "Premium cold-pressed aromatic botanical oil. Used as a carrier oil or concentrated additive in traditional routines.",
    history:
      "A long-used heritage oil across several regions in traditional household and preparation practices.",
    originCountry: "Nigeria",
    benefits: ["Aromatic", "Blends well", "Popular heritage oil"],
    prices: { SEK: 200, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Nigella Sativa Seed Oil"],
    productionYear: "2026",
    bestBefore: "2028",
    naturallyGrown: true,
    netContent: "50ml",
    extractionMethod: "Cold-pressed",
  },

  // ✅ Lavender Oil (30ml) — SEK 150
  "oil-lavender": {
    id: "oil-lavender",
    slug: "oil-lavender",
    productCode: "TN-LAV-30-001",
    name: "Lavender Oil",
    image: "/images/lavender-oil.jpg",
    description:
      "Aromatic botanical oil for traditional craft use and formulation blending.",
    history:
      "Lavender has a long history in household preparations and traditional aromatic use.",
    originCountry: "Nigeria",
    benefits: ["Aromatic", "Blending oil", "Traditional use"],
    prices: { SEK: 150, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Lavandula Angustifolia Oil"],
    productionYear: "2026",
    bestBefore: "2028",
    naturallyGrown: true,
    netContent: "30ml",
    extractionMethod: "Distilled",
  },

  // ✅ Rosemary Oil (30ml) — SEK 150
  "oil-rosemary": {
    id: "oil-rosemary",
    slug: "oil-rosemary",
    productCode: "TN-ROSE-30-001",
    name: "Rosemary Oil",
    image: "/images/rosemary-oil.jpg",
    description:
      "Aromatic botanical oil for traditional craft use and formulation blending.",
    history:
      "Rosemary has been used historically in household preparations and traditional aromatic routines.",
    originCountry: "Nigeria",
    benefits: ["Aromatic", "Blending oil", "Traditional use"],
    prices: { SEK: 150, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Rosmarinus Officinalis Leaf Oil"],
    productionYear: "2026",
    bestBefore: "2028",
    naturallyGrown: true,
    netContent: "30ml",
    extractionMethod: "Distilled",
  },

  // ✅ Mint Oil (30ml) — SEK 150
  "oil-mint": {
    id: "oil-mint",
    slug: "oil-mint",
    productCode: "TN-MINT-30-001",
    name: "Mint Oil",
    image: "/images/mint-oil.jpg",
    description:
      "Aromatic botanical oil used in small amounts for formulation blending and traditional craft routines.",
    history:
      "Mint aromatics have been used across regions for household preparations and traditional aromatic blending.",
    originCountry: "Nigeria",
    benefits: ["Aromatic", "Blending oil", "Traditional use"],
    prices: { SEK: 150, EUR: 0, USD: 0, GBP: 0 },
    ingredients: ["Mentha Piperita Oil"],
    productionYear: "2026",
    bestBefore: "2028",
    naturallyGrown: true,
    netContent: "30ml",
    extractionMethod: "Distilled",
  },

  // ✅ Moringa Balm (50g)
  "moringa-balm": {
    id: "moringa-balm",
    slug: "moringa-balm",
    productCode: "TN-BALM-50-001",
    name: "Moringa Balm",
    image: "/images/moringa-balm.jpg",
    description:
      "Soothing balm with moringa oil and mint for sensitive skin care and relaxation.",
    history:
      "Modern formulation inspired by traditional practices combining ancient routines with contemporary convenience.",
    originCountry: "India",
    benefits: [
      "Calms sensitive and irritated skin",
      "Provides cooling relief",
      "Antioxidant protection",
      "Light, non-greasy moisturization",
    ],
    prices: { SEK: 0, EUR: 0, USD: 0, GBP: 0 },
    ingredients: [
      "Moringa Oleifera Seed Oil",
      "Mentha Piperita Oil",
      "Beeswax",
      "Cocos Nucifera Oil",
    ],
    productionYear: "2026",
    bestBefore: "2028",
    naturallyGrown: true,
    netContent: "50g",
  },
};

export default oilCatalogData;
