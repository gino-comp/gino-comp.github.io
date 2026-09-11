import { Fragment } from "react";
import type { AcronymPart, Dictionary } from "@/lib/i18n";
import { ConventionalFlow, RidmFlow, type Conventional, type Ridm } from "@/components/DataFlow";

export function TechnologySection({ dict }: { dict: Dictionary }) {
  const t = dict.technology;
  const conventional = t.conventional as Conventional;
  const ridm = t.ridm as Ridm;

  return (
    <section id="near-sensor" className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{t.kicker}</div>
            <h2>{t.title}</h2>
          </div>
          <p>{t.desc}</p>
        </div>

        <div className="problem-grid">
          <article>
            <span>{conventional.overline}</span>
            <h3>{conventional.title}</h3>
            <div className="flow-scroll">
              <ConventionalFlow side={conventional} sensorsLabel={t.sensorsLabel} />
            </div>
            <ul className="pipe-costs">
              {conventional.costs.map((cost) => (
                <li key={cost}>{cost}</li>
              ))}
            </ul>
          </article>
          <article className="ridm-side">
            <span>{ridm.overline}</span>
            <h3>{ridm.title}</h3>
            <div className="flow-scroll">
              <RidmFlow side={ridm} sensorsLabel={t.sensorsLabel} />
            </div>
            <ul className="pipe-costs">
              {ridm.costs.map((cost) => (
                <li key={cost}>{cost}</li>
              ))}
            </ul>
          </article>
        </div>
        <p className="diagram-note">{t.diagramNote}</p>
      </div>
    </section>
  );
}

type Lineage = {
  step: string;
  title: string;
  body: string;
  href: string | null;
  linkLabel: string | null;
};

export function DodaSection({ dict }: { dict: Dictionary }) {
  const d = dict.doda;
  const expansion = d.acronym.expansion as readonly AcronymPart[];
  const lineage = d.lineage as readonly Lineage[];

  return (
    <section id="doda" className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{d.kicker}</div>
            <h2>{d.title}</h2>
          </div>
          <p>{d.desc}</p>
        </div>

        {/* Same treatment as the RiDM acronym on the About page: the initials
            carry the brand ramp, the rest of each word recedes. */}
        <div className="acronym">
          <span>{d.acronym.kicker}</span>
          <p className="acronym-expansion">
            {expansion.map(([initial, rest], index) => (
              <Fragment key={initial + rest}>
                {index > 0 ? " " : null}
                <b>{initial}</b>
                <span>{rest}</span>
              </Fragment>
            ))}
          </p>
          <p className="acronym-note">{d.acronym.note}</p>
        </div>

        <div className="lineage-head">
          <span>{d.lineageKicker}</span>
          <h3>{d.lineageTitle}</h3>
        </div>
        <div className="lineage">
          {lineage.map((item) => (
            <article key={item.step}>
              <b>{item.step}</b>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
              {item.href && item.linkLabel ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.linkLabel} ↗</a>
              ) : (
                <ul className="patent-codes">
                  {dict.patents.map((patent) => (
                    <li key={patent.code}><b>{patent.code}</b><span>{patent.title}</span></li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <aside id="simulator" className="simulator">
          <div>
            <span>{d.simulator.kicker}</span>
            <h3>{d.simulator.title}</h3>
            <p>{d.simulator.body}</p>
          </div>
          <a className="button primary" href={d.simulator.href} target="_blank" rel="noopener noreferrer">
            {d.simulator.cta}
          </a>
        </aside>
      </div>
    </section>
  );
}
