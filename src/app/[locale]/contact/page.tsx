import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactSection from "@/components/Contact";
import { getDictionary, isLocale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? makeMetadata(locale, "contact", "Contact") : {};
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <div className="subpage standalone-contact"><ContactSection dict={dict} deckHref={`/${locale}/deck/`} /></div>;
}
