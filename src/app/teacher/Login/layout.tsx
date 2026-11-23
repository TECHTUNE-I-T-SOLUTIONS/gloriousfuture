import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Staff sign in",
  description: "Sign in to your Glorious Future Academy staff portal.",
  path: "/teacher/Login",
  noindex: true,
});

export default function TeacherLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
