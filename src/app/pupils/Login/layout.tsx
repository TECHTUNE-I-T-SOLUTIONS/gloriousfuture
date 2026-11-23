import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Student sign in",
  description: "Sign in to your Glorious Future Academy student portal.",
  path: "/pupils/Login",
  noindex: true,
});

export default function PupilLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
