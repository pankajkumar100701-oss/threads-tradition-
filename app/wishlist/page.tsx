import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { WishlistGrid } from "@/components/AccountView";
import { RecentlyViewed } from "@/components/sections/RecentlyViewed";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <>
      <PageHeader eyebrow="Wishlist" title={<>Your Saved <em>Looks</em></>} />
      <section className="shell pb-16">
        <WishlistGrid />
      </section>
      <RecentlyViewed />
    </>
  );
}
