import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { getDictionary, siteUrl } from "./i18n";

export function makeMetadata(locale: Locale, path = "", title?: string, description?: string): Metadata {
  const dict = getDictionary(locale);
  // Trailing slashes match `trailingSlash: true` in next.config.mjs, so the
  // canonical URL is byte-identical to the URL GitHub Pages actually serves.
  const normalized = path ? `/${path}` : "";
  const pageUrl = `/${locale}${normalized}/`;
  const pageTitle = title ? `${title} | RiDM Technology` : dict.meta.title;
  const pageDescription = description ?? dict.meta.description;

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: pageUrl,
      languages: {
        ko: `/ko${normalized}/`,
        en: `/en${normalized}/`
      }
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      siteName: "RiDM Technology",
      title: pageTitle,
      description: pageDescription,
      locale: locale === "ko" ? "ko_KR" : "en_US"
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: pageDescription
    }
  };
}
