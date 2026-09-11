import { Fragment } from "react";

/* The two animated data-path diagrams. Technology shows them side by side
   as a comparison; the homepage hero shows the RiDM one on its own. One
   source, so the two pages cannot drift apart. */

export type Conventional = {
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

// SVG text does not wrap, so a note that will not fit its box is passed as
// separate lines rather than one string.
function Box({ x, y, w, h, title, note, variant = "plain" }: {
  x: number; y: number; w: number; h: number; title: string;
  note?: string | readonly string[];
  variant?: "plain" | "memory" | "chip" | "doda";
}) {
  const lines = note === undefined ? [] : typeof note === "string" ? [note] : note;
  const titleY = lines.length === 0 ? y + h / 2 + 4 : y + h / 2 - 4 - (lines.length - 1) * 6;
  return (
    <g className={`fl-box is-${variant}`}>
      <rect x={x} y={y} width={w} height={h} rx="10" />
      <text x={x + 14} y={titleY} className="fl-title">{title}</text>
      {lines.map((line, i) => (
        <text key={line} x={x + 14} y={titleY + 18 + i * 13} className="fl-note">{line}</text>
      ))}
    </g>
  );
}

export function ConventionalFlow({ side, sensorsLabel }: { side: Conventional; sensorsLabel: string }) {
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

export type Ridm = {
  overline: string;
  title: string;
  sensors: readonly string[];
  processor: { name: string; note: readonly string[]; modules: readonly string[] };
  memory: { name: string; note: string };
  accel: { name: string; note: string };
  edges: { reduced: string; infer: string };
  costs: readonly string[];
};

/* The answer to the conventional diagram, on the same 10s clock and with the
   same sensor rhythm, so the two can be watched side by side. Everything after
   the sensors differs: the path is a straight spine rather than a fan out to a
   stack, all four streams are handled in the same pass instead of in turn, and
   what leaves DODA is reduced, so it crosses memory once. */

/* Sensor rows and module rows share the same y centres, so the lanes into the
   processor are dead straight and never converge. Four arrows meeting at one box was reading
   as a funnel, the same shape as the DRAM bottleneck above it. Convergence
   happens only after the PEs, where it means sensor fusion. */

const R_SENSOR_Y = [74, 114, 154, 194];
const R_SENSOR_H = 32;
const R_CENTRES = R_SENSOR_Y.map((y) => y + R_SENSOR_H / 2);
const PROC = { x: 200, y: 14, w: 250, h: 224 };
const MODULE = { x: 216, w: 150, h: 26 };
const JOIN = { x: PROC.x + PROC.w, y: 150 };
const RMEM = { x: 530, y: 120, w: 160, h: 60 };
const R_ACCEL = { x: 750, y: 120, w: 222, h: 60 };

export function RidmFlow({ side, sensorsLabel }: { side: Ridm; sensorsLabel: string }) {
  const lanes = R_CENTRES.map((c, i) => ({ id: `rl${i}`, d: `M140,${c} L ${MODULE.x},${c}` }));
  const fuses = R_CENTRES.map((c, i) => ({
    id: `rf${i}`,
    d: `M${MODULE.x + MODULE.w},${c} C ${MODULE.x + MODULE.w + 42},${c} ${JOIN.x - 36},${JOIN.y} ${JOIN.x},${JOIN.y}`
  }));
  const beats = [0, 1.7, 3.4, 5.1, 6.8];

  return (
    <svg className="flow-svg is-ridm" viewBox="0 0 980 264" role="img" aria-label={side.title}>
      <defs>
        <marker id="rdArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={REDUCED} />
        </marker>
        {lanes.map((p) => <path key={p.id} id={p.id} d={p.d} />)}
        {fuses.map((p) => <path key={p.id} id={p.id} d={p.d} />)}
        <path id="rdOut" d={`M${JOIN.x},${JOIN.y} L ${RMEM.x},${JOIN.y}`} />
        <path id="rdInfer" d={`M${RMEM.x + RMEM.w},${JOIN.y} L ${R_ACCEL.x},${JOIN.y}`} />
      </defs>

      <text x="8" y="62" className="fl-tag">{sensorsLabel}</text>
      {side.sensors.map((sensor, i) => (
        <Box key={sensor} x={8} y={R_SENSOR_Y[i]} w={132} h={R_SENSOR_H} title={sensor} variant="chip" />
      ))}
      <rect className="fl-sliver" x="8" y="232" width="132" height="6" rx="3" />
      <rect className="fl-sliver is-faint" x="8" y="242" width="132" height="6" rx="3" />

      <rect className="fl-processor" x={PROC.x} y={PROC.y} width={PROC.w} height={PROC.h} rx="12" />
      <text x={PROC.x + 16} y={PROC.y + 26} className="fl-processor-name">{side.processor.name}</text>
      {side.processor.note.map((line, i) => (
        <text key={line} x={PROC.x + 16} y={PROC.y + 44 + i * 12} className="fl-note">{line}</text>
      ))}

      {lanes.map((p) => <use key={p.id} href={`#${p.id}`} className="fl-path is-live" />)}
      {fuses.map((p) => <use key={p.id} href={`#${p.id}`} className="fl-path is-live" />)}
      <circle className="fl-join" cx={JOIN.x} cy={JOIN.y} r="4.5" />
      <use href="#rdOut" className="fl-path" markerEnd="url(#rdArrow)" />
      <use href="#rdInfer" className="fl-path" markerEnd="url(#rdArrow)" />

      {R_CENTRES.map((c, i) => (
        <g key={c} className="fl-module">
          <rect x={MODULE.x} y={c - MODULE.h / 2} width={MODULE.w} height={MODULE.h} rx="7" />
          <text x={MODULE.x + MODULE.w / 2} y={c + 4} textAnchor="middle">{side.processor.modules[i]}</text>
        </g>
      ))}

      <text x={(JOIN.x + RMEM.x) / 2} y={RMEM.y - 10} textAnchor="middle" className="fl-edge">{side.edges.reduced}</text>
      <text x={(RMEM.x + RMEM.w + R_ACCEL.x) / 2} y={RMEM.y - 10} textAnchor="middle" className="fl-edge">{side.edges.infer}</text>

      <Box x={RMEM.x} y={RMEM.y} w={RMEM.w} h={RMEM.h} title={side.memory.name} note={side.memory.note} variant="memory" />
      <Box x={R_ACCEL.x} y={R_ACCEL.y} w={R_ACCEL.w} h={R_ACCEL.h} title={side.accel.name} note={side.accel.note} />

      <g className="flow-dots">
        {lanes.map((p) => (
          <Fragment key={p.id}>
            {beats.map((b) => <Dot key={b} path={p.id} start={b} travel={0.45} colour="#30ddd4" />)}
          </Fragment>
        ))}
        {/* All four leave their module together and merge: that is the fusion. */}
        {fuses.map((p) => (
          <Fragment key={p.id}>
            {beats.map((b) => <Dot key={b} path={p.id} start={b + 0.6} travel={0.4} colour="#30ddd4" r={4} />)}
          </Fragment>
        ))}
        {beats.map((b) => (
          <Fragment key={`o${b}`}>
            <Dot path="rdOut" start={b + 1.05} travel={0.35} colour={REDUCED} r={3.5} />
            <Dot path="rdInfer" start={b + 1.5} travel={0.35} colour={REDUCED} r={3.5} />
          </Fragment>
        ))}
      </g>
    </svg>
  );
}
