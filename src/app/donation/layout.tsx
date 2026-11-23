import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Support our school",
  description: "Support Glorious Future Academy in Oro, Kwara State and help us provide a stronger learning experience.",
  path: "/donation",
});

export default function DonationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
