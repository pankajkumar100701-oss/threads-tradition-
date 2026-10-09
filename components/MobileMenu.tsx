"use client";

import Link from "next/link";
import { useState } from "react";
import { useRente } from "@/lib/store";
import type { NavItem } from "./Navbar";
import { Modal } from "./ui/Modal";
import { Wordmark } from "./ui/Wordmark";
import { ArrowIcon, BagIcon, ChevronDownIcon, HeartIcon, SearchIcon, UserIcon } from "./ui/Icons";

export function MobileMenu({ open, onClose, nav, isActive, onSearch }: { open: boolean; onClose: () => void; nav: NavItem[]; isActive: (href: string) => boolean; onSearch: () => void }) {
  const { wishlist, bag } = useRente();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Modal open={open} onClose={onClose} label="Menu" side>
      <div className="flex h-[72px] shrink-0 items-center border-b border-line px-6">
        <Wordmark className="text-[22px]" />
      </div>

      <div className="flex flex-1 flex-col px-6 py-5">
        <button
          onClick={() => {
            onClose();
            onSearch();
          }}
          className="flex h-12 items-center gap-3 rounded-full bg-sand/70 px-5 text-left text-sm text-muted transition hover:bg-sand"
        >
          <SearchIcon size={18} /> Search pattu, chola, topi…
        </button>

        <ul className="mt-4">
          {nav.map((n) => {
            const open = expanded === n.href;
            return (
              <li key={n.href} className="border-b border-line">
                <div className="flex items-center">
                  <Link href={n.href} onClick={onClose} className={`flex h-14 flex-1 items-center text-[15px] font-medium ${isActive(n.href) ? "text-wine" : ""}`}>
                    {isActive(n.href) && <span className="mr-3 h-1.5 w-1.5 rounded-full bg-wine" />}
                    {n.label}
                  </Link>
                  {n.children && (
                    <button onClick={() => setExpanded(open ? null : n.href)} aria-expanded={open} aria-label={`${n.label} sections`} className="grid h-14 w-12 place-items-center text-muted">
                      <ChevronDownIcon size={18} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {n.children && (
                  <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]"}`}>
                    <ul className="overflow-hidden">
                      {n.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={onClose} className="flex items-center justify-between py-2.5 pl-4 text-sm text-muted transition hover:text-ink">
                            {c.label}
                            <ArrowIcon size={14} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {(
            [
              ["/wishlist", HeartIcon, "Wishlist", wishlist.length],
              ["/bag", BagIcon, "Bag", bag.length],
              ["/account", UserIcon, "Account", 0],
            ] as const
          ).map(([href, Icon, label, n]) => (
            <Link key={href} href={href} onClick={onClose} className="relative flex flex-col items-center gap-1.5 rounded-xl bg-sand/50 py-4 text-xs font-medium transition hover:bg-sand">
              <Icon size={20} />
              {label}
              {n > 0 && <span className="absolute right-3 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-wine px-1 text-[10px] font-bold text-paper">{n}</span>}
            </Link>
          ))}
        </div>

        <Link href="/quiz" onClick={onClose} className="btn-dark mt-auto rounded-full">
          Find My Outfit <ArrowIcon size={16} />
        </Link>
      </div>
    </Modal>
  );
}
