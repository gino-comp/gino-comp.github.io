import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabNoteArticle } from "@/components/LabNotes";
import { getDictionary, isLocale, locales, siteUrl } from "@/lib/i18n";
import { getLabNote, labNotes } from "@/lib/lab-notes";
import { makeMetadata } from "@/lib/metadata";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => labNotes.map((note) => ({ locale, slug: note.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = getLabNote(slug);
  if (!isLocale(locale) || !note) return {};
  const copy = note.copy[locale];
  const base = makeMetadata(locale, `lab-notes/${slug}`, `${copy.title} — Lab Notes`, copy.summary);
  // A note is what gets pasted into a deck or an email, so it carries its own
  // share image rather than the site default.
  const image = { url: `${siteUrl}${note.cover.src}`, width: note.cover.width, height: note.cover.height, alt: copy.title };
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", images: [image] },
    twitter: { ...base.twitter, card: "summary_large_image", images: [image.url] }
  };
}

export default async function LabNotePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const note = getLabNote(slug);
  if (!isLocale(locale) || !note) notFound();
  const dict = getDictionary(locale);
  return (
    <div className="subpage lab-note-page">
      <LabNoteArticle locale={locale} dict={dict} note={note} />
    </div>
  );
}
