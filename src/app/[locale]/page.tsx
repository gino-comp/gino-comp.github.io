import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import ExploreSection from "@/components/Explore";
import ContactSection from "@/components/Contact";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? makeMetadata(locale) : {};
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <TechnologyIndex locale={locale} dict={dict} />
      <ExploreSection locale={locale} dict={dict} />
      <ContactSection dict={dict} />
    </>
  );
}

function TechnologyIndex({ locale, dict }: { locale: Locale; dict: ReturnType<typeof getDictionary> }) {
  // One card per Technology-page section, deep-linked by id.
  const hrefs = [`/${locale}/technology/#why`, `/${locale}/technology/#near-sensor`, `/${locale}/technology/#doda`, `/${locale}/technology/#simulator`];
  return (
    <div className="technology-index">
      <div className="container technology-index-grid">
        {dict.index.map(([n, title, sub], index) => (
          <a key={title} href={hrefs[index]}>
            <span>{n}</span>
            <div><strong>{title}</strong><small>{sub}</small></div>
          </a>
        ))}
      </div>
    </div>
  );
}
