import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Student registration",
  description: "Register for a Glorious Future Academy student portal account.",
  path: "/pupils/Signup",
  noindex: true,
});

export default function PupilSignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
