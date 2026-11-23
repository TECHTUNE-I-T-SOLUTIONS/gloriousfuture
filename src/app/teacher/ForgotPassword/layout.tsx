import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reset staff password",
  description: "Request a password reset for your Glorious Future Academy staff portal account.",
  path: "/teacher/Forgotpassword",
  noindex: true,
});

export default function TeacherForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
