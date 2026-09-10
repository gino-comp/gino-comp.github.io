import { Fragment } from "react";
import type { Dictionary, PipeStage } from "@/lib/i18n";

type Side = {
  overline: string;
  title: string;
  sensors: readonly string[];
  stages: readonly PipeStage[];
  costs: readonly string[];
};

type Conventional = {
  overline: string;
  title: string;
  sensors: readonly string[];
  memory: { name: string; note: string };
  compute: readonly { name: string; note: string }[];
  edges: { ingest: string; cpu: string; infer: string };
  costs: readonly string[];
};

/* ---------- animated conventional data path ----------

   Sensors write in parallel and continuously; the CPU pulls one stream at a
   time, writes it back, and only then does an accelerator read it. The whole
   point is the mismatch between the parallel left half and the serial right
   half, so the two halves are timed independently: ingest dots loop freely
   while CPU traffic is slotted into a 10s round-robin over the four streams.

   Motion is SMIL rather than CSS so the dots follow the drawn paths by
   reference instead of duplicating the path data in a stylesheet. */

const CYCLE = 10;
const SLOT = CYCLE / 4;
const RAW = "#c98a45";
const REDUCED = "#7f8b99";

const SENSOR_Y = [24, 68, 112, 156];
const MEM = { x: 320, y: 90, w: 180, h: 100 };
const CPU_Y = 60;
const GPU_Y = 208;

// A dot that travels its path once inside `start`..`start + travel`, then
// waits out the rest of the cycle. keyPoints reversed sends it backwards.
function Dot({ path, start, travel, colour, back = false, r = 4.5 }: {
  path: string;
  start: number;
  travel: number;
  colour: string;
  back?: boolean;
  r?: number;
}) {
  const t0 = +(start / CYCLE).toFixed(4);
  const t1 = +((start + travel) / CYCLE).toFixed(4);
  const points = back ? "1;1;0;0" : "0;0;1;1";
  return (
    <circle r={r} fill={colour} opacity="0">
      <animateMotion
        dur={`${CYCLE}s`}
        repeatCount="indefinite"
        calcMode="linear"
        keyTimes={`0;${t0};${t1};1`}
        keyPoints={points}
      >
        <mpath href={`#${path}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        dur={`${CYCLE}s`}
        repeatCount="indefinite"
        calcMode="linear"
        keyTimes={`0;${t0};${Math.min(t0 + 0.004, t1)};${t1};${Math.min(t1 + 0.004, 1)};1`}
        values="0;0;1;1;0;0"
      />
    </circle>
  );
}

function Box({ x, y, w, h, title, note, variant = "plain" }: {
  x: number; y: number; w: number; h: number; title: string; note?: string;
  variant?: "plain" | "memory" | "chip";
}) {
  return (
    <g className={`fl-box is-${variant}`}>
      <rect x={x} y={y} width={w} height={h} rx="10" />
      <text x={x + 14} y={note ? y + h / 2 - 4 : y + h / 2 + 4} className="fl-title">{title}</text>
      {note ? <text x={x + 14} y={y + h / 2 + 14} className="fl-note">{note}</text> : null}
    </g>
  );
}

function ConventionalFlow({ side, sensorsLabel }: { side: Conventional; sensorsLabel: string }) {
  const [cpu, accel] = side.compute;
  const ingest = SENSOR_Y.map((y, i) => ({
    id: `cin${i}`,
    d: `M140,${y + 18} C 220,${y + 18} 240,${MEM.y + MEM.h / 2} ${MEM.x},${MEM.y + MEM.h / 2}`
  }));

  return (
    <svg className="flow-svg" viewBox="0 0 980 250" role="img" aria-label={side.title}>
      <defs>
        <marker id="cvArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={REDUCED} />
        </marker>
        <marker id="cvArrowRaw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={RAW} />
        </marker>
        {ingest.map((p) => <path key={p.id} id={p.id} d={p.d} />)}
        <path id="cvCpu" d={`M${MEM.x + MEM.w},116 C 590,116 620,${CPU_Y} 700,${CPU_Y}`} />
        <path id="cvGpu" d={`M${MEM.x + MEM.w},168 C 590,168 620,${GPU_Y} 700,${GPU_Y}`} />
      </defs>

      <text x="8" y="12" className="fl-tag">{sensorsLabel}</text>
      {side.sensors.map((sensor, i) => (
        <Box key={sensor} x={8} y={SENSOR_Y[i]} w={132} h={36} title={sensor} variant="chip" />
      ))}
      <rect className="fl-sliver" x="8" y="200" width="132" height="6" rx="3" />
      <rect className="fl-sliver is-faint" x="8" y="212" width="132" height="6" rx="3" />

      {ingest.map((p) => <use key={p.id} href={`#${p.id}`} className="fl-path is-raw" markerEnd="url(#cvArrowRaw)" />)}
      <use href="#cvCpu" className="fl-path is-raw" />
      <use href="#cvGpu" className="fl-path" markerEnd="url(#cvArrow)" />

      <text x="168" y="206" className="fl-edge is-raw">{side.edges.ingest}</text>
      <text x="528" y="84" className="fl-edge is-raw">{side.edges.cpu}</text>
      <text x="548" y="196" className="fl-edge">{side.edges.infer}</text>

      <Box x={MEM.x} y={MEM.y} w={MEM.w} h={MEM.h} title={side.memory.name} note={side.memory.note} variant="memory" />
      <Box x={700} y={CPU_Y - 30} w={272} h={60} title={cpu.name} note={cpu.note} />
      <Box x={700} y={GPU_Y - 30} w={272} h={60} title={accel.name} note={accel.note} />

      <g className="flow-dots">
        {/* Sensors write continuously and in parallel, independent of the CPU. */}
        {ingest.map((p, i) => (
          <Fragment key={p.id}>
            <Dot path={p.id} start={i * 0.12} travel={1.6} colour={RAW} />
            <Dot path={p.id} start={i * 0.12 + 1.7} travel={1.6} colour={RAW} />
            <Dot path={p.id} start={i * 0.12 + 3.4} travel={1.6} colour={RAW} />
            <Dot path={p.id} start={i * 0.12 + 5.1} travel={1.6} colour={RAW} />
            <Dot path={p.id} start={i * 0.12 + 6.8} travel={1.6} colour={RAW} />
          </Fragment>
        ))}

        {/* One stream at a time: read, then write back, then an accelerator
            reads it. Each sensor gets a 2.5s slot. */}
        {SENSOR_Y.map((_, i) => (
          <Fragment key={`turn${i}`}>
            <Dot path="cvCpu" start={i * SLOT} travel={0.8} colour={RAW} r={5} />
            <Dot path="cvCpu" start={i * SLOT + 1.0} travel={0.8} colour={RAW} r={5} back />
            <Dot path="cvGpu" start={i * SLOT + 1.9} travel={0.6} colour={REDUCED} r={5} />
          </Fragment>
        ))}
      </g>
    </svg>
  );
}

// One vertical path per approach, run left to right. Node and edge widths are
// fixed, so the RiDM row ends short of the conventional one.
function Pipeline({ side, sensorsLabel }: { side: Side; sensorsLabel: string }) {
  return (
    <div className="pipe-wrap">
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
      </div>

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
  const conventional = t.conventional as Conventional;
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
          {/* Two entries share the value "3"; the label is what's unique. */}
          {d.proof.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
