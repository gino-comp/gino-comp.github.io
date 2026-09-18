import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { LabFigure, LabNote, LabNoteCopy } from "@/lib/lab-notes";
import { labNotes } from "@/lib/lab-notes";
import { formatDate } from "@/components/News";
import StreamingPipeline from "@/components/StreamingPipeline";

/* ---------- index: one card per project ---------- */

export function LabNotesIndex({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const l = dict.labNotes;
  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{l.kicker}</div>
            <h2>{l.title}</h2>
          </div>
          <p>{l.desc}</p>
        </div>
        <div className="lab-grid">
          {labNotes.map((note) => {
            const copy = note.copy[locale];
            return (
              <Link key={note.slug} className="lab-card" href={`/${locale}/lab-notes/${note.slug}`}>
                <div className="lab-card-cover">
                  <Image src={note.cover.src} alt="" width={note.cover.width} height={note.cover.height} />
                </div>
                <div className="lab-card-body">
                  <div className="lab-card-meta">
                    <b className="news-tag">{copy.status}</b>
                    <time dateTime={note.updated}>{l.updated} {formatDate(note.updated, locale)}</time>
                  </div>
                  <h3>{copy.title}</h3>
                  <p className="lab-card-tagline">{copy.tagline}</p>
                  <p>{copy.summary}</p>
                  <span>{l.open} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- one note ---------- */

function Figure({ figure, dict }: { figure: LabFigure; dict: Dictionary }) {
  const { media, caption } = figure;
  if (media.kind === "pipeline") {
    return (
      <figure className="lab-figure is-diagram">
        <div className="flow-scroll">
          <StreamingPipeline labels={dict.labNotes.pipeline} />
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }
  if (media.kind === "compare") {
    return (
      <figure className="lab-figure is-compare">
        <div className="lab-compare-labels" aria-hidden="true">
          <span>{media.left}</span>
          <span className="is-live">{media.right}</span>
        </div>
        {/* GIFs go through a plain img: next/image would re-encode the first frame only. */}
        <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }
  return (
    <figure className={`lab-figure is-${media.kind}`}>
      {media.kind === "gif" ? (
        <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" />
      ) : (
        <Image src={media.src} alt={media.alt} width={media.width} height={media.height} />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function LabNoteArticle({ locale, dict, note }: { locale: Locale; dict: Dictionary; note: LabNote }) {
  const l = dict.labNotes;
  const copy: LabNoteCopy = note.copy[locale];

  return (
    <article className="lab-note">
      <section className="section dark-section lab-note-head">
        <div className="container">
          <Link className="lab-back" href={`/${locale}/lab-notes`}>← {l.back}</Link>
          <div className="lab-note-top">
            <b className="news-tag">{copy.status}</b>
            <time dateTime={note.updated}>{l.updated} {formatDate(note.updated, locale)}</time>
          </div>
          <h1>{copy.title}</h1>
          <p className="lab-note-tagline">{copy.tagline}</p>
          <p className="lab-note-summary">{copy.summary}</p>

          <div className="lab-stats" aria-label={l.results}>
            {copy.stats.map((stat) => (
              <div key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
                {stat.note ? <small>{stat.note}</small> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container lab-note-layout">
        <aside className="lab-toc" aria-label={l.contents}>
          <span>{l.contents}</span>
          <ol>
            {copy.sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
            ))}
            <li><a href="#changelog">{l.changelog}</a></li>
          </ol>
        </aside>

        <div className="lab-sections">
          {copy.sections.map((section, i) => (
            <section key={section.id} id={section.id} className="lab-section">
              <div className="lab-section-head">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
              </div>
              {section.body?.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
              {section.bullets ? (
                <ul className="lab-bullets">{section.bullets.map((line) => <li key={line}>{line}</li>)}</ul>
              ) : null}
              {section.figures ? (
                <div className={`lab-figures ${section.figures.length > 1 ? "is-pair" : ""}`}>
                  {section.figures.map((figure, j) => <Figure key={j} figure={figure} dict={dict} />)}
                </div>
              ) : null}
            </section>
          ))}

          <section id="changelog" className="lab-section lab-changelog">
            <div className="lab-section-head">
              <span>+</span>
              <h2>{l.changelog}</h2>
            </div>
            <ol>
              {copy.changelog.map((entry) => (
                <li key={entry.date + entry.body.slice(0, 20)}>
                  <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
                  <p>{entry.body}</p>
                </li>
              ))}
            </ol>
            {copy.team ? (
              <p className="lab-team"><span>{l.team}</span> {copy.team}</p>
            ) : null}
          </section>
        </div>
      </div>
    </article>
  );
}
