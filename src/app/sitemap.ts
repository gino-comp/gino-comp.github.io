import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/i18n";
import { labNotes } from "@/lib/lab-notes";

// Static export: emit sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // "/applications" and "/research" are built but hidden: unlinked, absent
  // here, and marked noindex on the pages themselves.
  const routes = ["", "/technology", "/lab-notes", ...labNotes.map((note) => `/lab-notes/${note.slug}`), "/news", "/about", "/contact"];
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteUrl}/${locale}${route}/`,
      lastModified,
      changeFrequency: route === "" || route === "/news" || route.startsWith("/lab-notes") ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.8
    }))
  );
}
