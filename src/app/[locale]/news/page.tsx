import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsSection from "@/components/News";
import { getDictionary, isLocale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return makeMetadata(locale, "news", "What’s New", dict.newsCopy.desc);
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <div className="subpage news-page">
      <NewsSection locale={locale} dict={dict} />
    </div>
  );
}
