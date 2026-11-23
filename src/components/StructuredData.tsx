import { siteConfig } from "@/lib/site-config";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "School",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.telephone,
    email: siteConfig.contact.email,
    image: `${siteConfig.url}${siteConfig.image}`,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.streetAddress,
      addressLocality: siteConfig.contact.addressLocality,
      addressRegion: siteConfig.contact.addressRegion,
      addressCountry: siteConfig.contact.addressCountry,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
