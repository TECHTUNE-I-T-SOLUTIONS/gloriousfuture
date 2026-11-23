import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageSeoOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noindex?: boolean;
  type?: "website" | "article";
};

export function createPageMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.image,
  imageAlt = siteConfig.name,
  keywords,
  noindex = false,
  type = "website",
}: PageSeoOptions): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const absoluteImage = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title,
      description,
      images: [{ url: absoluteImage, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
    },
  };
}
