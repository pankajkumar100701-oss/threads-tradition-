import { local, type Shot } from "./images";

export type Status = "available" | "few-left" | "booked" | "coming-soon";
export type Style = "Bridal" | "Festive" | "Heritage";
export type Gender = "him" | "her" | "unisex";

export type Category = "Pattu" | "Chola" | "Luanchari" | "Koti" | "Shawl" | "Topi" | "Bridal Set" | "Jewellery";

/** The silhouettes the outfit builder and product illustrations can draw. */
export type GarmentType = "Chola" | "Koti" | "Pattu" | "Luanchari";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  gender: Gender;
  colour: string;
  hex: string;
  /** price for the base 2-day rental */
  price: number;
  /** what the outfit would cost to buy, for the rent-vs-buy comparison */
  retail: number;
  /** a photograph of the piece itself (never a person wearing it) */
  shot?: Shot;
  /** garments without a photograph are drawn in their own colour instead */
  figure?: { type: GarmentType; accessories: string[] };
  /** extra real photographs; used for the Detail and Close-up views */
  gallery?: Shot[];
  occasions: OccasionSlug[];
  collections: CollectionSlug[];
  style: Style;
  /** the valley or community the look comes from */
  region: string;
  status: Status;
  sizes: string[];
  fit: string;
  material: string;
  note: string;
  trending?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  /** slugs of accessories that complete the look */
  pairs: string[];
};

export type OccasionSlug = "bride-groom" | "wedding-guest" | "festival" | "nati" | "cultural-event" | "photoshoot";

export type CollectionSlug = "kullu-valley" | "gaddi-chamba" | "kinnaur" | "pahari-byah" | "couple-looks" | "family-byah" | "nati-troupe" | "silver-heirlooms";

const HIM = ["S", "M", "L", "XL", "XXL"];
const HER = ["XS", "S", "M", "L", "XL"];
const FREE = ["Free"];

const MEN_KULLU = ["kullu-topi-acc", "kullu-muffler", "pula"];
const PATTU = ["dhatu", "silver-brooch", "chandrahaar-acc", "pula"];

