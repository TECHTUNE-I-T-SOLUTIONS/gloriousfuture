import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return createPageMetadata({
    title: "Practice quiz",
    description: "Take a timed practice quiz and see how you perform.",
    path: `/quizzes/${id}`,
  });
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
