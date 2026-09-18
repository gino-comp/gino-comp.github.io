import type { Locale } from "./i18n";
import { edgefuse } from "@/content/lab-notes/edgefuse";

/* Lab Notes: one living note per project, updated in place rather than
   appended to as a feed. Each note is a fixed set of sections so the page for
   every project reads the same way, and a changelog at the bottom carries the
   history that a feed would otherwise have. Facts (slug, dates, media, stats)
   live once on the note; prose is translated under `copy[locale]`. */

export type LabStat = { value: string; label: string; note?: string };

export type LabMedia =
  | { kind: "gif" | "image"; src: string; width: number; height: number; alt: string }
  | { kind: "compare"; src: string; width: number; height: number; alt: string; left: string; right: string }
  | { kind: "pipeline" };

export type LabFigure = { media: LabMedia; caption?: string; title?: string };

export type LabSection = {
  id: string;
  title: string;
  body?: readonly string[];
  figures?: readonly LabFigure[];
  bullets?: readonly string[];
};

export type LabNoteCopy = {
  title: string;
  tagline: string;
  status: string;
  summary: string;
  sections: readonly LabSection[];
  stats: readonly LabStat[];
  team?: string;
  changelog: readonly { date: string; body: string }[];
};

export type LabNote = {
  slug: string;
  // Partial ISO date of the last substantive update, shown on the index card.
  updated: string;
  // Cover shown on the index card and used for the share preview.
  cover: { src: string; width: number; height: number };
  copy: Record<Locale, LabNoteCopy>;
};

// Index order: the project to show first goes first.
export const labNotes: readonly LabNote[] = [edgefuse];

export function getLabNote(slug: string): LabNote | undefined {
  return labNotes.find((note) => note.slug === slug);
}
