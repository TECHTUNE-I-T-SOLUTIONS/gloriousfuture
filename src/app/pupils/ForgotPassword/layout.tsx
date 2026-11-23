import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reset student password",
  description: "Request help resetting your Glorious Future Academy student portal password.",
  path: "/pupils/Forgotpassword",
  noindex: true,
});

export default function PupilForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