export const products: Product[] = [
  // ---------------------------------------------------------------- him
  {
    slug: "gaddi-chola-dora-set",
    name: "Gaddi Chola & Dora",
    category: "Chola",
    gender: "him",
    colour: "Ivory",
    hex: "#efe8da",
    price: 1199,
    retail: 14000,
    figure: { type: "Chola", accessories: ["gaddi-topi", "dora", "pula"] },
    gallery: [local("loom-2", 0.5), local("pattu-weave-2", 0.5)],
    occasions: ["bride-groom", "nati", "festival", "cultural-event"],
    collections: ["gaddi-chamba", "couple-looks", "nati-troupe"],
    style: "Heritage",
    region: "Gaddi, Bharmour",
    status: "available",
    sizes: HIM,
    fit: "Long, flared to the calf",
    material: "Undyed handloom wool + black woollen dora",
    note: "The ceremonial chola of the Gaddi shepherds of Bharmour: knee-length, full-skirted and tied at the waist with yards of black dora. Worn with the plumed Gaddi topi for weddings and nati.",
    trending: true,
    rating: 4.9,
    reviewCount: 47,
    pairs: ["gaddi-topi", "dora", "pula"],
  },
  {
    slug: "kullvi-koti-set",
    name: "Kullvi Koti & Churidar Set",
    category: "Koti",
    gender: "him",
    colour: "Charcoal",
    hex: "#3a3935",
    price: 799,
    retail: 7500,
    figure: { type: "Koti", accessories: ["kullu-topi-acc", "kullu-muffler"] },
    gallery: [local("pattu-weave-2", 0.5), local("kullu-topi-stack", 0.5)],
    occasions: ["wedding-guest", "festival", "nati", "cultural-event"],
    collections: ["kullu-valley", "family-byah", "nati-troupe"],
    style: "Festive",
    region: "Kullu",
    status: "available",
    sizes: HIM,
    fit: "Koti over a long kurta, slim churidar",
    material: "Kullu tweed koti with woven border, cotton kurta",
    note: "The look of every Kullu Dussehra and village nati: a sleeveless woollen koti over a white kurta and churidar. Add a Kullu topi and muffler and you're dressed for the whole mela.",
    trending: true,
    rating: 4.8,
    reviewCount: 136,
    pairs: MEN_KULLU,
  },
  {
    slug: "pahari-dulha-set",
    name: "Pahari Dulha Set",
    category: "Bridal Set",
    gender: "him",
    colour: "Cream",
    hex: "#ece0c6",
    price: 2199,
    retail: 28000,
    figure: { type: "Chola", accessories: ["kullu-topi-acc", "sehra", "kullu-muffler", "pula"] },
    gallery: [local("pattu-weave-1", 0.5), local("joth-pin", 0.5)],
    occasions: ["bride-groom"],
    collections: ["pahari-byah", "couple-looks"],
    style: "Bridal",
    region: "Mandi & Kullu",
    status: "available",
    sizes: HIM,
    fit: "Long coat, churidar, topi and sehra",
    material: "Wool-silk coat with Kullu border, cotton churidar",
    note: "A Pahari groom's full look for the byah: a cream long coat edged with a Kullu border, white churidar, a red-flapped topi and the sehra. Includes a free studio fitting.",
    isNew: true,
    rating: 5,
    reviewCount: 18,
    pairs: ["sehra", "kullu-topi-acc", "kullu-muffler", "pula"],
  },
  // ------------------------------------------------------------- unisex
  {
    slug: "kullu-topi",
    name: "Kullu Topi",
    category: "Topi",
    gender: "unisex",
    colour: "Green",
    hex: "#2d6a45",
    price: 199,
    retail: 1200,
    shot: local("kullu-topi-stack", 0.5),
    gallery: [local("joth-pin", 0.5)],
    occasions: ["bride-groom", "wedding-guest", "festival", "nati", "cultural-event"],
    collections: ["kullu-valley", "family-byah", "nati-troupe"],
    style: "Festive",
    region: "Kullu",
    status: "available",
    sizes: ["57", "58", "59", "60"],
    fit: "Snug",
    material: "Wool with velvet patterned flap",
    note: "The round Himachali cap with a patterned velvet flap. Hosts notice it, so bring one for every guest coming up from the plains. Order in bulk for a troupe.",
    rating: 4.8,
    reviewCount: 212,
    pairs: ["silver-brooch"],
  },
  {
    slug: "kinnauri-thepang",
    name: "Kinnauri Thepang",
    category: "Topi",
    gender: "unisex",
    colour: "Green",
    hex: "#1f5e45",
    price: 249,
    retail: 1800,
    shot: local("kinnauri-bridal-cap", 0.5),
    gallery: [local("kullu-topi-stack", 0.5)],
    occasions: ["bride-groom", "festival", "photoshoot", "cultural-event"],
    collections: ["kinnaur"],
    style: "Heritage",
    region: "Kinnaur",
    status: "available",
    sizes: ["56", "57", "58", "59"],
    fit: "Tall crown, folded green flap",
    material: "Grey wool with green velvet band",
    note: "The Kinnauri cap with its folded green velvet band, worn by men and women alike. For a wedding it comes dressed as the bridal kir-kir thepang, crowned with flowers.",
    rating: 4.9,
    reviewCount: 39,
    pairs: ["kinnauri-earrings-acc"],
  },
  {
    slug: "kullu-shawl",
    name: "Kullu Handloom Shawl",
    category: "Shawl",
    gender: "unisex",
    colour: "Rose",
    hex: "#a8325a",
    price: 499,
    retail: 6500,
    shot: local("pattu-weave-2", 0.5),
    gallery: [local("pattu-weave-1", 0.5), local("loom-1", 0.6)],
    occasions: ["wedding-guest", "festival", "photoshoot"],
    collections: ["kullu-valley", "family-byah"],
    style: "Heritage",
    region: "Kullu",
    status: "available",
    sizes: FREE,
    fit: "Free size, 2 m",
    material: "Handloom wool, Kullu weave",
    note: "Woven on a pit loom in the Kullu valley with the geometric border the region is known for: diamonds, steps and crosses in bright wool.",
    trending: true,
    rating: 4.9,
    reviewCount: 88,
    pairs: ["kullu-topi-acc", "silver-brooch"],
  },
  // ---------------------------------------------------------------- her
  {
    slug: "kullvi-pattu-set",
    name: "Kullvi Pattu & Dhatu Set",
    category: "Pattu",
    gender: "her",
    colour: "Black & Red",
    hex: "#3b1b1d",
    price: 999,
    retail: 14000,
    shot: local("pattu-drying", 0.5, 0.3),
    gallery: [local("pattu-weave-1", 0.5), local("digra-brooch", 0.5)],
    occasions: ["wedding-guest", "festival", "nati", "cultural-event", "photoshoot"],
    collections: ["kullu-valley", "couple-looks", "family-byah", "nati-troupe"],
    style: "Festive",
    region: "Kullu",
    status: "few-left",
    sizes: FREE,
    fit: "Wrapped, pinned at both shoulders, gachchi at the waist",
    material: "Handloom wool pattu, cotton dhatu",
    note: "The Kullvi pattu: a handloom wool wrap with bright woven borders, pinned at the shoulders with silver and belted with a gachchi. Comes with a matching dhatu headscarf.",
    trending: true,
    rating: 4.9,
    reviewCount: 74,
    pairs: PATTU,
  },
  {
    slug: "teal-pattu",
    name: "Teal Pattu with Kullu Border",
    category: "Pattu",
    gender: "her",
    colour: "Teal",
    hex: "#1f6f7a",
    price: 899,
    retail: 12000,
    shot: local("pattu-loom-teal", 0.5),
    gallery: [local("loom-1", 0.5), local("digra-brooch", 0.5)],
    occasions: ["wedding-guest", "festival", "photoshoot"],
    collections: ["kullu-valley", "family-byah"],
    style: "Heritage",
    region: "Kullu & Mandi",
    status: "available",
    sizes: FREE,
    fit: "Wrapped over a kurta, belted",
    material: "Handloom wool with red and gold woven border",
    note: "Deep teal wool with a red selvedge and a Kullu border of diamonds and steps, photographed here on the loom it was woven on. Warm enough to skip the coat.",
    rating: 4.8,
    reviewCount: 31,
    pairs: PATTU,
  },
  {
    slug: "pahari-dulhan-set",
    name: "Pahari Dulhan Set",
    category: "Bridal Set",
    gender: "her",
    colour: "Red",
    hex: "#b0202e",
    price: 2499,
    retail: 32000,
    figure: { type: "Pattu", accessories: ["dhatu", "silver-brooch", "chandrahaar-acc", "nath"] },
    gallery: [local("chandrahaar-bridal", 0.5), local("pattu-weave-1", 0.5)],
    occasions: ["bride-groom"],
    collections: ["pahari-byah", "couple-looks", "silver-heirlooms"],
    style: "Bridal",
    region: "Kullu & Mandi",
    status: "available",
    sizes: HER,
    fit: "Pattu wrap, kurta, dhatu and silver",
    material: "Handloom wool + silk dhatu",
    note: "A complete Pahari bride's look: a red-bordered pattu over a silk kurta, a printed dhatu tied at the nape, and the chandrahaar and silver to finish. Includes a studio fitting.",
    trending: true,
    rating: 5,
    reviewCount: 26,
    pairs: ["chandrahaar-acc", "chak", "nath", "hansli", "silver-brooch"],
  },
  {
    slug: "kinnauri-dohru-set",
    name: "Kinnauri Dohru & Thepang Set",
    category: "Bridal Set",
    gender: "her",
    colour: "Red",
    hex: "#9f1d2a",
    price: 1999,
    retail: 26000,
    figure: { type: "Pattu", accessories: ["kinnauri-earrings-acc", "chandrahaar-acc", "hansli"] },
    gallery: [local("kinnauri-bridal-cap", 0.5), local("kinnauri-earrings", 0.5)],
    occasions: ["bride-groom", "festival", "photoshoot"],
    collections: ["kinnaur", "pahari-byah", "silver-heirlooms"],
    style: "Bridal",
    region: "Kinnaur",
    status: "available",
    sizes: FREE,
    fit: "Dohru wrap, choli, shawl and thepang",
    material: "Handloom wool with Kinnauri border",
    note: "The Kinnauri bride's layered look: a dohru wrap, a richly patterned shawl, the green-banded thepang and gold-and-silver jewellery.",
    isNew: true,
    rating: 5,
    reviewCount: 21,
    pairs: ["kinnauri-earrings-acc", "chandrahaar-acc", "hansli"],
  },
  {
    slug: "gaddi-luanchari-set",
    name: "Gaddi Luanchari Set",
    category: "Luanchari",
    gender: "her",
    colour: "Teal",
    hex: "#2f7f79",
    price: 1199,
    retail: 15000,
    figure: { type: "Luanchari", accessories: ["dora", "nath", "chak", "hansli"] },
    gallery: [local("hansuli", 0.55), local("dogra-nath", 0.5)],
    occasions: ["bride-groom", "nati", "festival", "cultural-event"],
    collections: ["gaddi-chamba", "couple-looks", "nati-troupe"],
    style: "Heritage",
    region: "Gaddi, Chamba",
    status: "available",
    sizes: HER,
    fit: "Full-skirted luanchari, dora at the waist",
    material: "Printed cotton panels, woollen dora",
    note: "The Gaddi woman's luanchari: a long frock with dozens of panels in the skirt that flare when she dances, cinched with a dora and worn with a dupatta and silver.",
    trending: true,
    rating: 4.8,
    reviewCount: 43,
    pairs: ["dora", "nath", "chak", "hansli"],
  },
  {
    slug: "red-luanchari-set",
    name: "Red Nati Luanchari",
    category: "Luanchari",
    gender: "her",
    colour: "Red",
    hex: "#c4283a",
    price: 999,
    retail: 11000,
    figure: { type: "Luanchari", accessories: ["dora", "chak"] },
    gallery: [local("maang-teeka", 0.5), local("pattu-weave-2", 0.5)],
    occasions: ["nati", "cultural-event", "festival"],
    collections: ["gaddi-chamba", "nati-troupe"],
    style: "Festive",
    region: "Chamba & Kangra",
    status: "available",
    sizes: [...HER, "Kids"],
    fit: "Full skirt, elasticated waist for quick changes",
    material: "Cotton with gota border",
    note: "A bright red luanchari cut for the stage: twirls well, survives a three-hour programme and comes in matching sets of up to 20 for school and college troupes.",
    rating: 4.7,
    reviewCount: 58,
    pairs: ["dora", "chak", "nath"],
  },
  // ------------------------------------------------------------ jewellery
  {
    slug: "chandrahaar-set",
    name: "Chandrahaar Necklace",
    category: "Jewellery",
    gender: "her",
    colour: "Silver",
    hex: "#c9c9cf",
    price: 799,
    retail: 25000,
    shot: local("chandrahaar-bridal", 0.45),
    gallery: [local("chandrahaar", 0.45), local("kinnauri-silver", 0.5)],
    occasions: ["bride-groom", "festival", "photoshoot"],
    collections: ["silver-heirlooms", "pahari-byah"],
    style: "Bridal",
    region: "Kinnaur & Kullu",
    status: "available",
    sizes: FREE,
    fit: "Adjustable",
    material: "Silver with gold-plated plates",
    note: "Tiered silver chains strung between engraved plates. The statement piece of a Himachali bride.",
    rating: 4.8,
    reviewCount: 34,
    pairs: ["kinnauri-earrings-acc", "hansli"],
  },
  {
    slug: "gur-shanglang",
    name: "Gur Shanglang Waist Ornament",
    category: "Jewellery",
    gender: "her",
    colour: "Silver",
    hex: "#bfc0c6",
    price: 699,
    retail: 22000,
    shot: local("gur-shanglang", 0.5),
    occasions: ["bride-groom", "festival", "photoshoot"],
    collections: ["silver-heirlooms", "kinnaur"],
    style: "Bridal",
    region: "Kinnaur",
    status: "few-left",
    sizes: FREE,
    fit: "Hangs from the waist, adjustable hook",
    material: "Silver plates and chains",
    note: "The Kinnauri waist ornament: engraved silver plates with long swags of chain, worn over the dohru on the wedding day.",
    isNew: true,
    rating: 4.9,
    reviewCount: 9,
    pairs: ["chandrahaar-acc", "kinnauri-earrings-acc"],
  },
  {
    slug: "kinnauri-matha-patti",
    name: "Kinnauri Matha Patti",
    category: "Jewellery",
    gender: "her",
    colour: "Silver",
    hex: "#c4c5cb",
    price: 599,
    retail: 18000,
    shot: local("matha-patti", 0.5),
    gallery: [local("kinnauri-silver", 0.5)],
    occasions: ["bride-groom", "photoshoot"],
    collections: ["silver-heirlooms", "kinnaur", "pahari-byah"],
    style: "Bridal",
    region: "Kinnaur",
    status: "available",
    sizes: FREE,
    fit: "Adjustable chain, pins into the hair",
    material: "Silver with coloured stones",
    note: "The Kinnauri bride's head jewellery: silver plates set with stones and edged with tiny bells, worn across the forehead under the thepang.",
    isNew: true,
    rating: 4.9,
    reviewCount: 11,
    pairs: ["kinnauri-earrings-acc", "chandrahaar-acc"],
  },
  {
    slug: "moti-jantar-mala",
    name: "Moti Jantar Mala",
    category: "Jewellery",
    gender: "her",
    colour: "Coral",
    hex: "#c7372f",
    price: 399,
    retail: 9000,
    shot: local("jantar-mala", 0.5),
    occasions: ["bride-groom", "festival", "wedding-guest"],
    collections: ["silver-heirlooms", "kinnaur"],
    style: "Heritage",
    region: "Kinnaur",
    status: "available",
    sizes: FREE,
    fit: "Long, 28 inches",
    material: "Coral and pearl beads, silver jantar amulet",
    note: "Strands of coral and pearl beads with a square silver jantar amulet. Light enough for a long mela day, bright enough to lift a plain pattu.",
    rating: 4.7,
    reviewCount: 16,
    pairs: ["kinnauri-earrings-acc"],
  },
  {
    slug: "kinnauri-gold-set",
    name: "Kinnauri Gold Jewellery Set",
    category: "Jewellery",
    gender: "her",
    colour: "Gold",
    hex: "#d4a937",
    price: 1199,
    retail: 32000,
    shot: local("kinnauri-gold", 0.5),
    gallery: [local("kinnauri-earrings", 0.5)],
    occasions: ["bride-groom", "festival"],
    collections: ["silver-heirlooms", "kinnaur"],
    style: "Bridal",
    region: "Kinnaur",
    status: "coming-soon",
    sizes: FREE,
    fit: "Set of 6 pieces",
    material: "Gold-plated silver",
    note: "Traditional Kinnauri hair and neck ornaments with matching earrings. Arriving for the winter wedding season.",
    rating: 4.9,
    reviewCount: 0,
    pairs: [],
  },
];

