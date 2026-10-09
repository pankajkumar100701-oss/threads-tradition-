import { Hero } from "@/components/home/Hero";
import { QuickSearch } from "@/components/home/QuickSearch";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { TrendingOutfits } from "@/components/home/TrendingOutfits";
import { CompleteTheLook } from "@/components/home/CompleteTheLook";
import { Himachali } from "@/components/home/Himachali";
import { Reviews } from "@/components/sections/Reviews";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Faq } from "@/components/sections/Faq";
import { RecentlyViewed } from "@/components/sections/RecentlyViewed";

/** Kept short on purpose: the builder, quiz, couple looks, journal and care guide each have their own page. */
export default function Home() {
  return (
    <>
      <Hero />
      <QuickSearch />
      <TrustMarquee />
      <FeaturedCollections />
      <ShopByOccasion />
      <TrendingOutfits />
      <CompleteTheLook />
      <Himachali />
      <HowItWorks />
      <Reviews />
      <Faq />
      <RecentlyViewed />
    </>
  );
}
