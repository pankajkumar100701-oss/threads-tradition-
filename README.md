# Threads & Tradition

*Wear the moment. Return the memory.* A rental storefront for **Himachali traditional wear only** (Kullvi pattu and dhatu, Gaddi chola and luanchari, Kinnauri dohru and thepang, Kullu topis and shawls, Lahauli robes and Pahari silver), built with Next.js 16, React 19 and Tailwind CSS 4.

```bash
npm run dev   # http://localhost:3000
```

## What's in it

- **Storefront:** home page (hero, quick search, valley collections, occasions, trending, Complete the Look, Valley by Valley, reviews, how it works, FAQ), `/collections`, `/outfits` (search plus filters for category, size, colour, price, occasion, availability and style, with Men / Women / Accessories), `/occasions`, `/builder`, `/quiz`, `/how-it-works`, `/journal`, `/about`
- **Rental flow:** product page with rental-period pricing, availability calendar, size finder, accessories, similar outfits and recently viewed. Then bag (delivery or pickup, address, protection, promo `FIRSTLOOK10`, `BYAH15`, or `NATI20` for 8+ outfits), confirmation with receipt download, and account (rentals with extend, orders, wishlist, addresses, profile). Compare up to 3 outfits.
- **State:** bag, wishlist, rentals and so on live in `localStorage` (`lib/store.ts`). There is no backend, and checkout is a demo. Account › Profile has a "Reset demo data" button.

## Code map

| File               | Contents                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `lib/data.ts`      | Himachali catalogue, accessories, valleys, occasions, journal, FAQ |
| `lib/rental.ts`    | Dates, pricing tiers, availability, search, size recommendation   |
| `lib/store.ts`     | Client store (bag, wishlist, rentals) and totals                  |
| `lib/slots.ts`     | Named campaign-image slots                                        |

## Campaign images

Openly licensed Wikimedia Commons photos of Himachali dress (credits in `lib/credits.ts`, shown at `/credits`) stand in until the brand shoot is ready. Save generated images into `public/images/` named after their slot (`home-hero.jpg`, `collection-kullu.jpg`, …), then restart the dev server. The full list is in `public/images/README.md`.
