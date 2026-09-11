import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/i18n";

// Static export: emit sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/technology", "/applications", "/research", "/news", "/about", "/contact"];
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteUrl}/${locale}${route}/`,
      lastModified,
      changeFrequency: route === "" || route === "/news" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.8
    }))
  );
}
