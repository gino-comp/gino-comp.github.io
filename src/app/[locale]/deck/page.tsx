import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Deck from "@/components/Deck";
import { getDictionary, isLocale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  // A utility view of the site, reached from the Contact page; not for search.
  return { ...makeMetadata(locale, "deck", dict.deck.title), robots: { index: false, follow: false } };
}

export default async function DeckPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Deck locale={locale} dict={getDictionary(locale)} />;
}
