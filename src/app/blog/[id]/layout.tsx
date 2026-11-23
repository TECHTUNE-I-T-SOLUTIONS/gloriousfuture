import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return createPageMetadata({
    title: "School story",
    description: "Read a news story from Glorious Future Academy, Oro, Kwara State.",
    path: `/blog/${id}`,
    type: "article",
  });
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
