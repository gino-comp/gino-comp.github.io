import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TechnologySection, DodaSection } from "@/components/Technology";
import ContactSection from "@/components/Contact";
import { getDictionary, isLocale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? makeMetadata(locale, "technology", "DODA Architecture") : {};
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <div className="subpage"><TechnologySection dict={dict} /><DodaSection dict={dict} /><ContactSection dict={dict} /></div>;
}
