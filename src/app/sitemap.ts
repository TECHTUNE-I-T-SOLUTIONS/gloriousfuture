import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/quizzes", priority: 0.8, changeFrequency: "weekly" },
  { path: "/funzone", priority: 0.6, changeFrequency: "monthly" },
  { path: "/donation", priority: 0.7, changeFrequency: "monthly" },
 { path: "/pupils", priority: 0.7, changeFrequency: "monthly" },
 { path: "/teacher", priority: 0.7, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