export type Accessory = {
  slug: string;
  name: string;
  price: number;
  icon: AccessoryIcon;
  for: Gender;
};

export type AccessoryIcon =
  | "mojari"
  | "watch"
  | "brooch"
  | "stole"
  | "turban"
  | "pocket"
  | "cufflinks"
  | "oxfords"
  | "jhumka"
  | "tikka"
  | "bangles"
  | "necklace"
  | "potli"
  | "clutch"
  | "heels"
  | "earrings"
  | "cap";

export const accessories: Accessory[] = [
  { slug: "gaddi-topi", name: "Plumed Gaddi Topi", price: 249, icon: "cap", for: "him" },
  { slug: "sehra", name: "Sehra", price: 299, icon: "turban", for: "him" },
  { slug: "kullu-muffler", name: "Kullu Muffler", price: 149, icon: "stole", for: "him" },
  { slug: "kullu-topi-acc", name: "Kullu Topi", price: 149, icon: "cap", for: "unisex" },
  { slug: "dora", name: "Woollen Dora", price: 99, icon: "stole", for: "unisex" },
  { slug: "pula", name: "Pula Slippers", price: 99, icon: "mojari", for: "unisex" },
  { slug: "silver-brooch", name: "Silver Pattu Brooch", price: 149, icon: "brooch", for: "unisex" },
  { slug: "chamba-rumal", name: "Chamba Rumal", price: 199, icon: "pocket", for: "unisex" },
  { slug: "dhatu", name: "Dhatu Headscarf", price: 99, icon: "stole", for: "her" },
  { slug: "chandrahaar-acc", name: "Chandrahaar", price: 349, icon: "necklace", for: "her" },
  { slug: "hansli", name: "Silver Hansli", price: 249, icon: "necklace", for: "her" },
  { slug: "chak", name: "Chak Head Ornament", price: 199, icon: "tikka", for: "her" },
  { slug: "nath", name: "Pahari Nath", price: 199, icon: "earrings", for: "her" },
  { slug: "kinnauri-earrings-acc", name: "Kinnauri Earrings", price: 199, icon: "jhumka", for: "her" },
  { slug: "silver-kangan", name: "Silver Kangan", price: 149, icon: "bangles", for: "her" },
];

