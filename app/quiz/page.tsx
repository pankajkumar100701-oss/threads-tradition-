import type { Metadata } from "next";
import { OccasionQuiz } from "@/components/home/OccasionQuiz";

export const metadata: Metadata = { title: "Style Quiz", description: "Three questions to find the right outfit for your occasion, style and budget." };

export default function QuizPage() {
  return (
    <div className="pt-[72px] [&_#quiz]:min-h-[calc(100vh-72px)]">
      <OccasionQuiz />
    </div>
  );
}
