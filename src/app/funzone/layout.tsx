import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Fun Zone",
  description: "Explore creative games and activities designed for pupils at Glorious Future Academy.",
  path: "/funzone",
});

export default function FunZoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