export type Occasion = { slug: OccasionSlug; name: string; line: string; image: Shot };

export const occasions: Occasion[] = [
  { slug: "bride-groom", name: "Pahari Byah", line: "The bride, the groom and the sehra", image: { ...local("kinnauri-bridal-cap", 0.5), slot: "occasion-wedding" } },
  { slug: "wedding-guest", name: "Wedding Guest", line: "Topi, pattu and a warm shawl", image: local("kullu-topi-stack", 0.5) },
  { slug: "festival", name: "Dussehra & Melas", line: "Kullu Dussehra, Minjar, Lavi, Shivratri", image: { ...local("pattu-drying", 0.5, 0.3), slot: "occasion-festival" } },
  { slug: "nati", name: "Nati & Folk Dance", line: "Matching sets that twirl", image: { ...local("pattu-weave-1", 0.5), slot: "occasion-party" } },
  { slug: "cultural-event", name: "School & College Functions", line: "Himachal Day, annual days and fests", image: local("pattu-weave-2", 0.5) },
  { slug: "photoshoot", name: "Heritage Photoshoot", line: "Pattu against the peaks", image: { ...local("pattu-loom-teal", 0.5), slot: "occasion-photoshoot" } },
];

export type Collection = {
  slug: CollectionSlug;
  title: string;
  kicker: string;
  line: string;
  story: string;
  image: Shot;
  special?: boolean;
};

