import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import ExploreSection from "@/components/Explore";
import ContactSection from "@/components/Contact";
import { getDictionary, isLocale } from "@/lib/i18n";
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
      <ExploreSection locale={locale} dict={dict} />
      <ContactSection dict={dict} contactHref={`/${locale}/contact/`} />
    </>
  );
}
