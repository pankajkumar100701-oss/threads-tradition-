"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { usePlan } from "@/lib/plan";
import { firstConflict, fmt, inr, rentalPrice, rentalWindow } from "@/lib/rental";
import { rente } from "@/lib/store";
import { Modal } from "./ui/Modal";
import { ProductVisual } from "./ui/ProductVisual";
import { StatusBadge } from "./ui/StatusBadge";
import { PeriodPicker } from "./product/PeriodPicker";
import { SizePicker } from "./product/SizePicker";
import { ArrowIcon, CalendarIcon } from "./ui/Icons";
import { toast } from "./ui/Toaster";

export function QuickView({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const plan = usePlan();
  const [days, setDays] = useState(plan.days);
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const w = rentalWindow(plan.start, days);
  const clash = firstConflict(product, plan.start, days, plan.today);
  const blocked = product.status === "coming-soon" || !!clash;

  const add = () => {
    rente.addToBag({ slug: product.slug, size, start: plan.start, days, accessories: [] });
    toast(`${product.name} added to bag`, { href: "/bag", cta: "View bag" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} label={`Quick view: ${product.name}`} wide>
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[3/4] bg-sand md:aspect-auto md:min-h-[560px]">
          <ProductVisual product={product} sizes="(max-width: 768px) 100vw, 40vw" />
        </div>
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <div>
            <StatusBadge status={product.status} className="border border-line" />
            <h2 className="display mt-4 text-4xl">{product.name}</h2>
            <p className="mt-2 text-lg">
              {inr(rentalPrice(product.price, days))} <span className="text-sm text-muted">/ {days} Days</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{product.note}</p>
          </div>
          <div>
            <p className="eyebrow mb-3 text-muted">Rental period</p>
            <PeriodPicker base={product.price} days={days} onChange={setDays} compact />
          </div>
          <div>
            <p className="eyebrow mb-3 text-muted">Size</p>
            <SizePicker sizes={product.sizes} value={size} onChange={setSize} />
          </div>
          <div className={`flex items-start gap-3 border p-4 text-sm ${blocked ? "border-bad/30 bg-bad/5" : "border-line"}`}>
            <CalendarIcon size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">
                {fmt(w.start)} → {fmt(w.end)}
              </p>
              <p className={blocked ? "text-bad" : "text-muted"}>
                {product.status === "coming-soon"
                  ? "Coming soon. Save it to your wishlist to hear when it lands."
                  : blocked
                    ? `Reserved on ${fmt(clash ?? w.start)}. Try other dates on the full page.`
                    : "Available for your dates"}
              </p>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <button className="btn-dark flex-1" disabled={!size || blocked} onClick={add}>
              {!size ? "Select a size" : blocked ? "Unavailable for these dates" : "Add to Bag"}
            </button>
            <Link href={`/outfits/${product.slug}`} className="btn-line flex-1" onClick={onClose}>
              Full Details <ArrowIcon size={16} />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
