"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRente } from "@/lib/store";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./ui/Icons";
import { MobileMenu } from "./MobileMenu";
import { Wordmark } from "./ui/Wordmark";
import { SearchOverlay } from "./SearchOverlay";

export type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

export const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/collections",
    label: "Collections",
    children: [
      { href: "/collections/pahari-byah", label: "Pahari Byah" },
      { href: "/collections/kullu-valley", label: "Kullu Valley" },
      { href: "/collections/gaddi-chamba", label: "Gaddi & Chamba" },
      { href: "/collections/kinnaur", label: "Kinnaur" },
      { href: "/collections/nati-troupe", label: "Nati Troupe" },
      { href: "/collections/silver-heirlooms", label: "Silver Heirlooms" },
    ],
  },
  {
    href: "/outfits",
    label: "Outfits",
    children: [
      { href: "/outfits?for=men", label: "Men" },
      { href: "/outfits?for=women", label: "Women" },
      { href: "/outfits/accessories", label: "Accessories" },
    ],
  },
  {
    href: "/occasions",
    label: "Occasions",
    children: [
      { href: "/outfits?mood=byah", label: "Pahari Byah" },
      { href: "/outfits?occasion=festival", label: "Dussehra & Melas" },
      { href: "/outfits?occasion=nati", label: "Nati & Folk Dance" },
      { href: "/outfits?occasion=cultural-event", label: "School & College" },
      { href: "/outfits?occasion=photoshoot", label: "Heritage Shoot" },
    ],
  },
  { href: "/builder", label: "Outfit Builder" },
  { href: "/studio", label: "Studio Trial" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/journal", label: "Journal" },
];

export function Navbar() {
  const path = usePathname();
  const { bag, wishlist } = useRente();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const overHero = path === "/" && !scrolled;
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${overHero ? "bg-transparent text-paper" : "glass border-x-0 border-t-0 text-ink"}`}
        style={overHero ? undefined : { boxShadow: "0 10px 40px -20px rgb(23 21 19 / .25)" }}
      >
        <nav className="shell flex h-[72px] items-center justify-between gap-4" aria-label="Main">
          <div className="flex items-center gap-3">
            <button className="-ml-2 grid h-10 w-10 place-items-center xl:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
              <MenuIcon size={22} />
            </button>
            <Link href="/" aria-label="Threads & Tradition home">
              <Wordmark className="text-[22px] sm:text-[26px]" />
            </Link>
          </div>

          <ul className="hidden items-center gap-6 xl:flex">
            {NAV.filter((n) => n.href !== "/").map((n) => (
              <li key={n.href} className="group/nav relative">
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className={`link-u flex h-[72px] items-center text-[11px] font-medium uppercase tracking-[0.16em] ${active(n.href) ? "after:bottom-6 after:scale-x-100" : "opacity-80 after:bottom-6 hover:opacity-100"}`}
                >
                  {n.label}
                </Link>
                {n.children && (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100">
                    <ul className="min-w-48 bg-paper p-2 text-ink shadow-2xl">
                      {n.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block px-4 py-2.5 font-display text-xl transition hover:bg-sand">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button onClick={() => setSearch(true)} className="grid h-10 w-10 place-items-center" aria-label="Search (Ctrl K)">
              <SearchIcon />
            </button>
            <Link href="/wishlist" className="relative hidden h-10 w-10 place-items-center sm:grid" aria-label={`Wishlist, ${wishlist.length} saved`}>
              <HeartIcon />
              {wishlist.length > 0 && <Count n={wishlist.length} light={overHero} />}
            </Link>
            <Link href="/bag" className="relative grid h-10 w-10 place-items-center" aria-label={`Bag, ${bag.length} items`}>
              <BagIcon />
              {bag.length > 0 && <Count n={bag.length} light={overHero} />}
            </Link>
            <Link href="/account" className="hidden h-10 w-10 place-items-center sm:grid" aria-label="Account">
              <UserIcon />
            </Link>
          </div>
        </nav>
      </header>

      <MobileMenu open={menu} onClose={() => setMenu(false)} nav={NAV} isActive={active} onSearch={() => setSearch(true)} />

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}

function Count({ n, light }: { n: number; light: boolean }) {
  return (
    <span className={`absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold ${light ? "bg-paper text-ink" : "bg-wine text-paper"}`}>{n}</span>
  );
}
