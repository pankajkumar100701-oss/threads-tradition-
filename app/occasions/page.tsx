import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { OccasionQuiz } from "@/components/home/OccasionQuiz";

export const metadata: Metadata = { title: "Occasions", description: "Himachali outfits for the byah, Kullu Dussehra and melas, nati performances, school and college functions and heritage photoshoots." };

export default function OccasionsPage() {
  return (
    <>
      <PageHeader eyebrow="Occasions" title={<>What are you <em>dressing for?</em></>} lead="Start with the day, and we'll show you the looks that suit it." />
      <div className="pb-24">
        <ShopByOccasion heading={false} />
      </div>
      <OccasionQuiz />
    </>
  );
}
