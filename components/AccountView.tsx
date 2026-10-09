"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getProduct } from "@/lib/data";
import { downloadReceipt } from "@/lib/receipt";
import { addDays, diffDays, extensionPrice, fmt, fmtLong, heldDates, inr, rentalWindow, reservedDates } from "@/lib/rental";
import { rente, rentalPhase, useHydrated, useRente, useToday, type Rental } from "@/lib/store";
import { ProductVisual } from "./ui/ProductVisual";
import { Modal } from "./ui/Modal";
import { ArrowIcon, CheckIcon, CloseIcon, DownloadIcon } from "./ui/Icons";
import { ProductCard } from "./ProductCard";
import { toast } from "./ui/Toaster";

const TABS = [
  ["rentals", "My Rentals"],
  ["orders", "Orders"],
  ["wishlist", "Wishlist"],
  ["addresses", "Addresses"],
  ["profile", "Profile"],
] as const;
type Tab = (typeof TABS)[number][0];

export function AccountView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const hydrated = useHydrated();
  const state = useRente();
  const tab = (TABS.find((t) => t[0] === params.get("tab"))?.[0] ?? "rentals") as Tab;

  return (
    <div className="shell pb-24 pt-32 md:pt-40">
      <p className="eyebrow text-gold">Account</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">{hydrated && state.profile.name && state.profile.name !== "Guest" ? `Hello, ${state.profile.name.split(" ")[0]}.` : "Your wardrobe, on loan."}</h1>

      <nav className="no-scrollbar -mx-4 mt-10 flex overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0" aria-label="Account sections">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            onClick={() => router.replace(`${path}?tab=${k}`, { scroll: false })}
            aria-current={tab === k ? "page" : undefined}
            className={`-mb-px shrink-0 border-b-2 px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] transition ${tab === k ? "border-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {label}
            {k === "wishlist" && hydrated && state.wishlist.length > 0 && <span className="ml-2 text-gold">{state.wishlist.length}</span>}
          </button>
        ))}
      </nav>

      <div className="pt-12">
        {!hydrated ? (
          <div className="min-h-[40vh]" />
        ) : tab === "rentals" ? (
          <Rentals />
        ) : tab === "orders" ? (
          <Orders />
        ) : tab === "wishlist" ? (
          <WishlistGrid />
        ) : tab === "addresses" ? (
          <Addresses />
        ) : (
          <Profile key={JSON.stringify(state.profile)} />
        )}
      </div>
    </div>
  );
}

function Rentals() {
  const { rentals, appointments } = useRente();
  const today = useToday();
  const [extending, setExtending] = useState<Rental | null>(null);
  const groups = (["active", "upcoming", "returned"] as const).map((phase) => ({ phase, list: rentals.filter((r) => rentalPhase(r, today) === phase) }));
  const label = { active: "Active", upcoming: "Upcoming", returned: "Past" };

  const trials = appointments.filter((a) => a.date >= today);

  if (!rentals.length && !trials.length) return <Empty title="No rentals yet." cta="Find your first look" href="/outfits" />;

  return (
    <div className="space-y-16">
      {trials.length > 0 && (
        <section>
          <h2 className="eyebrow mb-6 text-muted">Studio Trials · {trials.length}</h2>
          <ul className="grid gap-4 lg:grid-cols-2">
            {trials.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 border border-line bg-paper p-5">
                <div>
                  <p className="text-xs text-muted">{a.id}</p>
                  <p className="mt-1 font-display text-2xl">
                    {a.studio} studio · {fmtLong(a.date)} at {a.time}
                  </p>
                  <p className="mt-1 text-sm text-muted">{a.outfits.map((s) => getProduct(s)?.name).filter(Boolean).join(", ")}</p>
                </div>
                <button
                  onClick={() => {
                    rente.cancelAppointment(a.id);
                    toast("Trial cancelled");
                  }}
                  className="btn-line h-10 shrink-0 px-4 text-[11px]"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {groups.map(
        ({ phase, list }) =>
          list.length > 0 && (
            <section key={phase}>
              <h2 className="eyebrow mb-6 text-muted">
                {label[phase]} · {list.length}
              </h2>
              <ul className="grid gap-4 lg:grid-cols-2">
                {list.map((r) => (
                  <RentalCard key={r.id} r={r} today={today} phase={phase} onExtend={() => setExtending(r)} />
                ))}
              </ul>
            </section>
          ),
      )}
      {extending && <ExtendModal r={extending} today={today} onClose={() => setExtending(null)} />}
    </div>
  );
}

function RentalCard({ r, today, phase, onExtend }: { r: Rental; today: string; phase: "active" | "upcoming" | "returned"; onExtend: () => void }) {
  const item = r.items[0];
  const p = getProduct(item.slug);
  const extra = r.extensions.reduce((s, e) => s + e.days, 0);
  const w = rentalWindow(item.start, item.days + extra);
  const untilReturn = diffDays(today, w.pickup);
  const status = phase === "active" ? (untilReturn <= 0 ? "Return Today" : untilReturn === 1 ? "Return Tomorrow" : `Return in ${untilReturn} days`) : phase === "upcoming" ? "Confirmed" : "Returned";

  if (!p) return null;
  return (
    <li className="flex gap-5 border border-line bg-paper p-4 sm:p-5">
      <Link href={`/outfits/${p.slug}`} className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden bg-sand sm:w-32">
        <ProductVisual product={p} sizes="128px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-muted">{r.id}</p>
          <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${phase === "active" ? "bg-wine text-paper" : phase === "upcoming" ? "bg-ok/15 text-ok" : "bg-sand text-muted"}`}>{status}</span>
        </div>
        <p className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
          {p.name}
          {r.items.length > 1 && <span className="text-muted"> +{r.items.length - 1}</span>}
        </p>
        <p className="mt-1 text-sm">
          {fmt(w.start)} → {fmt(w.end)}
          {extra > 0 && <span className="ml-2 text-xs text-ok">extended +{extra}d</span>}
        </p>
        <p className="mt-0.5 text-xs text-muted">Pickup {fmtLong(w.pickup)}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {phase !== "returned" && (
            <button onClick={onExtend} className="btn-dark h-10 px-4 text-[11px]">
              Extend Rental
            </button>
          )}
          <button onClick={() => downloadReceipt(r)} className="btn-line h-10 px-4 text-[11px]">
            <DownloadIcon size={14} /> Receipt
          </button>
        </div>
      </div>
    </li>
  );
}

