import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, isLocale, locales, siteUrl } from "@/lib/i18n";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RiDM Technology",
    url: siteUrl,
    logo: `${siteUrl}/brand/ridm-logo.png`,
    description: dict.meta.description
  };

  const paperJsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    name: "3DRA: Dynamic Data-Driven Reconfigurable Architecture",
    datePublished: "2023-09-26",
    identifier: "https://doi.org/10.1109/ACCESS.2023.3319404",
    author: ["Jinho Lee", "Burin Amornpaisannon", "Andreas Diavastos", "Trevor E. Carlson"].map((name) => ({ "@type": "Person", name }))
  };

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(paperJsonLd) }} />
    </>
  );
}
