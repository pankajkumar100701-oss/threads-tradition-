import type { Metadata } from "next";
import { Suspense } from "react";
import { local } from "@/lib/images";
import { PageHeader } from "@/components/ui/PageHeader";
import { StudioBooking } from "@/components/StudioBooking";

export const metadata: Metadata = { title: "Studio Trial", description: "Book a free trial at our Shimla, Manali or Chandigarh studio and try your wedding outfits before you rent." };

export default function StudioPage() {
  return (
    <>
      <PageHeader eyebrow="Studio Trial · Free" title={<>Try it on <em>before the big day.</em></>} lead="Book a 45-minute trial with a stylist. Bring the family, try up to five outfits, and we'll pin and adjust what you choose." image={local("pattu-drying", 0.5, 0.3)} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <StudioBooking />
      </Suspense>
    </>
  );
}