function ExtendModal({ r, today, onClose }: { r: Rental; today: string; onClose: () => void }) {
  const [extra, setExtra] = useState(2);
  const [done, setDone] = useState(false);
  const item = r.items[0];
  const p = getProduct(item.slug)!;
  const already = r.extensions.reduce((s, e) => s + e.days, 0);
  const end = rentalWindow(item.start, item.days + already).end;
  const newEnd = addDays(end, extra);
  const reserved = reservedDates(p, today);
  const wanted = heldDates(addDays(end, 1), extra - 1);
  const free = wanted.every((d) => !reserved.has(d));
  const price = extensionPrice(p.price, extra);

  return (
    <Modal open onClose={onClose} label="Extend rental">
      <div className="p-6 sm:p-10">
        <p className="eyebrow text-gold">Extend Rental · {r.id}</p>
        <h2 className="display mt-3 text-4xl">{p.name}</h2>
        <p className="mt-2 text-sm text-muted">Currently ends {fmtLong(end)}</p>

        {done ? (
          <div className="animate-rise mt-8">
            <p className="flex items-center gap-2 font-display text-3xl">
              <CheckIcon className="text-ok" /> Extended to {fmt(newEnd)}.
            </p>
            <p className="mt-2 text-sm text-muted">We&apos;ll pick it up on {fmtLong(addDays(newEnd, 1))}.</p>
            <button className="btn-dark mt-8 w-full" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-3 gap-2">
              {[2, 3, 5].map((d) => (
                <button key={d} onClick={() => setExtra(d)} className={`chip h-12 justify-center ${extra === d ? "chip-on" : ""}`}>
                  Extend {d} Days
                </button>
              ))}
            </div>
            <div className={`mt-6 border p-5 ${free ? "border-ok/40 bg-ok/5" : "border-bad/30 bg-bad/5"}`}>
              {free ? (
                <>
                  <p className="font-display text-2xl">Good news. This outfit is available for extension.</p>
                  <p className="mt-1 text-sm text-muted">
                    New end date: {fmtLong(newEnd)}
                  </p>
                  <p className="display mt-4 text-4xl">+{inr(price)}</p>
                </>
              ) : (
                <>
                  <p className="font-display text-2xl">Sorry, someone has booked it right after you.</p>
                  <p className="mt-1 text-sm text-muted">Try a shorter extension.</p>
                </>
              )}
            </div>
            <button
              className="btn-dark mt-6 w-full"
              disabled={!free}
              onClick={() => {
                rente.extendRental(r.id, extra);
                toast(`Rental extended by ${extra} days`);
                setDone(true);
              }}
            >
              Extend Rental <ArrowIcon size={16} />
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

function Orders() {
  const { rentals } = useRente();
  if (!rentals.length) return <Empty title="No orders yet." cta="Browse outfits" href="/outfits" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            {["Booking", "Placed", "Outfits", "Fulfilment", "Total", ""].map((h) => (
              <th key={h} className="py-3 pr-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rentals.map((r) => (
            <tr key={r.id} className="border-b border-line">
              <td className="py-4 pr-4 font-display text-xl">{r.id}</td>
              <td className="py-4 pr-4 text-muted">{fmt(r.placedAt)}</td>
              <td className="py-4 pr-4">{r.items.map((i) => getProduct(i.slug)?.name).join(", ")}</td>
              <td className="py-4 pr-4 text-muted">{r.fulfilment === "delivery" ? "Home delivery" : "Studio pickup"}</td>
              <td className="py-4 pr-4">{inr(r.totals.total + r.extensions.reduce((s, e) => s + e.price, 0))}</td>
              <td className="py-4 text-right">
                <button onClick={() => downloadReceipt(r)} className="link-u text-xs font-semibold uppercase tracking-[0.14em]">
                  Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WishlistGrid() {
  const { wishlist } = useRente();
  const list = wishlist.map(getProduct).filter((p) => p !== undefined);
  if (!list.length) return <Empty title="Nothing saved yet." cta="Explore outfits" href="/outfits" />;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

function Addresses() {
  const { addresses } = useRente();
  const [draft, setDraft] = useState("");
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ul className="space-y-3">
        {addresses.map((a, i) => (
          <li key={a} className="flex items-start justify-between gap-4 border border-line bg-paper p-5">
            <div>
              {i === 0 && <p className="eyebrow mb-1 text-gold">Default</p>}
              <p className="font-display text-xl">{a}</p>
            </div>
            <button onClick={() => rente.removeAddress(a)} aria-label="Remove address" className="text-muted hover:text-ink">
              <CloseIcon size={18} />
            </button>
          </li>
        ))}
        {!addresses.length && <p className="text-muted">No saved addresses.</p>}
      </ul>
      <form
        className="border border-line p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim().length > 8) {
            rente.saveAddress(draft.trim());
            setDraft("");
            toast("Address saved");
          }
        }}
      >
        <p className="font-display text-2xl">Add Address</p>
        <label htmlFor="addr" className="sr-only">
          Address
        </label>
        <textarea id="addr" value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="House, street, area, city, PIN" className="field mt-4 h-auto py-3" />
        <button className="btn-dark mt-4" disabled={draft.trim().length <= 8}>
          Save Address
        </button>
      </form>
    </div>
  );
}

function Profile() {
  const { profile } = useRente();
  const [v, setV] = useState(profile);
  return (
    <form
      className="grid max-w-xl gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        rente.saveProfile(v);
        toast("Profile saved");
      }}
    >
      {(
        [
          ["name", "Full name", "text"],
          ["email", "Email", "email"],
          ["phone", "Mobile", "tel"],
        ] as const
      ).map(([k, label, type]) => (
        <label key={k}>
          <span className="eyebrow text-muted">{label}</span>
          <input type={type} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} className="field mt-2" />
        </label>
      ))}
      <div className="mt-2 flex flex-wrap gap-3">
        <button className="btn-dark">Save Profile</button>
        <button
          type="button"
          onClick={() => {
            rente.resetDemo();
            toast("Demo data reset");
          }}
          className="btn text-muted hover:text-ink"
        >
          Reset demo data
        </button>
      </div>
    </form>
  );
}

function Empty({ title, cta, href }: { title: string; cta: string; href: string }) {
  return (
    <div className="border border-dashed border-line px-6 py-20 text-center">
      <p className="display text-4xl">{title}</p>
      <Link href={href} className="btn-dark mt-8">
        {cta}
      </Link>
    </div>
  );
}
