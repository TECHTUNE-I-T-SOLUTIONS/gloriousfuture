import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Staff registration",
  description: "Register for a Glorious Future Academy staff portal account.",
  path: "/teacher/Signup",
  noindex: true,
});

export default function TeacherSignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
