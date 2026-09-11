import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApplicationsSection from "@/components/Applications";
import ContactSection from "@/components/Contact";
import { getDictionary, isLocale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  // Hidden page: reachable by direct URL, but unlinked and not indexed.
  return { ...makeMetadata(locale, "applications", "Applications"), robots: { index: false, follow: false } };
}

export default async function ApplicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <div className="subpage"><ApplicationsSection dict={dict} /><ContactSection dict={dict} contactHref={`/${locale}/contact/`} /></div>;
}
