import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About our school",
  description:
    "Meet the team, mission and campus of Glorious Future Academy in Oro, Kwara State. Learn why families choose GFA.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
