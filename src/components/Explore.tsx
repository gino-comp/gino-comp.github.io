import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";

export default function ExploreSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cards = [
    { href: `/${locale}/technology`, label: dict.nav.technology, title: dict.doda.title, body: dict.doda.desc },
    { href: `/${locale}/applications`, label: dict.nav.applications, title: dict.applicationsCopy.title, body: dict.applicationsCopy.desc },
    { href: `/${locale}/research`, label: dict.nav.research, title: dict.researchCopy.title, body: dict.researchCopy.desc },
    { href: `/${locale}/company`, label: dict.nav.company, title: dict.company.title, body: dict.company.desc }
  ];

  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{dict.explore.kicker}</div>
            <h2>{dict.explore.title}</h2>
          </div>
          <p>{dict.explore.desc}</p>
        </div>
        <div className="explore-grid">
          {cards.map((card) => (
            <Link key={card.href} className="explore-card" href={card.href}>
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <b>{dict.explore.more} →</b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
