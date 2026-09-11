import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";
import { RidmFlow, type Ridm } from "@/components/DataFlow";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">{dict.hero.label}</div>
            <h1>
              {dict.hero.lead} <span>{dict.hero.accent}</span>
            </h1>
          </div>
          <div className="hero-copy">
            <p>{dict.hero.body}</p>
            <div className="button-row">
              <Link className="button primary" href={`/${locale}/technology`}>
                {dict.hero.ctaPrimary}
              </Link>
              <Link className="button secondary" href={`/${locale}/about`}>
                {dict.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        <div className="word-cycle" aria-label="Application areas">
          <span className="word-cycle-label">{dict.hero.builtFor}</span>
          <div className="word-cycle-window">
            <div className="word-cycle-list">
              {dict.applications.map((item) => (
                <span key={item.key}>{item.title}</span>
              ))}
              <span>{dict.applications[0].title}</span>
            </div>
          </div>
        </div>

        {/* Same diagram as the Technology page's RiDM approach, same component. */}
        <div className="system-flow">
          <div className="system-flow-top">
            <span>{dict.hero.stageTitle}</span>
            <small>{dict.technology.diagramNote}</small>
          </div>
          <div className="flow-scroll">
            <RidmFlow side={dict.technology.ridm as Ridm} sensorsLabel={dict.technology.sensorsLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
