import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Practice quizzes",
  description: "Take free practice quizzes and check your understanding across school subjects.",
  path: "/quizzes",
});

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
