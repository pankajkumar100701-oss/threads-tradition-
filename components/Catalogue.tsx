"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, COLOURS, MOODS, STYLES, getCollection, getOccasion, occasions, products, type Product, type Status } from "@/lib/data";
import { usePlan } from "@/lib/plan";
import { PERIODS, fmt, isISODate, isRentable, rentalWindow, searchProducts } from "@/lib/rental";
import Link from "next/link";
import { local } from "@/lib/images";
import { ProductCard } from "./ProductCard";
import { Photo } from "./ui/Photo";
import { CloseIcon, SearchIcon } from "./ui/Icons";
import { Modal } from "./ui/Modal";

const PRICES = [
  { key: "u1", label: "Under ₹1,000", test: (p: number) => p < 1000 },
  { key: "1-2", label: "₹1,000 – ₹2,000", test: (p: number) => p >= 1000 && p < 2000 },
  { key: "2+", label: "₹2,000+", test: (p: number) => p >= 2000 },
];
const SIZES = ["Kids", "XS", "S", "M", "L", "XL", "XXL", "Free"];
const STATUSES: [Status, string][] = [
  ["available", "Available"],
  ["few-left", "Few Left"],
  ["booked", "Booked"],
  ["coming-soon", "Coming Soon"],
];
const SORTS = [
  ["recommended", "Recommended"],
  ["popular", "Most Loved"],
  ["new", "New Arrivals"],
  ["low", "Price: Low to High"],
  ["high", "Price: High to Low"],
] as const;

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function Catalogue({ fixed }: { fixed?: { collection?: string } }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const plan = usePlan();
  const [drawer, setDrawer] = useState(false);
  const [draftQ, setDraftQ] = useState(params.get("q") ?? "");

  const q = params.get("q") ?? "";
  const mood = params.get("mood");
  const forWho = params.get("for");
  const collection = fixed?.collection ?? params.get("collection");
  const f = {
    category: list(params.get("category")),
    size: list(params.get("size")),
    colour: list(params.get("colour")),
    price: list(params.get("price")),
    occasion: list(params.get("occasion")),
    style: list(params.get("style")),
    status: list(params.get("status")),
  };
  const avail = params.get("avail") === "1";
  const sort = params.get("sort") ?? "recommended";
  const startParam = params.get("start");
  const start = isISODate(startParam) && startParam > plan.today ? startParam : plan.start;
  const daysParam = Number(params.get("days"));
  const days = (PERIODS as readonly number[]).includes(daysParam) ? daysParam : plan.days;
  const w = rentalWindow(start, days);

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const toggle = (key: keyof typeof f, v: string) => {
    const cur = f[key];
    set(key, (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]).join(",") || null);
  };
  const clearAll = () => router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });

  let pool: Product[] = q ? searchProducts(q) : products;
  if (collection) pool = pool.filter((p) => p.collections.includes(collection as Product["collections"][number]));
  if (forWho === "men") pool = pool.filter((p) => p.gender !== "her");
  if (forWho === "women") pool = pool.filter((p) => p.gender !== "him");
  if (mood) {
    const m = MOODS.find((x) => x.slug === mood);
    if (m) pool = pool.filter(m.match);
  }
  const result = pool.filter(
    (p) =>
      (!f.category.length || f.category.includes(p.category)) &&
      (!f.size.length || p.sizes.some((s) => f.size.includes(s))) &&
      (!f.colour.length || f.colour.includes(p.colour)) &&
      (!f.price.length || PRICES.some((r) => f.price.includes(r.key) && r.test(p.price))) &&
      (!f.occasion.length || p.occasions.some((o) => f.occasion.includes(o))) &&
      (!f.style.length || f.style.includes(p.style)) &&
      (!f.status.length || f.status.includes(p.status)) &&
      (!avail || isRentable(p, start, days, plan.today)),
  );
  const sorted = [...result];
  if (sort === "low") sorted.sort((a, b) => a.price - b.price);
  if (sort === "high") sorted.sort((a, b) => b.price - a.price);
  if (sort === "new") sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  if (sort === "popular") sorted.sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating);

  const title = q ? `“${q}”` : forWho === "men" ? "Menswear" : forWho === "women" ? "Womenswear" : mood ? MOODS.find((m) => m.slug === mood)?.label : f.occasion.length === 1 ? getOccasion(f.occasion[0])?.name : collection && !fixed ? getCollection(collection)?.title : "All Outfits";

  const activeChips: [string, string, () => void][] = [
    ...(forWho ? [["For", forWho === "men" ? "Men" : "Women", () => set("for", null)] as [string, string, () => void]] : []),
    ...(mood ? [["Occasion", MOODS.find((m) => m.slug === mood)?.label ?? mood, () => set("mood", null)] as [string, string, () => void]] : []),
    ...(Object.keys(f) as (keyof typeof f)[]).flatMap((k) =>
      f[k].map(
        (v) =>
          [k, k === "occasion" ? (getOccasion(v)?.name ?? v) : k === "price" ? (PRICES.find((x) => x.key === v)?.label ?? v) : k === "status" ? (STATUSES.find((s) => s[0] === v)?.[1] ?? v) : v, () => toggle(k, v)] as [
            string,
            string,
            () => void,
          ],
      ),
    ),
    ...(avail ? [["Dates", `${fmt(w.start)} → ${fmt(w.end)}`, () => set("avail", null)] as [string, string, () => void]] : []),
  ];

  const filters = (
    <div className="space-y-9">
      <Group title="Availability">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" checked={avail} onChange={(e) => set("avail", e.target.checked ? "1" : null)} className="mt-0.5 h-4 w-4 accent-[var(--ink)]" />
          <span>
            Available {fmt(w.start)} → {fmt(w.end)}
            <span className="block text-xs text-muted">Change dates on any outfit page</span>
          </span>
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {STATUSES.map(([s, label]) => (
            <Pill key={s} on={f.status.includes(s)} onClick={() => toggle("status", s)}>
              {label}
            </Pill>
          ))}
        </div>
      </Group>
      <Group title="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Pill key={c} on={f.category.includes(c)} onClick={() => toggle("category", c)}>
              {c}
            </Pill>
          ))}
        </div>
      </Group>
      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <Pill key={s} on={f.size.includes(s)} onClick={() => toggle("size", s)}>
              {s}
            </Pill>
          ))}
        </div>
      </Group>
      <Group title="Colour">
        <div className="flex flex-wrap gap-2.5">
          {COLOURS.map((c) => (
            <button
              key={c.name}
              onClick={() => toggle("colour", c.name)}
              aria-pressed={f.colour.includes(c.name)}
              title={c.name}
              aria-label={c.name}
              className={`h-8 w-8 rounded-full border transition ${f.colour.includes(c.name) ? "ring-2 ring-ink ring-offset-2 ring-offset-ivory" : "border-ink/15 hover:scale-110"}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </Group>
      <Group title="Price · 2 days">
        <div className="space-y-2">
          {PRICES.map((r) => (
            <label key={r.key} className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={f.price.includes(r.key)} onChange={() => toggle("price", r.key)} className="h-4 w-4 accent-[var(--ink)]" />
              {r.label}
            </label>
          ))}
        </div>
      </Group>
      <Group title="Occasion">
        <div className="flex flex-wrap gap-2">
          {occasions.map((o) => (
            <Pill key={o.slug} on={f.occasion.includes(o.slug)} onClick={() => toggle("occasion", o.slug)}>
              {o.name}
            </Pill>
          ))}
        </div>
      </Group>
      <Group title="Style">
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <Pill key={s} on={f.style.includes(s)} onClick={() => toggle("style", s)}>
              {s}
            </Pill>
          ))}
        </div>
      </Group>
    </div>
  );

  return (
    <div className="shell pb-24">
      {!fixed && (
        <div className="pb-10 pt-32 md:pt-40">
          <p className="eyebrow text-gold">{q ? "Search" : "Outfits"}</p>
          <h1 className="display mt-3 text-[clamp(3rem,7vw,6rem)] leading-none">{title}</h1>
          <form
            className="mt-8 flex max-w-xl items-center gap-3 border-b border-ink/30 focus-within:border-ink"
            onSubmit={(e) => {
              e.preventDefault();
              set("q", draftQ.trim() || null);
            }}
          >
            <SearchIcon size={20} />
            <label htmlFor="cat-q" className="sr-only">
              Search outfits
            </label>
            <input id="cat-q" value={draftQ} onChange={(e) => setDraftQ(e.target.value)} placeholder="Search: gaddi chola, red pattu, nati…" className="h-12 flex-1 bg-transparent outline-none placeholder:text-muted/60" />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setDraftQ("");
                  set("q", null);
                }}
                className="text-xs uppercase tracking-[0.14em] text-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </form>
          <DepartmentTabs current={forWho} onPick={(v) => set("for", v)} />
        </div>
      )}

      <div className="sticky top-[72px] z-30 -mx-4 mb-8 flex items-center justify-between gap-4 border-y border-line bg-ivory/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="text-sm">
          <span className="font-semibold">{sorted.length}</span> <span className="text-muted">{sorted.length === 1 ? "outfit" : "outfits"}</span>
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="sr-only">
            Sort
          </label>
          <select id="sort" value={sort} onChange={(e) => set("sort", e.target.value === "recommended" ? null : e.target.value)} className="h-10 border border-line bg-paper px-3 text-sm outline-none focus:border-ink">
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <button onClick={() => setDrawer(true)} className="chip h-10 bg-paper lg:hidden">
            Filters {activeChips.length > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-paper">{activeChips.length}</span>}
          </button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {activeChips.map(([k, label, remove]) => (
            <button key={k + label} onClick={remove} className="chip h-9 bg-paper text-xs">
              {label} <CloseIcon size={12} />
            </button>
          ))}
          <button onClick={clearAll} className="link-u ml-2 text-xs font-semibold uppercase tracking-[0.14em]">
            Clear all
          </button>
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto pb-10 pr-2">{filters}</div>
        </aside>
        <div>
          {sorted.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-5 md:grid-cols-3">
              {sorted.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 3} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-line px-6 py-20 text-center">
              <p className="display text-4xl">No outfits match all of that.</p>
              <p className="mt-3 text-muted">Try removing a filter or two, or search for a colour or an occasion.</p>
              <button onClick={clearAll} className="btn-dark mt-8">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} label="Filters" side>
        <div className="p-6 pt-16">
          <p className="display mb-8 text-4xl">Filters</p>
          {filters}
        </div>
        <div className="sticky bottom-0 mt-auto flex gap-3 border-t border-line bg-paper p-4">
          <button onClick={clearAll} className="btn-line flex-1">
            Clear
          </button>
          <button onClick={() => setDrawer(false)} className="btn-dark flex-1">
            Show {sorted.length}
          </button>
        </div>
      </Modal>
    </div>
  );
}

const DEPARTMENTS = [
  { key: "men", label: "Men", line: "Chola, koti, dulha sets", shot: { ...local("kullu-topi-stack", 0.5), slot: "outfits-men" as const } },
  { key: "women", label: "Women", line: "Pattu, luanchari, dohru", shot: { ...local("pattu-drying", 0.5, 0.3), slot: "outfits-women" as const } },
  { key: "accessories", label: "Accessories", line: "Topi, dora, silver", shot: { ...local("kinnauri-silver", 0.5), slot: "outfits-accessories" as const } },
];

function DepartmentTabs({ current, onPick }: { current: string | null; onPick: (v: string | null) => void }) {
  return (
    <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-4">
      {DEPARTMENTS.map((d) => {
        const on = current === d.key;
        const inner = (
          <>
            <Photo shot={d.shot} ar="16:9" alt="" priority sizes="(max-width: 640px) 33vw, 30vw" className="transition duration-1000 group-hover:scale-105" />
            <span className={`absolute inset-0 transition ${on ? "bg-ink/20" : "bg-gradient-to-t from-ink/70 to-ink/0"}`} />
            <span className="absolute inset-x-3 bottom-3 text-paper sm:inset-x-5 sm:bottom-4">
              <span className="block font-display text-2xl leading-none sm:text-4xl">{d.label}</span>
              <span className="mt-1 hidden text-xs text-paper/75 sm:block">{d.line}</span>
            </span>
            {on && <span className="absolute right-3 top-3 bg-paper px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">Viewing</span>}
          </>
        );
        const cls = `group relative block aspect-[4/5] overflow-hidden bg-sand text-left sm:aspect-[16/9] ${on ? "ring-2 ring-ink ring-offset-2 ring-offset-ivory" : ""}`;
        return d.key === "accessories" ? (
          <Link key={d.key} href="/outfits/accessories" className={cls}>
            {inner}
          </Link>
        ) : (
          <button key={d.key} onClick={() => onPick(on ? null : d.key)} aria-pressed={on} className={cls}>
            {inner}
          </button>
        );
      })}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4 text-muted">{title}</legend>
      {children}
    </fieldset>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={`chip h-9 px-3 text-xs ${on ? "chip-on" : "bg-paper/60"}`}>
      {children}
    </button>
  );
}

/** Remounts the catalogue when the search query changes from outside (e.g. the search overlay). */
export function CatalogueRoute(props: { fixed?: { collection?: string } }) {
  const q = useSearchParams().get("q") ?? "";
  return <Catalogue key={q} {...props} />;
}
