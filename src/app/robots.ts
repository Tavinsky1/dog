import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://dog-atlas.vercel.app";
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/", 
          "/admin/",
          "/mod/", 
          "/_next/", 
          "/static/",
          "/*.json$",
          "/api/*",
        ],
      },
      // Allow search engines to crawl images
      {
        userAgent: "Googlebot-Image",
        allow: ["/"],
      },
      // Special rules for GPTBot (ChatGPT)
      {
        userAgent: "GPTBot",
        allow: ["/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
