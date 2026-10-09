"use client";

import { getAccessory, getProduct } from "./data";
import { fmtLong, inr, rentalWindow } from "./rental";
import { itemPrice, type Rental } from "./store";

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Builds a standalone, printable HTML receipt and downloads it. */
export function downloadReceipt(r: Rental) {
  const extra = r.extensions.reduce((s, e) => s + e.days, 0);
  const rows = r.items
    .map((it) => {
      const p = getProduct(it.slug);
      const w = rentalWindow(it.start, it.days + extra);
      const price = itemPrice(it);
      const acc = it.accessories
        .map((a) => getAccessory(a))
        .filter((a) => a !== undefined)
        .map((a) => `<tr><td class="sub">+ ${esc(a.name)}</td><td></td><td class="r">${inr(a.price)}</td></tr>`)
        .join("");
      return `<tr><td><b>${esc(p?.name ?? it.slug)}</b><br><span class="sub">Size ${esc(it.size)}</span></td><td>${fmtLong(w.start)} → ${fmtLong(w.end)}</td><td class="r">${inr(price.outfit)}</td></tr>${acc}`;
    })
    .join("");
  const t = r.totals;
  const line = (k: string, v: number, neg = false) => (v ? `<tr><td colspan="2">${esc(k)}</td><td class="r">${neg ? "−" : ""}${inr(v)}</td></tr>` : "");
  const ext = r.extensions.map((e) => line(`Extension +${e.days} days`, e.price)).join("");
  const total = t.total + r.extensions.reduce((s, e) => s + e.price, 0);
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${r.id}</title>
<style>body{font:15px/1.5 Georgia,serif;color:#171513;max-width:720px;margin:48px auto;padding:0 24px}h1{font-weight:400;font-size:40px;margin:0}
.k{letter-spacing:.25em;font:600 11px sans-serif;text-transform:uppercase;color:#a4824d}table{width:100%;border-collapse:collapse;margin-top:24px}td{padding:10px 0;border-bottom:1px solid #e5ded2;vertical-align:top}
.r{text-align:right}.sub{color:#71685d;font-size:13px}.tot td{border-top:2px solid #171513;font-size:20px}</style></head><body>
<p class="k">Threads &amp; Tradition · Receipt</p><h1>Your look is reserved.</h1>
<p>Booking ID <b>${r.id}</b> · placed ${fmtLong(r.placedAt)}<br>${r.fulfilment === "delivery" ? `Home delivery to ${esc(r.address ?? "")}` : "Studio pickup, The Ridge, Shimla"}</p>
<table>${rows}${line("Complete-look saving", t.lookSavings, true)}${line("Promo " + (r.promo ?? ""), t.discount, true)}${line("Delivery", t.delivery)}${line("Rental Protection", t.protection)}${ext}${line("Security Deposit (refundable)", t.deposit)}
<tr class="tot"><td colspan="2">Total</td><td class="r">${inr(total)}</td></tr></table>
<p class="sub">The ${inr(t.deposit)} security deposit is refunded within 48 hours of return. Wear the moment. Return the memory.</p></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `threads-tradition-${r.id}.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
