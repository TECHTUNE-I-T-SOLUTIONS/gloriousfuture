export const siteConfig = {
  name: "Glorious Future Academy",
  shortName: "GFA",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gloriousfutureacademy.vercel.app").replace(/\/$/, ""),
  title: {
    default: "Glorious Future Academy - Official School Portal",
    template: "%s | Glorious Future Academy",
  },
  description:
    "Glorious Future Academy is a secondary school in Oro, Kwara State, Nigeria. Explore our programmes, campus life, quizzes and school portal.",
  keywords: [
    "Glorious Future Academy",
    "GFA Oro",
    "secondary school Oro",
    "school portal Kwara",
    "Nigerian secondary school",
    "Oro Kwara State school",
  ],
  locale: "en_NG",
  logo: "/logo.png",
  image: "/logo.png",
  contact: {
    telephone: "+2348035770623",
    telephoneLabel: "+234 803 5770 623",
    email: "christgloriousfuture@gmail.com",
    streetAddress: "IBA Transformer Area, Ijomu Road",
    addressLocality: "Oro",
    addressRegion: "Kwara State",
    addressCountry: "NG",
  },
} as const;
