import type { Dictionary, PipeStage } from "@/lib/i18n";

type Side = {
  overline: string;
  title: string;
  sensors: readonly string[];
  sensorsNote: string;
  stages: readonly PipeStage[];
  costs: readonly string[];
};

// One vertical path per approach. The conventional side lists DRAM twice
// because raw data really is written and read back around CPU pre-processing;
// that repetition is the point the diagram is making.
function Pipeline({ side, sensorsLabel }: { side: Side; sensorsLabel: string }) {
  return (
    <div className="pipe">
      <div className="pipe-sensors">
        <span className="pipe-tag">{sensorsLabel}</span>
        <div className="sensor-stack">
          {side.sensors.map((sensor) => (
            <span key={sensor}>{sensor}</span>
          ))}
          <i aria-hidden="true" />
          <i aria-hidden="true" />
        </div>
        <small>{side.sensorsNote}</small>
      </div>

      {side.stages.map((stage, index) => (
        <div key={stage.name + index} className="pipe-step">
          <div className={`pipe-edge${stage.heavy ? " is-heavy" : ""}`}>
            <span>{stage.edge}</span>
          </div>
          <div className={`pipe-node is-${stage.kind}`}>
            <b>{stage.name}</b>
            <small>{stage.note}</small>
          </div>
        </div>
      ))}

      <ul className="pipe-costs">
        {side.costs.map((cost) => (
          <li key={cost}>{cost}</li>
        ))}
      </ul>
    </div>
  );
}

export function TechnologySection({ dict }: { dict: Dictionary }) {
  const t = dict.technology;
  const conventional = t.conventional as Side;
  const ridm = t.ridm as Side;

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
            <span>{conventional.overline}</span>
            <h3>{conventional.title}</h3>
            <Pipeline side={conventional} sensorsLabel={t.sensorsLabel} />
          </article>
          <article className="ridm-side">
            <span>{ridm.overline}</span>
            <h3>{ridm.title}</h3>
            <Pipeline side={ridm} sensorsLabel={t.sensorsLabel} />
          </article>
        </div>
        <p className="diagram-note">{t.diagramNote}</p>
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