export const collections: Collection[] = [
  {
    slug: "kullu-valley",
    title: "Kullu Valley",
    kicker: "Kullu · Mandi",
    line: "Pattu, koti, topi and handloom shawls",
    story: "The dress of the Kullu valley: handloom pattus pinned with silver, tweed kotis, patterned topis and shawls woven on pit looms in the villages above the Beas.",
    image: { ...local("pattu-drying", 0.5, 0.3), slot: "collection-kullu" },
  },
  {
    slug: "gaddi-chamba",
    title: "Gaddi & Chamba",
    kicker: "Bharmour · Chamba",
    line: "Chola, dora and luanchari",
    story: "The shepherd community of the Dhauladhars dresses for celebration in undyed wool cholas bound with black dora, and luancharis whose skirts flare when they dance.",
    image: { ...local("chamba-rumal-figures", 0.5), slot: "collection-gaddi" },
  },
  {
    slug: "kinnaur",
    title: "Kinnaur",
    kicker: "The high valleys",
    line: "Dohru, thepang and silver",
    story: "From the apple orchards of Kinnaur: layered dohrus, the green-banded bridal thepang, matha pattis and the region's famous silver.",
    image: { ...local("kinnauri-bridal-cap", 0.5), slot: "collection-kinnaur" },
  },
  {
    slug: "pahari-byah",
    title: "Pahari Byah",
    kicker: "Wedding",
    line: "Dulha and dulhan sets, styled head to toe",
    story: "Everything for a Himachali wedding: the groom's long coat and sehra, the bride's pattu, dhatu and chandrahaar, and coordinated looks for the family.",
    image: { ...local("chandrahaar-bridal", 0.4), slot: "collection-byah" },
  },
  {
    slug: "couple-looks",
    title: "Couple Looks",
    kicker: "His + Hers",
    line: "Coordinated pairs for two",
    story: "Gaddi with Gaddi, Kullvi with Kullvi: pairs styled together so they look right side by side in every photograph.",
    image: local("pattu-loom-teal", 0.5),
    special: true,
  },
  {
    slug: "family-byah",
    title: "Family Byah",
    kicker: "Parents · Siblings · Guests",
    line: "Topis and pattus for the whole family",
    story: "One palette for the whole family. Book up to twelve outfits together, topis for every guest included, delivered in one trip.",
    image: local("kullu-topi-stack", 0.5),
    special: true,
  },
  {
    slug: "nati-troupe",
    title: "Nati Troupe",
    kicker: "Groups of 8 to 20",
    line: "Matching sets for the stage",
    story: "School annual days, college fests, Himachal Day and mela stages: matching chola, luanchari, koti and pattu sets in every size, delivered and collected as one booking.",
    image: local("pattu-weave-1", 0.5),
    special: true,
  },
  {
    slug: "silver-heirlooms",
    title: "Silver Heirlooms",
    kicker: "Jewellery",
    line: "Chandrahaar, gur shanglang and Kinnauri gold",
    story: "Pieces that are usually passed down rather than bought: tiered chandrahaars, Kinnauri waist ornaments and gold-plated hair jewellery, insured on every rental.",
    image: local("chandrahaar", 0.45),
    special: true,
  },
];

