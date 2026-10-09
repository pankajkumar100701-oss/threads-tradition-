"use client";

import { useSyncExternalStore } from "react";
import { DEPOSIT, DELIVERY_FEE, PROMO_CODES, PROTECTION_FEE, getAccessory, getProduct } from "./data";
import { ANCHOR_DAY, addDays, bookingId, extensionPrice, isISODate, realToday, rentalPrice, rentalWindow, toNine } from "./rental";

export type BagItem = {
  key: string;
  slug: string;
  size: string;
  start: string;
  days: number;
  accessories: string[];
  /** set when the item was added as a bundled look; bundled looks get 6% off */
  look?: string;
};

export type Fulfilment = "delivery" | "pickup";

export type Totals = {
  outfits: number;
  accessories: number;
  lookSavings: number;
  discount: number;
  delivery: number;
  protection: number;
  deposit: number;
  total: number;
};

export type Rental = {
  id: string;
  items: BagItem[];
  placedAt: string;
  fulfilment: Fulfilment;
  address?: string;
  protection: boolean;
  promo?: string;
  totals: Totals;
  extensions: { days: number; price: number }[];
};

export type Plan = { start?: string; days: number; occasion?: string };

export type State = {
  bag: BagItem[];
  wishlist: string[];
  recent: string[];
  compare: string[];
  rentals: Rental[];
  plan: Plan;
  addresses: string[];
  profile: Profile;
  appointments: Appointment[];
};

export type Appointment = { id: string; studio: string; date: string; time: string; outfits: string[]; name: string; phone: string; people: number };

export type Profile = { name: string; email: string; phone: string };

const KEY = "threads-tradition:v3";

const EMPTY: State = { bag: [], wishlist: [], recent: [], compare: [], rentals: [], plan: { days: 2 }, addresses: [], profile: { name: "", email: "", phone: "" }, appointments: [] };

function seed(today: string): State {
  const upcoming: BagItem = { key: "seed-1", slug: "pahari-dulha-set", size: "L", start: addDays(today, 6), days: 2, accessories: ["sehra", "kullu-topi-acc"] };
  const active: BagItem = { key: "seed-2", slug: "kullu-shawl", size: "Free", start: addDays(today, -2), days: 2, accessories: [] };
  const mk = (id: string, item: BagItem, placed: string): Rental => ({
    id,
    items: [item],
    placedAt: placed,
    fulfilment: "delivery",
    address: "14 Mall Road, Shimla 171001",
    protection: false,
    totals: computeTotals([item], { fulfilment: "delivery", protection: false }),
    extensions: [],
  });
  return {
    ...EMPTY,
    addresses: ["14 Mall Road, Shimla 171001"],
    profile: { name: "Guest", email: "", phone: "" },
    wishlist: ["gaddi-chola-dora-set", "kinnauri-dohru-set", "kullvi-pattu-set", "kullu-shawl"],
    rentals: [mk("TT-10482", upcoming, addDays(today, -1)), mk("TT-10391", active, addDays(today, -9))],
  };
}

let state: State = EMPTY;
let loaded = false;

const arr = <T,>(v: unknown, ok: (x: T) => boolean = () => true): T[] => (Array.isArray(v) ? (v as T[]).filter(ok) : []);
const validItem = (b: BagItem) => !!b && isISODate(b.start) && Number.isInteger(b.days) && b.days > 0 && !!getProduct(b.slug);

/** Saved data can be stale or hand-edited: drop anything that no longer matches the catalogue so pages never crash on it. */
function sanitize(raw: Partial<State>): State {
  const fixItem = (b: BagItem) => ({ ...b, accessories: arr<string>(b.accessories) });
  return {
    bag: arr<BagItem>(raw.bag, validItem).map(fixItem),
    wishlist: arr<string>(raw.wishlist, (x) => !!getProduct(x)),
    recent: arr<string>(raw.recent, (x) => !!getProduct(x)),
    compare: arr<string>(raw.compare, (x) => !!getProduct(x)).slice(0, 3),
    rentals: arr<Rental>(raw.rentals, (r) => !!r && Array.isArray(r.items) && r.items.length > 0 && r.items.every(validItem) && !!r.totals).map((r) => ({
      ...r,
      items: r.items.map(fixItem),
      extensions: arr(r.extensions),
    })),
    plan: { ...EMPTY.plan, ...(raw.plan ?? {}) },
    addresses: arr<string>(raw.addresses, (x) => typeof x === "string"),
    profile: { ...EMPTY.profile, ...(raw.profile ?? {}) },
    appointments: arr<Appointment>(raw.appointments, (a) => !!a && isISODate(a.date)),
  };
}
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      state = sanitize(JSON.parse(raw) as Partial<State>);
    } else {
      state = seed(realToday());
      persist();
    }
  } catch {
    state = seed(realToday());
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode); state still lives in memory for this visit
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      state = sanitize(JSON.parse(e.newValue) as Partial<State>);
      emit();
    } catch {}
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

const getServerSnapshot = () => EMPTY;

