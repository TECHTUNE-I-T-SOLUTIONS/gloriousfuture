import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Donation not completed",
  description: "Find out what to do if your donation to Glorious Future Academy was not completed.",
  path: "/donation-failed",
  noindex: true,
});

export default function DonationFailedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