export type Look = {
  slug: string;
  name: string;
  main: string;
  accessories: string[];
  image: Shot;
};

export const featuredLook: Look = {
  slug: "kullvi-pattu",
  name: "The Kullvi Pattu Look",
  main: "kullvi-pattu-set",
  accessories: ["silver-brooch", "chandrahaar-acc", "kullu-topi-acc", "pula"],
  image: local("pattu-drying", 0.5, 0.3),
};

export type CoupleLook = { name: string; his: string; hers: string; line: string };

export const coupleLooks: CoupleLook[] = [
  { name: "Valley Vows", his: "gaddi-chola-dora-set", hers: "gaddi-luanchari-set", line: "A Gaddi wedding pair from the Chamba hills." },
  { name: "The Byah Pair", his: "pahari-dulha-set", hers: "pahari-dulhan-set", line: "Cream and red, with a Kullu border on both." },
  { name: "Dussehra Day", his: "kullvi-koti-set", hers: "kullvi-pattu-set", line: "Koti and pattu for the Dhalpur maidan." },
];

export type Review = {
  name: string;
  city: string;
  outfit: string;
  quote: string;
  fit: number;
  quality: number;
  packaging: number;
  overall: number;
};

export const reviews: Review[] = [
  { name: "Aarav M.", city: "Shimla", outfit: "pahari-dulha-set", quote: "The coat looked even better in person. My mother asked twice if we'd had it made.", fit: 5, quality: 5, packaging: 5, overall: 5 },
  { name: "Riya K.", city: "Chandigarh", outfit: "kullvi-pattu-set", quote: "The pattu was real handloom wool, heavy and warm. It arrived with the brooches already pinned.", fit: 4, quality: 5, packaging: 5, overall: 5 },
  { name: "Tenzin D.", city: "Manali", outfit: "kullu-shawl", quote: "Rented shawls and topis for our whole family for my sister's wedding. Every single one was perfect.", fit: 5, quality: 5, packaging: 4, overall: 5 },
  { name: "Neha T.", city: "Dharamshala", outfit: "red-luanchari-set", quote: "Sixteen luancharis for our college nati, all in the right sizes, collected the next morning.", fit: 5, quality: 4, packaging: 5, overall: 5 },
  { name: "Sonam N.", city: "Reckong Peo", outfit: "kinnauri-dohru-set", quote: "A proper Kinnauri dohru, not a costume. My nani approved, and that's the highest bar.", fit: 4, quality: 5, packaging: 5, overall: 5 },
  { name: "Kabir A.", city: "Chamba", outfit: "gaddi-chola-dora-set", quote: "Hard to find a proper Gaddi chola in the city. This one was the real thing, dora and all.", fit: 5, quality: 5, packaging: 5, overall: 5 },
];

