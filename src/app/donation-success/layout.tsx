import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Donation complete",
  description: "Your support for Glorious Future Academy has been received.",
  path: "/donation-success",
  noindex: true,
});

export default function DonationSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
