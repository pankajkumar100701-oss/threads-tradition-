import { products, type Product, type Gender } from "./data";

/* ---------------------------------------------------------------- dates */

/** Rendered on the server and during hydration so markup matches; the client swaps in the real date after. */
export const ANCHOR_DAY = "2026-10-06";

export function realToday(): string {
  const d = new Date();
  return toISO(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
}

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const parse = (iso: string) => new Date(iso + "T00:00:00Z");

/** True for a real calendar date in YYYY-MM-DD form (URL params are user-editable). */
export function isISODate(v: string | null | undefined): v is string {
  return !!v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(parse(v).getTime()) && toISO(parse(v)) === v;
}

export function addDays(iso: string, n: number): string {
  const d = parse(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}

export function diffDays(a: string, b: string): number {
  return Math.round((parse(b).getTime() - parse(a).getTime()) / 86_400_000);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function fmt(iso: string): string {
  const d = parse(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function fmtLong(iso: string): string {
  const d = parse(iso);
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function monthLabel(year: number, month: number): string {
  return `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month]} ${year}`;
}

export function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // weeks start Monday
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let i = 1; i <= days; i++) cells.push(toISO(new Date(Date.UTC(year, month, i))));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export const ymd = (iso: string) => {
  const d = parse(iso);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() };
};

/** The outfit is held from the start date through the end date (start + days). Delivery is the day before, pickup the day after. */
export function rentalWindow(start: string, days: number) {
  const end = addDays(start, days);
  return { start, end, delivery: addDays(start, -1), pickup: addDays(end, 1) };
}

export function heldDates(start: string, days: number): string[] {
  return Array.from({ length: days + 1 }, (_, i) => addDays(start, i));
}

/* -------------------------------------------------------------- pricing */

export const PERIODS = [2, 3, 5, 7] as const;
const MULTIPLIER: Record<number, number> = { 2: 1, 3: 1.334, 5: 1.867, 7: 2.4 };

/** Round to the nearest price ending in 99. */
export const toNine = (n: number) => Math.max(99, Math.round(n / 100) * 100 - 1);

export function rentalPrice(base: number, days: number): number {
  if (days === 2) return base;
  const m = MULTIPLIER[days] ?? 1 + (days - 2) * 0.28;
  return toNine(base * m);
}

export function extensionPrice(base: number, extraDays: number): number {
  return toNine(base * 0.534 * (extraDays / 2));
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

/* --------------------------------------------------------- availability */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Day offsets from today that are already booked. Deterministic per product, so every visitor sees the same calendar. */
function reservedOffsets(p: Product): number[] {
  const out: number[] = [];
  if (p.status === "booked") for (let i = 0; i <= 21; i++) out.push(i);
  if (p.status === "coming-soon") for (let i = 0; i <= 25; i++) out.push(i);
  // Demo case: the red luanchari is booked from the third day of the default window.
  if (p.slug === "red-luanchari-set") out.push(8, 9, 10);
  const h = hash(p.slug);
  for (let k = 0; k < 4; k++) {
    const start = 12 + ((h >>> (k * 7)) % 70);
    const len = 2 + ((h >>> (k * 5 + 3)) % 3);
    for (let i = 0; i < len; i++) out.push(start + i);
  }
  return out;
}

export function reservedDates(p: Product, today: string): Set<string> {
  return new Set(reservedOffsets(p).map((o) => addDays(today, o)));
}

export function isRentable(p: Product, start: string, days: number, today: string): boolean {
  if (diffDays(today, start) < 1) return false;
  const reserved = reservedDates(p, today);
  return heldDates(start, days).every((d) => !reserved.has(d));
}

export function firstConflict(p: Product, start: string, days: number, today: string): string | null {
  const reserved = reservedDates(p, today);
  return heldDates(start, days).find((d) => reserved.has(d)) ?? null;
}

export function similarProducts(p: Product, count = 4): Product[] {
  return products
    .filter((x) => x.slug !== p.slug)
    .map((x) => {
      let score = 0;
      if (x.category === p.category) score += 3;
      if (x.gender === p.gender || x.gender === "unisex") score += 2;
      score += x.occasions.filter((o) => p.occasions.includes(o)).length * 2;
      score += x.collections.filter((c) => p.collections.includes(c)).length;
      if (x.colour === p.colour) score += 1;
      if (x.status === "coming-soon" || x.status === "booked") score -= 3;
      return { x, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.x);
}

export function availableAlternatives(p: Product, start: string, days: number, today: string, count = 4): Product[] {
  return similarProducts(p, 12)
    .filter((x) => isRentable(x, start, days, today))
    .slice(0, count);
}

/* --------------------------------------------------------------- search */

const STOP = new Set(["a", "an", "the", "for", "to", "of", "and", "with", "outfit", "outfits", "look", "looks", "wear", "something", "in", "my", "i", "need"]);

const SYNONYMS: Record<string, (p: Product) => boolean> = {
  wedding: (p) => p.occasions.some((o) => o === "wedding-guest" || o === "bride-groom"),
  byah: (p) => SYNONYMS.wedding(p),
  shaadi: (p) => SYNONYMS.wedding(p),
  vivah: (p) => SYNONYMS.wedding(p),
  dance: (p) => p.occasions.includes("nati"),
  stage: (p) => p.occasions.includes("nati") || p.occasions.includes("cultural-event"),
  troupe: (p) => p.collections.includes("nati-troupe"),
  group: (p) => p.collections.includes("nati-troupe"),
  school: (p) => p.occasions.includes("cultural-event"),
  college: (p) => p.occasions.includes("cultural-event"),
  function: (p) => p.occasions.includes("cultural-event"),
  kids: (p) => p.sizes.includes("Kids"),
  children: (p) => p.sizes.includes("Kids"),
  shoot: (p) => p.occasions.includes("photoshoot"),
  photoshoot: (p) => p.occasions.includes("photoshoot"),
  mela: (p) => p.occasions.includes("festival"),
  dussehra: (p) => p.occasions.includes("festival"),
  festival: (p) => p.occasions.includes("festival"),
  festive: (p) => p.occasions.includes("festival"),
  traditional: () => true,
  pahari: () => true,
  himachali: () => true,
  himachal: () => true,
  culture: () => true,
  men: (p) => p.gender !== "her",
  man: (p) => p.gender !== "her",
  him: (p) => p.gender !== "her",
  groom: (p) => p.gender !== "her" && p.occasions.includes("bride-groom"),
  dulha: (p) => p.gender !== "her" && p.occasions.includes("bride-groom"),
  women: (p) => p.gender !== "him",
  woman: (p) => p.gender !== "him",
  her: (p) => p.gender !== "him",
  bride: (p) => p.gender !== "him" && p.occasions.includes("bride-groom"),
  bridal: (p) => p.gender !== "him" && p.occasions.includes("bride-groom"),
  dulhan: (p) => p.gender !== "him" && p.occasions.includes("bride-groom"),
  cheap: (p) => p.price < 1000,
  budget: (p) => p.price < 1000,
  cap: (p) => p.category === "Topi",
  hat: (p) => p.category === "Topi",
  jacket: (p) => p.category === "Koti",
  sadri: (p) => p.category === "Koti",
  coat: (p) => p.category === "Chola" || p.slug === "pahari-dulha-set",
  frock: (p) => p.category === "Luanchari",
  skirt: (p) => p.category === "Luanchari",
  wrap: (p) => p.category === "Pattu" || p.category === "Shawl",
  dohru: (p) => p.slug === "kinnauri-dohru-set",
  dhatu: (p) => p.category === "Pattu" || p.slug === "pahari-dulhan-set",
  jewellery: (p) => p.category === "Jewellery",
  jewelry: (p) => p.category === "Jewellery",
  silver: (p) => p.category === "Jewellery" && p.colour === "Silver",
  white: (p) => p.colour === "Ivory" || p.colour === "Cream",
  black: (p) => p.colour.includes("Black") || p.colour === "Charcoal",
  spiti: (p) => p.region.includes("Spiti"),
};

function haystack(p: Product): string {
  return [p.name, p.category, p.colour, p.style, p.region, p.material, p.gender === "him" ? "men" : p.gender === "her" ? "women" : "unisex", ...p.occasions, ...p.collections]
    .join(" ")
    .toLowerCase();
}

function tokenMatches(p: Product, token: string): boolean {
  const syn = SYNONYMS[token] ?? SYNONYMS[token.replace(/s$/, "")];
  if (syn && syn(p)) return true;
  const hay = haystack(p);
  if (hay.includes(token)) return true;
  const singular = token.replace(/(es|s)$/, "");
  return singular.length > 2 && hay.includes(singular);
}

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

/** All tokens must match; if nothing matches everything, fall back to the best partial matches. */
export function searchProducts(q: string, pool: Product[] = products): Product[] {
  const tokens = tokenize(q);
  if (!tokens.length) return pool;
  const scored = pool.map((p) => {
    const hits = tokens.filter((t) => tokenMatches(p, t)).length;
    const nameHits = tokens.filter((t) => p.name.toLowerCase().includes(t)).length;
    return { p, hits, score: hits * 10 + nameHits * 3 + (p.trending ? 1 : 0) };
  });
  const full = scored.filter((s) => s.hits === tokens.length);
  const use = full.length ? full : scored.filter((s) => s.hits > 0);
  return use.sort((a, b) => b.score - a.score).map((s) => s.p);
}

/* ----------------------------------------------------------- size finder */

export type SizeInput = { gender: Exclude<Gender, "unisex">; height: number; weight: number; chest: number; waist: number };

export function recommendSize(i: SizeInput): { size: string; why: string } {
  const him = ["S", "M", "L", "XL", "XXL"];
  const her = ["XS", "S", "M", "L", "XL"];
  const scale = i.gender === "him" ? him : her;
  // chest/bust in inches
  const chestCuts = i.gender === "him" ? [37, 39.5, 42, 45] : [32, 34, 36.5, 39];
  const waistCuts = i.gender === "him" ? [30, 32.5, 35, 38] : [26, 28, 30.5, 33];
  const idx = (v: number, cuts: number[]) => {
    const k = cuts.findIndex((c) => v <= c);
    return k === -1 ? cuts.length : k;
  };
  const c = idx(i.chest, chestCuts);
  const w = idx(i.waist, waistCuts);
  let k = Math.max(c, w);
  const bmi = i.weight / Math.pow(i.height / 100, 2);
  let why = c >= w ? "Based mainly on your chest measurement" : "Based mainly on your waist measurement";
  if (i.height >= (i.gender === "him" ? 186 : 175) && k < scale.length - 1) {
    k += 1;
    why += ", sized up one for length";
  } else if (bmi < 19 && k > 0 && Math.abs(c - w) >= 1) {
    k -= 1;
    why += ", sized down for a slimmer build";
  }
  return { size: scale[Math.min(k, scale.length - 1)], why: why + "." };
}

export function bookingId(): string {
  return "TT-" + String(10000 + Math.floor(Math.random() * 89999));
}

/* -------------------------------------------------------------- delivery */

export type DeliveryCheck = { ok: boolean; zone: string; message: string };

/** Rough delivery zones by PIN prefix: express in Himachal, courier elsewhere. */
export function checkPincode(pin: string, start: string, today: string): DeliveryCheck {
  if (!/^[1-8]\d{5}$/.test(pin)) return { ok: false, zone: "", message: "Enter a valid 6-digit PIN code." };
  const lead = diffDays(today, start);
  const p3 = Number(pin.slice(0, 3));
  if (p3 >= 171 && p3 <= 177) return { ok: true, zone: "Himachal Express", message: `Hand-delivered by our team on ${fmtLong(addDays(start, -1))}. Free pickup after.` };
  if (p3 === 160 || (p3 >= 140 && p3 <= 152) || (p3 >= 110 && p3 <= 136)) {
    const by = addDays(start, -2);
    return lead >= 3
      ? { ok: true, zone: "North India Courier", message: `Courier delivery by ${fmtLong(by)}, with a prepaid return label.` }
      : { ok: false, zone: "North India Courier", message: "Courier needs 3 days. Choose a later start date, or pick up from our Shimla studio." };
  }
  return lead >= 5
    ? { ok: true, zone: "Pan-India Courier", message: `Courier delivery by ${fmtLong(addDays(start, -3))}. Book 5+ days ahead for safety.` }
    : { ok: false, zone: "Pan-India Courier", message: "Outside North India we need at least 5 days. Choose a later start date." };
}
