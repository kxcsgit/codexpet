import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/submit"],
      },
    ],
    sitemap: "https://codexpet.space/sitemap.xml",
  };
}
