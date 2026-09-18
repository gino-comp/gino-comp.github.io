import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabNotesIndex } from "@/components/LabNotes";
import { getDictionary, isLocale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return makeMetadata(locale, "lab-notes", "Lab Notes", dict.labNotes.desc);
}

export default async function LabNotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <div className="subpage news-page">
      <LabNotesIndex locale={locale} dict={dict} />
    </div>
  );
}