export type Post = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  minutes: number;
  image: Shot;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "what-to-wear-to-a-himachali-wedding",
    title: "What to wear to a Himachali wedding",
    dek: "Wool, silver and colour. A guest's guide to dressing for a byah in the hills.",
    category: "Guides",
    minutes: 6,
    image: { ...local("chandrahaar-bridal", 0.4), slot: "journal-editorial" },
    body: [
      "Himachali weddings run on mountain time: long, cold and very warm-hearted. Plan for altitude first and fashion second. Even in October the evening baraat can drop close to freezing, so the best outfits are the ones that layer.",
      "For men, the easiest choice is a Kullu topi with a koti over a kurta and churidar. The topi is a mark of respect as much as an accessory, and hosts notice it. For family members, the long woollen chola with a black dora at the waist is the ceremonial choice.",
      "For women, the pattu (a handloom wool wrap pinned at the shoulder) is warm, striking and very local. Wear it over a kurta, add a dhatu and silver jewellery like the chandrahaar, and you won't need a coat.",
      "Colour is welcome. Kullu borders mix red, yellow, green, blue and black in one band, so there's no need to play it safe. The only real rule: avoid all-white, which is still associated with mourning in many villages.",
      "Finally, think about shoes. Courtyards are stone and dance floors are often earth. Choose flat, closed footwear, or pula slippers if you want to go fully traditional.",
    ],
  },
  {
    slug: "how-to-drape-a-pattu",
    title: "How to drape a Kullvi pattu",
    dek: "Two pins, one gachchi and five minutes. A step-by-step for first-timers.",
    category: "Styling",
    minutes: 5,
    image: local("pattu-drying", 0.5, 0.3),
    body: [
      "A pattu is a single rectangle of handloom wool, usually about two and a half metres long. Everything about the look comes from how it is wrapped and pinned.",
      "Start over a full-sleeved kurta or blouse. Hold the pattu lengthwise behind you, bring both ends forward under the arms, and cross the left side over the right so the woven border runs down the front edge.",
      "Lift the top corners over each shoulder and fasten them with the silver brooches. The pins should sit just below the collarbone, not on top of the shoulder, or the pattu will slide back as you move.",
      "Tie the gachchi (a woven sash) firmly at the waist. This is what gives the pattu its shape, so pull it tighter than feels natural and tuck the ends in.",
      "Finish with the dhatu tied at the nape of the neck, and a chandrahaar if it's a wedding. Our pattus arrive pre-folded with the brooches already in place, so the first time is easier than it sounds.",
    ],
  },
  {
    slug: "dressing-for-kullu-dussehra",
    title: "Dressing for Kullu Dussehra",
    dek: "A week of devtas, music and the Dhalpur maidan. What the valley wears, and what to borrow.",
    category: "Culture",
    minutes: 6,
    image: { ...local("kullu-topi-stack", 0.5), slot: "journal-culture" },
    body: [
      "Kullu Dussehra begins when Dussehra ends elsewhere. For a week, hundreds of village devtas are carried down to the Dhalpur maidan in palanquins, accompanied by drums, horns and their villages in their best clothes.",
      "Men wear the Kullu topi above all else, usually with a koti or a woollen coat over a kurta. On the procession days you will see topis in every colour, but green and maroon flaps are the most common.",
      "Women wear the pattu, often in black, red or ivory with bright borders, along with a dhatu and as much silver as the family owns. Evenings at the cultural programme are colder than you expect, so a Kullu shawl over the pattu is never a mistake.",
      "Visiting? A topi and shawl are enough to show respect without dressing up as someone else. If you're joining a family for the procession, ask first and then go all in.",
    ],
  },
  {
    slug: "nati-costumes-for-school-and-college",
    title: "Nati costumes for school and college functions",
    dek: "Planning a troupe of twelve? A checklist for sizing, matching and getting everything back on time.",
    category: "Guides",
    minutes: 5,
    image: local("pattu-weave-2", 0.5),
    body: [
      "The nati is the dance of Himachal, and every annual day, Himachal Day and college fest seems to have one. Getting a whole troupe dressed is mostly a logistics problem.",
      "Pick one look per row. Luancharis or pattus for the women, kotis or cholas for the men, and the same topi for everyone. Matching topis do more for a troupe than anything else on stage.",
      "Collect sizes early. Send a simple form with height and chest or bust in inches, and add a few spare sizes. Our Nati Troupe booking takes the whole list at once and packs each outfit with the dancer's name on the bag.",
      "Rehearse in costume at least once. Luanchari skirts flare more than you think and chola dora ties loosen with spinning, so you will want to adjust before the real show.",
      "Plan the return. We collect from the venue the morning after, so there's no need to gather twenty bags at midnight.",
    ],
  },
  {
    slug: "traditional-himachali-fashion",
    title: "Traditional Himachali fashion, explained",
    dek: "From the Kullu shawl to the Chamba rumal: the craft behind the clothes.",
    category: "Culture",
    minutes: 7,
    image: local("chamba-rumal", 0.5),
    body: [
      "Himachali dress grew out of cold winters and handlooms. Nearly everything is wool, and nearly everything carries a border.",
      "The Kullu shawl is the best-known example. Its geometric bands of diamonds, steps and crosses were traditionally woven from local sheep's wool, with the patterns passed down through families of weavers.",
      "Men's wear centres on the topi, a round cap with a coloured velvet flap, and the koti or chola. In Kinnaur the cap becomes the tall thepang; among the Gaddis it carries a plume.",
      "Women's wear includes the pattu, a thick woollen wrap pinned with silver, the Kinnauri dohru, the Gaddi luanchari and the dhatu, a headscarf tied at the back of the neck. Jewellery is mostly silver: chandrahaar necklaces, chak head ornaments and heavy hanslis.",
      "Our pieces are sourced from weaving cooperatives in Kullu, Mandi and Chamba, and a share of every rental goes back to the weavers.",
    ],
  },
  {
    slug: "kinnauri-silver-piece-by-piece",
    title: "Kinnauri silver, piece by piece",
    dek: "Chandrahaar, gur shanglang and the earrings that hang to the shoulder.",
    category: "Culture",
    minutes: 4,
    image: local("kinnauri-silver", 0.5),
    body: [
      "A Kinnauri bride's jewellery is a family's savings worn in public. Much of it is silver, some is gold-plated, and almost all of it is inherited.",
      "The chandrahaar is the centrepiece: rows of fine silver chain strung between engraved plates, falling well below the collarbone.",
      "The gur shanglang hangs from the waist over the dohru, a set of plates and chains that chimes as the bride walks. Earrings are long, often reaching the shoulder, with domed bells at the end.",
      "Every piece we rent is insured and checked by a silversmith between rentals, so you can wear it the way it's meant to be worn: all at once.",
    ],
  },
];

