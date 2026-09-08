import type { Dictionary } from "@/lib/i18n";

export function TechnologySection({ dict }: { dict: Dictionary }) {
  const t = dict.technology;
  return (
    <section className="section dark-section">
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
            <span>{t.conventional.overline}</span>
            <h3>{t.conventional.title}</h3>
            <p>{t.conventional.body}</p>
            <div className="mini-flow">
              <b>Sensors</b><i>→</i><b>Raw Data</b><i>→</i><b>CPU / GPU</b>
            </div>
            <small>{t.conventional.caption}</small>
          </article>
          <article className="ridm-side">
            <span>{t.ridm.overline}</span>
            <h3>{t.ridm.title}</h3>
            <p>{t.ridm.body}</p>
            <div className="mini-flow">
              <b>Sensors</b><i>→</i><b className="highlight">DODA</b><i>→</i><b>Processed Data</b><i>→</i><b>CPU / GPU</b>
            </div>
            <small>{t.ridm.caption}</small>
          </article>
        </div>
      </div>
    </section>
  );
}

export function DodaSection({ dict }: { dict: Dictionary }) {
  const d = dict.doda;
  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{d.kicker}</div>
            <h2>{d.title}</h2>
          </div>
          <p>{d.desc}</p>
        </div>

        <div className="doda-grid">
          <article className="doda-feature">
            <span>{d.fullName}</span>
            <div className="doda-word">DODA</div>
            <p>{d.body}</p>
            <div className="doda-flow">
              <div><strong>Sensor Data</strong><small>continuous input</small></div>
              <i>→</i>
              <div className="center"><strong>DODA Fabric</strong><small>filter · fuse · process</small></div>
              <i>→</i>
              <div><strong>Host Compute</strong><small>higher-value data</small></div>
            </div>
          </article>

          <div className="principles">
            {d.priorities.map((item) => (
              <article key={item.n}>
                <span>{item.n}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="proof-grid">
          {d.proof.map(([value, label]) => (
            <div key={value}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
