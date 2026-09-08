import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import { TechnologySection, DodaSection } from "@/components/Technology";
import ApplicationsSection from "@/components/Applications";
import ResearchSection from "@/components/Research";
import CompanySection from "@/components/Company";
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
      <TechnologySection dict={dict} />
      <DodaSection dict={dict} />
      <ApplicationsSection dict={dict} />
      <ResearchSection dict={dict} />
      <CompanySection dict={dict} />
      <ContactSection dict={dict} />
    </>
  );
}

function TechnologyIndex({ locale, dict }: { locale: Locale; dict: ReturnType<typeof getDictionary> }) {
  const hrefs = [`/${locale}/technology`, `/${locale}/technology`, `/${locale}/research`];
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
