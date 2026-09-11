import type { Locale, Dictionary } from "@/lib/i18n";
import { RidmFlow, type Ridm } from "@/components/DataFlow";
import { WhyPanel } from "@/components/DataMovement";

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
          </div>
        </div>

        <div className="built-for">
          <span className="built-for-label">{dict.hero.builtFor}</span>
          <ul>
            {dict.applications.map((item) => (
              <li key={item.key}>{item.title}</li>
            ))}
          </ul>
        </div>

        {/* The problem first, then the approach. */}
        <WhyPanel dict={dict} />

        {/* Same diagram as the Technology page's RiDM approach, same component. */}
        <div className="system-flow">
          <div className="system-flow-top">
            <span>{dict.hero.stageTitle}</span>
            <small>{dict.technology.diagramNote}</small>
          </div>
          <p className="system-flow-lead">{dict.hero.stageLead}</p>
          <div className="flow-scroll">
            <RidmFlow side={dict.technology.ridm as Ridm} sensorsLabel={dict.technology.sensorsLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
