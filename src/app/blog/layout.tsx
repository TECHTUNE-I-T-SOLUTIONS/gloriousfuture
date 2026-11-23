import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "School news and stories",
  description: "Read the latest news, announcements and stories from Glorious Future Academy in Oro, Kwara State.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