export function useRente(): State {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noop = () => () => {};

/** Today's date. Uses a fixed anchor during server render and hydration so markup matches. */
export function useToday(): string {
  return useSyncExternalStore(noop, realToday, () => ANCHOR_DAY);
}

/** False during server render and hydration; true once client state is readable. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

function update(fn: (s: State) => State) {
  load();
  state = fn(state);
  persist();
  emit();
}

/* -------------------------------------------------------------- totals */

export function itemPrice(item: BagItem) {
  const p = getProduct(item.slug);
  const outfit = p ? rentalPrice(p.price, item.days) : 0;
  const acc = item.accessories.reduce((sum, a) => sum + (getAccessory(a)?.price ?? 0), 0);
  const savings = item.look ? outfit + acc - toNine((outfit + acc) * 0.94) : 0;
  return { outfit, acc, savings };
}

export function computeTotals(items: BagItem[], opts: { fulfilment: Fulfilment; protection: boolean; promo?: string }): Totals {
  let outfits = 0;
  let accessories = 0;
  let lookSavings = 0;
  for (const it of items) {
    const p = itemPrice(it);
    outfits += p.outfit;
    accessories += p.acc;
    lookSavings += p.savings;
  }
  const code = opts.promo ? PROMO_CODES[opts.promo] : undefined;
  const promo = code && items.length >= (code.minItems ?? 1) ? code : undefined;
  const discount = promo ? Math.round(((outfits + accessories - lookSavings) * promo.percent) / 100) : 0;
  const delivery = items.length && opts.fulfilment === "delivery" ? DELIVERY_FEE : 0;
  const protection = items.length && opts.protection ? PROTECTION_FEE * items.length : 0;
  const deposit = items.length ? DEPOSIT : 0;
  return {
    outfits,
    accessories,
    lookSavings,
    discount,
    delivery,
    protection,
    deposit,
    total: outfits + accessories - lookSavings - discount + delivery + protection + deposit,
  };
}

export type RentalPhase = "upcoming" | "active" | "returned";

export function rentalPhase(r: Rental, today: string): RentalPhase {
  const item = r.items[0];
  const extra = r.extensions.reduce((s, e) => s + e.days, 0);
  const w = rentalWindow(item.start, item.days + extra);
  if (today < w.delivery) return "upcoming";
  if (today <= w.pickup) return "active";
  return "returned";
}

/* ------------------------------------------------------------- actions */

let counter = 0;
const uid = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

export const rente = {
  addToBag(item: Omit<BagItem, "key">) {
    update((s) => ({ ...s, bag: [...s.bag, { ...item, key: uid() }] }));
  },
  updateBagItem(key: string, patch: Partial<BagItem>) {
    update((s) => ({ ...s, bag: s.bag.map((b) => (b.key === key ? { ...b, ...patch } : b)) }));
  },
  removeFromBag(key: string) {
    update((s) => ({ ...s, bag: s.bag.filter((b) => b.key !== key) }));
  },
  toggleWishlist(slug: string) {
    update((s) => ({
      ...s,
      wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((x) => x !== slug) : [slug, ...s.wishlist],
    }));
  },
  viewed(slug: string) {
    update((s) => (s.recent[0] === slug ? s : { ...s, recent: [slug, ...s.recent.filter((x) => x !== slug)].slice(0, 8) }));
  },
  /** Returns false when the compare tray is full. */
  toggleCompare(slug: string): boolean {
    let ok = true;
    update((s) => {
      if (s.compare.includes(slug)) return { ...s, compare: s.compare.filter((x) => x !== slug) };
      if (s.compare.length >= 3) {
        ok = false;
        return s;
      }
      return { ...s, compare: [...s.compare, slug] };
    });
    return ok;
  },
  clearCompare() {
    update((s) => ({ ...s, compare: [] }));
  },
  setPlan(plan: Partial<Plan>) {
    update((s) => ({ ...s, plan: { ...s.plan, ...plan } }));
  },
  /** Returns the booking id, or null when the bag is empty (e.g. a double-clicked checkout). */
  placeOrder(opts: { fulfilment: Fulfilment; address?: string; protection: boolean; promo?: string; today: string }): string | null {
    load();
    if (!state.bag.length) return null;
    const id = bookingId();
    update((s) => ({
      ...s,
      addresses: opts.address && !s.addresses.includes(opts.address) ? [opts.address, ...s.addresses] : s.addresses,
      bag: [],
      rentals: [
        {
          id,
          items: s.bag,
          placedAt: opts.today,
          fulfilment: opts.fulfilment,
          address: opts.address,
          protection: opts.protection,
          promo: opts.promo,
          totals: computeTotals(s.bag, opts),
          extensions: [],
        },
        ...s.rentals,
      ],
    }));
    return id;
  },
  extendRental(id: string, days: number) {
    update((s) => ({
      ...s,
      rentals: s.rentals.map((r) => {
        if (r.id !== id) return r;
        const base = getProduct(r.items[0].slug)?.price ?? 0;
        return { ...r, extensions: [...r.extensions, { days, price: extensionPrice(base, days) }] };
      }),
    }));
  },
  saveAddress(address: string) {
    update((s) => (s.addresses.includes(address) ? s : { ...s, addresses: [address, ...s.addresses] }));
  },
  removeAddress(address: string) {
    update((s) => ({ ...s, addresses: s.addresses.filter((a) => a !== address) }));
  },
  bookAppointment(a: Omit<Appointment, "id">): string {
    const id = "ST-" + String(1000 + Math.floor(Math.random() * 8999));
    update((s) => ({ ...s, appointments: [...s.appointments, { ...a, id }].sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time)) }));
    return id;
  },
  cancelAppointment(id: string) {
    update((s) => ({ ...s, appointments: s.appointments.filter((a) => a.id !== id) }));
  },
  saveProfile(profile: Profile) {
    update((s) => ({ ...s, profile }));
  },
  resetDemo() {
    update(() => seed(realToday()));
  },
};
