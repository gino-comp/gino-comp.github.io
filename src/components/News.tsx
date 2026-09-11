import type { Dictionary, Locale, NewsCopy, NewsEntry } from "@/lib/i18n";

const months = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
} as const;

// Entries carry a partial ISO date, and are rendered at exactly the precision
// they were written with rather than padded out to a day we do not know.
function formatDate(date: string, locale: Locale): string {
  const [year, month, day] = date.split("-");
  if (!month) return year;
  const monthName = months[locale][Number(month) - 1];
  if (locale === "ko") {
    return day ? `${year}년 ${monthName} ${Number(day)}일` : `${year}년 ${monthName}`;
  }
  return day ? `${monthName} ${Number(day)}, ${year}` : `${monthName} ${year}`;
}

// Partial ISO strings compare as plain strings, so "2026-03" sorts after the
// year-only "2026" and a new entry can be added anywhere in the dictionary.
function newestFirst(a: NewsEntry, b: NewsEntry): number {
  if (a.date === b.date) return 0;
  return a.date < b.date ? 1 : -1;
}

function EntryLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="news-link" href={href} target="_blank" rel="noopener noreferrer">
      {label} →
    </a>
  );
}

export default function NewsSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const n = dict.newsCopy;
  const entries = [...(dict.news as readonly NewsEntry[])].sort(newestFirst);
  const copyFor = (key: string) => n.items[key as keyof typeof n.items] as NewsCopy;
  const [lead, ...rest] = entries;
  const leadCopy = copyFor(lead.key);

  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{n.kicker}</div>
            <h2>{n.title}</h2>
          </div>
          <p>{n.desc}</p>
        </div>

        <article className="news-lead">
          <div className="news-lead-top">
            <span>{n.latest}</span>
            <time dateTime={lead.date}>{formatDate(lead.date, locale)}</time>
            <b className="news-tag">{lead.category}</b>
          </div>
          <h3>{leadCopy.title}</h3>
          <p>{leadCopy.body}</p>
          {leadCopy.href ? <EntryLink href={leadCopy.href} label={leadCopy.linkLabel ?? n.link} /> : null}
        </article>

        <div className="news-feed">
          {rest.map((entry) => {
            const copy = copyFor(entry.key);
            return (
              <article className="news-row" key={entry.key}>
                <div className="news-meta">
                  <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
                  <b className="news-tag">{entry.category}</b>
                </div>
                <div>
                  <h3>{copy.title}</h3>
                  <p>{copy.body}</p>
                  {copy.href ? <EntryLink href={copy.href} label={copy.linkLabel ?? n.link} /> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
