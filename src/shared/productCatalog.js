// server/lib/productCatalog.js
// Flat catalog keyed by *id* so backend resolvers can find name/price quickly.
// You can add/adjust prices later; leaving them at 0 keeps Stripe blocked
// (manual methods still work) until you decide real prices.

export const productCatalog = {
  // ───────────────────────────────────────────────
  // COSMETICS → Hair
  // ───────────────────────────────────────────────
  "growth-hair-cream-b27663": {
    name: "Growth Hair Cream",
    price: 0,
    slug: "growth-hair-cream",
    image: "/images/products/placeholder-hair-growth.jpg",
    description:
      "Nourishing cream with biotin and natural oils to strengthen follicles and promote healthy growth.",
    history: [
      "Inspired by traditional scalp butters used across West Africa.",
      "Blends cold-pressed oils with modern actives like biotin.",
      "Formulated to hydrate the scalp barrier and reduce breakage.",
      "Best used on damp hair and protective styles.",
    ],
    ingredients: [
      "Shea butter (Butyrospermum parkii)",
      "Coconut oil (Cocos nucifera)",
      "Castor oil (Ricinus communis)",
      "Sunflower seed oil",
      "Biotin (Vitamin B7)",
      "Aloe leaf juice",
      "Vitamin E (Tocopherol)",
      "Plant-based emulsifiers",
      "Natural fragrance",
    ],
  },
  "scalp-treatment-cream-39109f": {
    name: "Scalp Treatment Cream",
    price: 0,
    slug: "scalp-treatment-cream",
    image: "/images/products/placeholder-scalp.jpg",
    description:
      "Tea tree and aloe help calm irritation and balance flaky, tender scalp.",
    history: [
      "Built from herbal balms used for dry seasons in the Sahel.",
      "Lightweight base absorbs quickly under braids and locs.",
      "Targets itch with natural terpenes from tea tree.",
      "Dermatologist-friendly base oils for frequent use.",
    ],
    ingredients: [
      "Aloe leaf juice",
      "Jojoba oil (Simmondsia chinensis)",
      "Tea tree oil (Melaleuca alternifolia)",
      "Rosemary extract",
      "Glycerin",
      "Vitamin E (Tocopherol)",
      "Plant-based emulsifiers",
      "Water",
    ],
  },
  "curls-hair-cream-9f7de4": {
    name: "Curls Hair Cream",
    price: 0,
    slug: "curls-hair-cream",
    image: "/images/products/placeholder-curls.jpg",
    description:
      "Defines and moisturizes curls with shea and coconut for frizz-free bounce.",
    history: [
      "Built on shea-rich styling butters popular in urban curl culture.",
      "Humectant blend pulls in moisture without heavy residue.",
      "Great for twist-outs and wash-and-go routines.",
    ],
    ingredients: [
      "Shea butter",
      "Coconut oil",
      "Argan oil",
      "Vegetable glycerin",
      "Aloe leaf juice",
      "Xanthan gum",
      "Vitamin E",
      "Natural fragrance",
    ],
  },
  "afro-hair-cream-5dc05e": {
    name: "Afro Hair Cream",
    price: 0,
    slug: "afro-hair-cream",
    image: "/images/products/placeholder-afro.jpg",
    description:
      "Rich, non-greasy formula to hydrate and protect afro-textured hair.",
    history: [
      "Echoes community recipes that rely on unrefined shea butter.",
      "Adds modern lightweight esters for slip and shine.",
      "Designed for daily softness and breakage control.",
    ],
    ingredients: [
      "Unrefined shea butter",
      "Baobab oil (Adansonia digitata)",
      "Sweet almond oil",
      "Vegetable glycerin",
      "Panthenol (Pro-vitamin B5)",
      "Vitamin E",
      "Plant-based emulsifiers",
    ],
  },
  "dreadlock-hair-cream-868670": {
    name: "Dreadlock Hair Cream",
    price: 0,
    slug: "dreadlock-hair-cream",
    image: "/images/products/placeholder-dread.jpg",
    description:
      "Light cream to lock in moisture and maintain neat, healthy locs.",
    history: [
      "Balances hold and moisture to avoid residue in locs.",
      "Plant oils condition while keeping sections tidy.",
      "Ideal between retwists to prevent dryness.",
    ],
    ingredients: [
      "Mango butter",
      "Castor oil",
      "Jojoba oil",
      "Aloe leaf juice",
      "Candelilla wax",
      "Vitamin E",
      "Essential oil blend",
    ],
  },

  // ───────────────────────────────────────────────
  // COSMETICS → Skin
  // ───────────────────────────────────────────────
  "shea-butter-b289b0": {
    name: "Shea Butter",
    price: 0,
    slug: "shea-butter",
    image: "/images/sheabutter01.jpg",
    description:
      "Unrefined, 100% pure shea butter to deeply moisturize and repair dry skin.",
    history: [
      "Harvested from Vitellaria paradoxa nuts across the Sahel.",
      "Women-led cooperatives hand-process and whip the butter.",
      "A centuries-old emollient for face, body, and hair.",
    ],
    ingredients: ["Unrefined shea butter (Butyrospermum parkii)"],
  },
  "neem-oil-76981d": {
    name: "Neem Oil",
    price: 0,
    slug: "neem-oil",
    image: "/images/neemoil.jpg",
    description:
      "Antibacterial oil to help with acne, eczema and fungal flare-ups.",
    history: [
      "Cold-pressed from Azadirachta indica seeds.",
      "Used in Ayurveda and African folk care for skin balance.",
      "Distinct aroma signals potent limonoids at work.",
    ],
    ingredients: ["Cold-pressed neem oil (Azadirachta indica)"],
  },
  "avocado-oil-a7c767": {
    name: "Avocado Oil",
    price: 0,
    slug: "avocado-oil",
    image: "/images/avocadooil.jpg",
    description:
      "Vitamin-rich oil to nourish, brighten and improve elasticity.",
    history: [
      "Expeller-pressed from ripe Hass avocados.",
      "Naturally high in oleic acid for deep moisturisation.",
      "Loved as a carrier oil for facial blends.",
    ],
    ingredients: ["Avocado oil (Persea gratissima)"],
  },
  "tumeric-oil-b09e17": {
    name: "Tumeric Oil",
    price: 0,
    slug: "tumeric-oil",
    image: "/images/tumericoil.jpg",
    description: "Antioxidant oil that supports even tone and glow.",
    history: [
      "Infused with Curcuma longa extracts rich in curcuminoids.",
      "Borrowed from spice-based beauty rituals across the tropics.",
      "Pairs well with gentle exfoliation routines.",
    ],
    ingredients: [
      "Carrier oil (e.g., fractionated coconut oil)",
      "Turmeric extract (Curcuma longa)",
      "Vitamin E",
    ],
  },
  "african-black-soap-raw-123abc": {
    name: "African Black Soap – Raw",
    price: 0,
    slug: "african-black-soap-raw",
    image: "/images/blacksoap01.jpg",
    description: "Traditional raw bar for deep cleansing.",
    history: [
      "Ash from cocoa pods & plantain skins forms the base.",
      "Hand-cooked with shea and palm kernel oils.",
      "Heritage cleanser crafted by small communities.",
    ],
    ingredients: [
      "Cocoa pod ash",
      "Plantain skin ash",
      "Shea butter",
      "Palm kernel oil",
      "Water",
    ],
  },
  "african-black-soap-liquid-456def": {
    name: "African Black Soap – Liquid",
    price: 0,
    slug: "african-black-soap-liquid",
    image: "/images/LiquidSoap01.png",
    description: "Gentle liquid version suitable for family use.",
    history: [
      "Traditional paste diluted and filtered for pump bottles.",
      "Keeps the clarifying feel, easier for showers and sinks.",
    ],
    ingredients: [
      "African black soap base",
      "Water",
      "Glycerin",
      "Preservative (food-safe)",
      "Natural fragrance (optional)",
    ],
  },
  "african-black-soap-original-112233": {
    name: "African Black Soap – Original",
    price: 0,
    slug: "african-black-soap-original",
    image: "/images/BlackSoapOriginal01.png",
    description: "Authentic recipe with a rich, rustic texture.",
    history: [
      "Closer to the village-style bar many grew up with.",
      "Minimal processing to retain natural humectants.",
    ],
    ingredients: [
      "Cocoa pod ash",
      "Plantain skin ash",
      "Shea butter",
      "Palm kernel oil",
      "Water",
    ],
  },
  "baobab-powder-a2d83f": {
    name: "Baobab Powder",
    price: 0,
    slug: "baobab-powder",
    image: "/images/products/baobabPowder.jpg",
    description:
      "Vitamin-C rich fruit powder to fortify smoothies and skin from within.",
    history: [
      "Wild-harvested from Adansonia digitata fruits.",
      "Naturally tangy; used in sauces, drinks and wellness tonics.",
      "Supports community livelihoods in dryland regions.",
    ],
    ingredients: ["100% baobab fruit pulp powder (Adansonia digitata)"],
  },

  // ───────────────────────────────────────────────
  // COSMETICS → Perfume
  // ───────────────────────────────────────────────
  "nordic-mint-essence-437685": {
    name: "Nordic Mint Essence",
    price: 0,
    slug: "nordic-mint-essence",
    image: "/images/mintPerfumes01.jpg",
    description: "Crisp Arctic peppermint with cool forest undertones.",
    history: [
      "Built around high-menthol mint cultivars grown in cool climates.",
      "Clean base designed for everyday freshness.",
    ],
    ingredients: [
      "Alcohol (denat.)",
      "Peppermint essential oil",
      "Natural aroma compounds",
      "Water",
    ],
  },
  "lavender-aurora-mist-c2fe24": {
    name: "Lavender Aurora Mist",
    price: 0,
    slug: "lavender-aurora-mist",
    image: "/images/lavandaPerfume.jpg",
    description: "Lavender fields wrapped in soft florals and Nordic earth.",
    history: [
      "Uses linalool-rich lavender balanced with resin notes.",
      "A calming evening spritz for fabric and skin.",
    ],
    ingredients: [
      "Alcohol (denat.)",
      "Lavender essential oil",
      "Natural aroma compounds",
      "Water",
    ],
  },
  "24h-stainless-roll-on-(unscented)-a725ac": {
    name: "24H Stainless Roll-On (Unscented)",
    price: 0,
    slug: "24h-stainless-roll-on-(unscented)",
    image: "/images/roll-on02.jpg",
    description:
      "Odor-control formula with 24-hour protection — no stains, no perfume.",
    history: [
      "Stainless steel ball for smooth, hygienic application.",
      "Designed for sensitive skin and scent-free workplaces.",
    ],
    ingredients: [
      "Water",
      "Aloe leaf juice",
      "Sodium bicarbonate",
      "Zinc ricinoleate",
      "Xanthan gum",
      "Preservative (skin-safe)",
    ],
  },

  // ───────────────────────────────────────────────
  // FOOD → Tea / Coffee
  // ───────────────────────────────────────────────
  "arctic-sunrise-herbal-blend-257172": {
    name: "Arctic Sunrise Herbal Blend",
    price: 0,
    slug: "arctic-sunrise-herbal-blend",
    image: "/images/tea001.jpg",
    description: "Nordic herbs and citrus peel to energize mornings.",
    history: [
      "Pairs coastal herbs with dried citrus for a bright cup.",
      "Naturally caffeine-free; great as an AM tonic.",
    ],
    ingredients: [
      "Lemon balm",
      "Peppermint",
      "Citrus peel",
      "Hibiscus",
      "Rosehips",
    ],
  },
  "forest-berry-immunity-aedd73": {
    name: "Forest Berry Immunity",
    price: 0,
    slug: "forest-berry-immunity",
    image: "/images/tea01.jpg",
    description: "Berry-forward infusion with hibiscus for winter wellness.",
    history: [
      "Inspired by berry-picking traditions in the north.",
      "Deep ruby brew rich in anthocyanins.",
    ],
    ingredients: [
      "Hibiscus",
      "Elderberry",
      "Blackcurrant",
      "Rosehips",
      "Apple pieces",
    ],
  },
  "organic-coffee-abc123": {
    name: "Organic Coffee",
    price: 0,
    slug: "organic-coffee",
    image: "/images/organicCoffee01.jpg",
    description: "Smooth, aromatic beans from tropical highlands.",
    history: [
      "Shade-grown arabica lots from smallholder farms.",
      "Roasted for balance: cocoa, caramel, gentle fruit.",
    ],
    ingredients: ["100% arabica coffee beans"],
  },

  // ───────────────────────────────────────────────
  // FOOD → Raw Foods & Ingredients (NEW)
  // ───────────────────────────────────────────────
  "raw-yam": {
    name: "Yam (Tubers)",
    price: 0,
    slug: "raw-yam",
    image: "/images/african/yam01.jpg",
    description: "Fresh yam tubers for pounding, frying, or boiling.",
    history: [],
    ingredients: ["Yam tubers"],
  },
  "raw-egusi": {
    name: "Egusi (Melon Seeds)",
    price: 0,
    slug: "raw-egusi",
    image: "/images/african/egusi01.jpg",
    description: "Dehulled melon seeds for classic egusi soups and stews.",
    history: [],
    ingredients: ["Melon seeds (Egusi)"],
  },
  "stock-fish": {
    name: "Stock Fish (Dried Cod)",
    price: 0,
    slug: "stock-fish",
    image: "/images/african/stockFish.jpg",
    description: "Traditional dried fish to enrich soups and sauces.",
    history: [],
    ingredients: ["Dried cod"],
  },
  mackerel: {
    name: "Mackerel",
    price: 0,
    slug: "mackerel",
    image: "/images/african/mackerel.jpg",
    description: "Rich, oily fish—great smoked, grilled, or stewed.",
    history: [],
    ingredients: ["Mackerel"],
  },
  "palm-oil": {
    name: "Palm Oil",
    price: 0,
    slug: "palm-oil",
    image: "/images/african/palmOil.jpg",
    description: "Classic cooking oil for stews and sauces.",
    history: [],
    ingredients: ["Palm oil"],
  },
  plantain: {
    name: "Plantain (Cooking Banana)",
    price: 0,
    slug: "plantain",
    image: "/images/african/plantain01.jpg",
    description: "Firm plantains for frying, boiling, or roasting.",
    history: [],
    ingredients: ["Plantain"],
  },
  "sweet-potato": {
    name: "Sweet Potato",
    price: 0,
    slug: "sweet-potato",
    image: "/images/african/sweetPotato.jpg",
    description: "Naturally sweet tuber for fries, mash, and bakes.",
    history: [],
    ingredients: ["Sweet potato"],
  },
  cocoyam: {
    name: "Cocoyam / Taro",
    price: 0,
    slug: "cocoyam",
    image: "/images/african/cocoYam01.jpg",
    description: "Starchy root used in soups, stews, and fufu blends.",
    history: [],
    ingredients: ["Cocoyam (taro)"],
  },
  "cassava-root": {
    name: "Cassava Root",
    price: 0,
    slug: "cassava-root",
    image: "/images/african/cassava01.jpg",
    description: "Versatile root for gari, fufu, and fries.",
    history: [],
    ingredients: ["Cassava root"],
  },
  "red-palm-oil": {
    name: "Red Palm Oil",
    price: 0,
    slug: "red-palm-oil",
    image: "/images/african/RedPalmOil01.png",
    description: "Rich, vibrant oil ideal for traditional dishes.",
    history: [],
    ingredients: ["Red palm oil"],
  },

  // ───────────────────────────────────────────────
  // FOOD → Oils & Spices
  // ───────────────────────────────────────────────
  "lavender-oil-a6e64a": {
    name: "Lavender Oil",
    price: 0,
    slug: "lavender-oil",
    image: "/images/cosmeticsoils01.jpg",
    description: "Calming essential oil for aromatherapy and skincare.",
    history: [
      "Steam-distilled from flowering tops.",
      "Household staple for relaxation and linen sprays.",
    ],
    ingredients: ["Lavender essential oil (Lavandula angustifolia)"],
  },
  "eucalyptus-citriodora-essential-oil-02c924": {
    name: "Eucalyptus Citriodora Essential Oil",
    price: 0,
    slug: "eucalyptus-citriodora-essential-oil",
    image: "/images/eucalyptusoil.jpg",
    description: "Refreshing lemon-eucalyptus oil; great for steam and rubs.",
    history: [
      "High citronellal content gives a bright, clean scent.",
      "Used in chest rubs and outdoor blends.",
    ],
    ingredients: ["Eucalyptus citriodora essential oil (Corymbia citriodora)"],
  },
  "organic-ginger-powder-0b603f": {
    name: "Organic Ginger Powder",
    price: 0,
    slug: "organic-ginger-powder",
    image: "/images/products/placeholder-ginger.jpg",
    description: "Potent, warming spice for cooking, teas and digestion.",
    history: [
      "Dehydrated and milled rhizomes retain fiery heat.",
      "Adds zing to marinades, bakes and wellness shots.",
    ],
    ingredients: ["100% organic ginger powder (Zingiber officinale)"],
  },
  "turmeric-powder-ced26f": {
    name: "Turmeric Powder",
    price: 0,
    slug: "turmeric-powder",
    image: "/images/products/placeholder-turmeric.jpg",
    description: "Golden spice rich in curcumin for everyday cooking.",
    history: [
      "Sun-dried roots milled to a fine, vibrant powder.",
      "Staple in stews, rice dishes and lattes.",
    ],
    ingredients: ["100% turmeric powder (Curcuma longa)"],
  },

  // ───────────────────────────────────────────────
  // AGRO → Items (bulk)
  // ───────────────────────────────────────────────
  "banana-leaves-035b30": {
    name: "Banana Leaves",
    price: 0,
    slug: "banana-leaves",
    image: "/images/bananaleaves01.jpg",
    description:
      "Fresh green banana leaves for wrapping, cooking or textile craft (bulk).",
    history: [
      "Used from West Africa to Asia as natural food wraps.",
      "Also valued as an eco-textile input and decorative plate liners.",
    ],
    ingredients: ["Banana leaves"],
  },
  "charcoal-(bulk)-4ab139": {
    name: "Charcoal (Bulk)",
    price: 0,
    slug: "charcoal-(bulk)",
    image: "/images/charcoal.jpg",
    description: "High-quality charcoal for BBQ or industrial use.",
    history: [
      "Careful kilning for consistent burn and low smoke.",
      "Bulk logistics arranged on request.",
    ],
    ingredients: ["Hardwood charcoal"],
  },
  "dry-bones-(for-feed)-e2e94e": {
    name: "Dry Bones (for Feed)",
    price: 0,
    slug: "dry-bones-(for-feed)",
    image: "/images/drybones01.jpg",
    description: "Clean, sun-dried bones for animal feed; export available.",
    history: [
      "Processed under hygienic conditions and sun-cured.",
      "Used as calcium-rich input for feed formulations.",
    ],
    ingredients: ["Sun-dried bones"],
  },
  "palm-oil-(bulk)-789ghi": {
    name: "Palm Oil (Bulk)",
    price: 0,
    slug: "palm-oil-(bulk)",
    image: "/images/RedPalmOil01.png",
    description: "Bulk red palm oil — culinary and cosmetic applications.",
    history: [
      "Naturally high in carotenoids giving its deep red hue.",
      "Available in drums/IBCs for manufacturers.",
    ],
    ingredients: ["Red palm oil"],
  },
  "shea-butter-(bulk)-101jkl": {
    name: "Shea Butter (Bulk)",
    price: 0,
    slug: "shea-butter-(bulk)",
    image: "/images/SheaButter04.png",
    description: "Bulk unrefined shea butter for wholesale and cosmetic use.",
    history: [
      "Co-ops aggregate and filter for B2B buyers.",
      "Popular base for balms, soaps and hair butters.",
    ],
    ingredients: ["Unrefined shea butter"],
  },

  // ───────────────────────────────────────────────
  // 🔹 NEW: FOOD → Bakery / Breads
  // ───────────────────────────────────────────────
  "dagman-001": {
    name: "Corn Bread",
    price: 65,
    slug: "dagman-001",
    image: "/images/breads/Dagman001.png",
    description:
      "Rustic daily bread baked for everyday moments — soft crumb, sturdy crust.",
    history: [
      "Inspired by Nordic harvest rituals and farmhouse baking.",
      "Stone-ground grains for depth and nutrition.",
    ],
    ingredients: [
      "Cornmeal",
      "Wheat flour",
      "Water",
      "Yeast",
      "Salt",
      "Sunflower oil",
    ],
  },
  "dagman-002": {
    name: "Melon Seed Bread",
    price: 45,
    slug: "corn-bread-002",
    image: "/images/breads/Dagman002.png",
    description:
      "Hearty, softer loaf that pairs beautifully with soups and stews.",
    history: [
      "Heritage baking meets modern craft for weeknight tables.",
      "Balanced hydration for tenderness without sweetness.",
    ],
    ingredients: [
      "Wheat flour",
      "Ground melon seeds (egusi)",
      "Water",
      "Yeast",
      "Salt",
      "Oil",
    ],
  },
  "crunchy-loaf-natural-scene-01": {
    name: "Tropical Crunchy",
    price: 120,
    slug: "crunchy-loaf-natural-scene-01",
    image: "/images/breads/crunchyLoafNaturalScene01.png",
    description:
      "Crunchy crust with a light, playful note — delightful with spreads. We have the one with nuts, and without nuts",
    history: [
      "A bright counterpoint to traditional Nordic loaves.",
      "Small-batch bake for maximum freshness.",
    ],
    ingredients: [
      "Wheat flour",
      "Water",
      "Yeast",
      "Salt",
      "Seeds or nuts (optional)",
    ],
  },

  // ───────────────────────────────────────────────
  // 🔹 NEW: African Dishes / Plates
  // ───────────────────────────────────────────────
  "fufu-egusi-001": {
    name: "Fufu & Egusi",
    price: 0,
    slug: "fufu-egusi",
    image: "/images/FufuEgusi001.png",
    description:
      "Classic West African combo — soft, stretchy fufu with rich egusi soup.",
    history: [
      "Egusi uses ground melon seeds for a savory, nutty base.",
      "Beloved across Nigeria and neighboring regions.",
    ],
    ingredients: [
      "Cassava fufu flour (or pounded cassava)",
      "Melon seeds (egusi)",
      "Palm oil",
      "Leafy greens",
      "Spices",
      "Salt",
    ],
  },

  // ───────────────────────────────────────────────
  // 🔹 Items to back the Home extra blocks
  // ───────────────────────────────────────────────
  "nordic-harvest-corn-bread": {
    name: "Nordic Harvest Corn Bread",
    price: 0,
    slug: "nordic-harvest-corn-bread",
    image: "/images/cornBread02.jpg",
    description:
      "Rustic cornbread loaf inspired by Nordic harvest kitchens — hearty crumb, golden crust.",
    history: [
      "Baked in small batches with stone-ground grains for a country-style crumb.",
      "Nods to Scandinavian farm baking where seasonal grains defined daily bread.",
      "Delicious with butter, soups, or as a base for open sandwiches.",
    ],
    ingredients: ["Cornmeal", "Wheat flour", "Water", "Yeast", "Salt", "Oil"],
  },
  "hand-knit-wool-scarf": {
    name: "Hand-Knit Wool Scarf",
    price: 0,
    slug: "hand-knit-wool-scarf",
    image: "/images/knitting01.jpg",
    description:
      "Cozy artisan scarf knit with classic Nordic pattern elements and soft wool.",
    history: [
      "Inspired by Scandinavian knitting traditions passed down through generations.",
      "Each piece reflects pattern motifs seen in coastal and mountain communities.",
      "Natural fibers chosen for warmth, breathability and long wear.",
    ],
    // no ingredients for non-food/non-cosmetic textile item
  },
  "cassava-fufu": {
    name: "Cassava Fufu",
    price: 0,
    slug: "cassava-fufu",
    image: "/images/fufu01.jpg",
    description:
      "Classic West African staple made from cassava — smooth, stretchy and perfect with Egusi soup, Vegetable soup, Ogbono/Okro soup and so on.",
    history: [
      "Rooted in West African culinary heritage as a cornerstone starch.",
      "Traditionally pounded; modern milling refines texture for convenience.",
      "Pairs with groundnut, okra, palm-nut(banga soup) and pepper soups.",
    ],
    ingredients: ["Cassava (fermented or parboiled, milled)"],
  },
};

export default productCatalog;