export const faqs = [
  { q: "How does rental work?", a: "Pick an outfit, choose your size and dates, and we deliver it a day before your event. Wear it, then return it the day after in the bag it came in. Cleaning is included." },
  { q: "What if the outfit doesn't fit?", a: "Tell us within 3 hours of delivery. We send a different size free of charge if one is available, or give a full refund. Every outfit also has seam allowance for minor adjustments." },
  { q: "Can I book costumes for a whole troupe?", a: "Yes. The Nati Troupe collection rents matching sets for groups of 8 to 20, with kids' sizes for school functions. Use the code NATI20 for 20% off when you add 8 or more outfits, and we deliver and collect from the venue." },
  { q: "Is the deposit refundable?", a: "Yes. The ₹1,000 security deposit is refunded in full within 48 hours of your return, once the outfit passes inspection." },
  { q: "What happens if I damage it?", a: "Small stains, loose threads and minor wear are on us. For larger damage we deduct repair costs from the deposit. Add Rental Protection (₹199) to cover accidental damage up to ₹5,000." },
  { q: "Can I extend my rental?", a: "Yes. Go to My Rentals and choose Extend. We check availability straight away and, if the outfit's free, you can add 2 or more days." },
  { q: "How do I return it?", a: "Pack the outfit in the Threads & Tradition garment bag and schedule a pickup, or drop it at our studio. Please don't wash or iron it. We handle that." },
  { q: "How are woollens cleaned?", a: "Handloom wool is hand-washed or dry-cleaned according to the weave, aired, steamed, inspected under light and sealed in a breathable garment bag with neem leaves against moths." },
];

export const PROMO_CODES: Record<string, { label: string; percent: number; minItems?: number }> = {
  FIRSTLOOK10: { label: "10% off your first rental", percent: 10 },
  BYAH15: { label: "15% off family wedding bookings", percent: 15 },
  NATI20: { label: "20% off troupe bookings of 8+ outfits", percent: 20, minItems: 8 },
};

export const DELIVERY_FEE = 99;
export const DEPOSIT = 1000;
export const PROTECTION_FEE = 199;

export const getProduct = (slug: string) => products.find((x) => x.slug === slug);
export const getAccessory = (slug: string) => accessories.find((x) => x.slug === slug);
export const getCollection = (slug: string) => collections.find((x) => x.slug === slug);
export const getOccasion = (slug: string) => occasions.find((x) => x.slug === slug);
export const getPost = (slug: string) => posts.find((x) => x.slug === slug);

export const CATEGORIES = Array.from(new Set(products.map((x) => x.category)));
export const COLOURS = Array.from(new Map(products.map((x) => [x.colour, x.hex])).entries()).map(([name, hex]) => ({ name, hex }));
export const STYLES: Style[] = ["Bridal", "Festive", "Heritage"];

export type MoodSlug = "byah" | "festival" | "nati" | "cultural-event" | "photoshoot";

export const MOODS: { slug: MoodSlug; label: string; match: (p: Product) => boolean }[] = [
  { slug: "byah", label: "Pahari Byah", match: (p) => p.occasions.some((o) => o === "bride-groom" || o === "wedding-guest") },
  { slug: "festival", label: "Dussehra & Melas", match: (p) => p.occasions.includes("festival") },
  { slug: "nati", label: "Nati & Folk Dance", match: (p) => p.occasions.includes("nati") },
  { slug: "cultural-event", label: "School & College", match: (p) => p.occasions.includes("cultural-event") },
  { slug: "photoshoot", label: "Heritage Shoot", match: (p) => p.occasions.includes("photoshoot") },
];
