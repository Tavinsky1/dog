import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/mod", "/_next/", "/static/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
