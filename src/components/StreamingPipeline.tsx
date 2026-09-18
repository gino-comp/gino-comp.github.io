/* "Process as pixels arrive": the timing argument behind DODA preprocessing,
   as one looping diagram. The same frame arrives on both lanes over the same
   window; the CPU lane cannot start preprocessing until the whole frame is
   in, while the DODA lane preprocesses in step with arrival and hands the
   application a finished image the moment the last pixel lands.

   Motion is SMIL so the bars are timed against one shared cycle and the
   diagram stays a single self-contained SVG. A static copy of the finished
   state sits underneath for reduced-motion, where the animated group is
   hidden by the stylesheet. */

import type { ReactNode } from "react";

export type PipelineLabels = {
  cpuLane: string;
  dodaLane: string;
  input: string;
  arriving: string;
  preprocess: string;
  application: string;
  output: string;
  done: string;
  waits: string;
  streams: string;
  preprocessed: string;
  speedup: string;
  earlier: string;
};

const CYCLE = 8;
// Seconds into the cycle. The frame takes ARRIVE to land on both lanes.
const ARRIVE = 3;
const CPU_PRE = [ARRIVE, ARRIVE + 2] as const;
const CPU_APP = [CPU_PRE[1], CPU_PRE[1] + 1.5] as const;
const DODA_PRE = [0.15, ARRIVE + 0.15] as const;
const DODA_APP = [DODA_PRE[1], DODA_PRE[1] + 1.5] as const;

const GRID = { cols: 14, rows: 9, cell: 9, gap: 1.5 };
const GRID_W = GRID.cols * (GRID.cell + GRID.gap) - GRID.gap;
const GRID_H = GRID.rows * (GRID.cell + GRID.gap) - GRID.gap;

const t = (s: number) => +(s / CYCLE).toFixed(4);

// A bar that stays empty until `from`, fills linearly until `to`, then holds
// full for the rest of the cycle.
function Bar({ x, y, w, from, to, colour }: { x: number; y: number; w: number; from: number; to: number; colour: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="4" rx="2" fill="rgba(255,255,255,.07)" />
      <rect x={x} y={y} width="0" height="4" rx="2" fill={colour}>
        <animate attributeName="width" dur={`${CYCLE}s`} repeatCount="indefinite" calcMode="linear" keyTimes={`0;${t(from)};${t(to)};1`} values={`0;0;${w};${w}`} />
      </rect>
    </g>
  );
}

// Appears at `at` and stays until the cycle ends.
function Appear({ at, children }: { at: number; children: ReactNode }) {
  const a = t(at);
  return (
    <g opacity="0">
      <animate attributeName="opacity" dur={`${CYCLE}s`} repeatCount="indefinite" calcMode="discrete" keyTimes={`0;${a};1`} values="0;1;1" />
      {children}
    </g>
  );
}

function PixelGrid({ x, y, id, animate }: { x: number; y: number; id: string; animate: boolean }) {
  const cells: ReactNode[] = [];
  for (let r = 0; r < GRID.rows; r++) {
    for (let c = 0; c < GRID.cols; c++) {
      cells.push(<rect key={`${r}-${c}`} x={x + c * (GRID.cell + GRID.gap)} y={y + r * (GRID.cell + GRID.gap)} width={GRID.cell} height={GRID.cell} rx="1.2" />);
    }
  }
  return (
    <g>
      <rect x={x - 8} y={y - 8} width={GRID_W + 16} height={GRID_H + 16} rx="8" className="sp-frame" />
      <g className="sp-cell is-empty">{cells}</g>
      <clipPath id={id}>
        <rect x={x} y={y} width={GRID_W} height={animate ? 0 : GRID_H}>
          {animate ? (
            <animate attributeName="height" dur={`${CYCLE}s`} repeatCount="indefinite" calcMode="linear" keyTimes={`0;${t(ARRIVE)};1`} values={`0;${GRID_H};${GRID_H}`} />
          ) : null}
        </rect>
      </clipPath>
      <g className="sp-cell is-live" clipPath={`url(#${id})`}>{cells}</g>
    </g>
  );
}

function Box({ x, y, w, h, title, kicker, variant = "plain" }: { x: number; y: number; w: number; h: number; title: string; kicker?: string; variant?: "plain" | "cpu" | "doda" | "out" }) {
  return (
    <g className={`sp-box is-${variant}`}>
      <rect x={x} y={y} width={w} height={h} rx="9" />
      {kicker ? <text x={x + 12} y={y + 16} className="sp-kicker">{kicker}</text> : null}
      <text x={x + w / 2} y={y + h / 2 + (kicker ? 8 : 4)} textAnchor="middle" className="sp-title">{title}</text>
    </g>
  );
}

function Arrow({ x1, x2, y, live = false }: { x1: number; x2: number; y: number; live?: boolean }) {
  return <line x1={x1} y1={y} x2={x2} y2={y} className={`sp-arrow ${live ? "is-live" : ""}`} markerEnd={`url(#spArrow${live ? "Live" : ""})`} />;
}

export default function StreamingPipeline({ labels }: { labels: PipelineLabels }) {
  const L = { grid: 40, box: 230 };
  const laneA = 34;
  const laneB = 214;
  const boxH = 74;
  const cpu = { x: L.box, w: 320 };
  const outA = { x: cpu.x + cpu.w + 46, w: 96 };
  const doda = { x: L.box, w: 132 };
  const small = { x: doda.x + doda.w + 44, w: 44 };
  const app = { x: small.x + small.w + 44, w: 150 };
  const outB = { x: app.x + app.w + 46, w: 96 };

  const lane = (y: number, animate: boolean, key: string) => (
    <g key={key}>
      <PixelGrid x={L.grid} y={y + 10} id={`spClip-${key}-a`} animate={animate} />
      <text x={L.grid - 8} y={y + boxH + 42} className="sp-note">{labels.input}</text>
      <text x={L.grid - 8} y={y + boxH + 54} className="sp-note is-faint">{labels.arriving}</text>
    </g>
  );

  const cpuLane = (animate: boolean, key: string) => (
    <g key={key}>
      {lane(laneA, animate, `${key}-cpu`)}
      <Arrow x1={L.grid + GRID_W + 14} x2={cpu.x - 6} y={laneA + boxH / 2 + 2} />
      <Box x={cpu.x} y={laneA} w={cpu.w} h={boxH} kicker="CPU" title="" variant="cpu" />
      <text x={cpu.x + 90} y={laneA + 44} textAnchor="middle" className="sp-title">{labels.preprocess}</text>
      <text x={cpu.x + 232} y={laneA + 44} textAnchor="middle" className="sp-title">{labels.application}</text>
      <line x1={cpu.x + 156} y1={laneA + 40} x2={cpu.x + 170} y2={laneA + 40} className="sp-arrow" markerEnd="url(#spArrow)" />
      {animate ? (
        <>
          <Bar x={cpu.x + 26} y={laneA + 54} w={128} from={CPU_PRE[0]} to={CPU_PRE[1]} colour="#d3a06a" />
          <Bar x={cpu.x + 172} y={laneA + 54} w={120} from={CPU_APP[0]} to={CPU_APP[1]} colour="#d3a06a" />
        </>
      ) : (
        <>
          <rect x={cpu.x + 26} y={laneA + 54} width="128" height="4" rx="2" fill="#d3a06a" />
          <rect x={cpu.x + 172} y={laneA + 54} width="120" height="4" rx="2" fill="#d3a06a" />
        </>
      )}
      <Arrow x1={cpu.x + cpu.w + 8} x2={outA.x - 6} y={laneA + boxH / 2 + 2} />
      <Box x={outA.x} y={laneA + 16} w={outA.w} h={42} title={labels.output} variant="out" />
      {animate ? (
        <>
          <g opacity="1">
            <animate attributeName="opacity" dur={`${CYCLE}s`} repeatCount="indefinite" calcMode="discrete" keyTimes={`0;${t(ARRIVE)};1`} values="1;0;0" />
            <text x={cpu.x + cpu.w / 2} y={laneA + boxH + 22} textAnchor="middle" className="sp-callout is-warm">{labels.waits}</text>
          </g>
          <Appear at={CPU_APP[1]}>
            <text x={outA.x + outA.w / 2} y={laneA + 76} textAnchor="middle" className="sp-callout">{labels.done}</text>
          </Appear>
        </>
      ) : (
        <text x={outA.x + outA.w / 2} y={laneA + 76} textAnchor="middle" className="sp-callout">{labels.done}</text>
      )}
    </g>
  );

  const dodaLane = (animate: boolean, key: string) => (
    <g key={key}>
      {lane(laneB, animate, `${key}-doda`)}
      <Arrow x1={L.grid + GRID_W + 14} x2={doda.x - 6} y={laneB + boxH / 2 + 2} live />
      <Box x={doda.x} y={laneB} w={doda.w} h={boxH} kicker="DODA" title={labels.preprocess} variant="doda" />
      {animate ? (
        <Bar x={doda.x + 18} y={laneB + 54} w={doda.w - 36} from={DODA_PRE[0]} to={DODA_PRE[1]} colour="#30ddd4" />
      ) : (
        <rect x={doda.x + 18} y={laneB + 54} width={doda.w - 36} height="4" rx="2" fill="#30ddd4" />
      )}
      <text x={doda.x + doda.w / 2} y={laneB + boxH + 22} textAnchor="middle" className="sp-callout is-live">{labels.streams}</text>
      <Arrow x1={doda.x + doda.w + 8} x2={small.x - 6} y={laneB + boxH / 2 + 2} live />
      <g className="sp-box is-doda">
        <rect x={small.x} y={laneB + 15} width={small.w} height={44} rx="7" />
        <g className="sp-cell is-live" transform={`translate(${small.x + 8} ${laneB + 23}) scale(0.32)`}>
          {Array.from({ length: 4 * 6 }, (_, i) => (
            <rect key={i} x={(i % 6) * 15} y={Math.floor(i / 6) * 22} width="12" height="18" rx="2" opacity={animate ? 0 : 1}>
              {animate ? (
                <animate attributeName="opacity" dur={`${CYCLE}s`} repeatCount="indefinite" calcMode="discrete" keyTimes={`0;${t(DODA_PRE[0] + ((Math.floor(i / 6) + 1) / 4) * ARRIVE)};1`} values="0;1;1" />
              ) : null}
            </rect>
          ))}
        </g>
      </g>
      <text x={small.x + small.w / 2} y={laneB + boxH + 22} textAnchor="middle" className="sp-note">{labels.preprocessed}</text>
      <Arrow x1={small.x + small.w + 8} x2={app.x - 6} y={laneB + boxH / 2 + 2} live />
      <Box x={app.x} y={laneB} w={app.w} h={boxH} kicker="CPU" title={labels.application} variant="cpu" />
      {animate ? (
        <Bar x={app.x + 18} y={laneB + 54} w={app.w - 36} from={DODA_APP[0]} to={DODA_APP[1]} colour="#d3a06a" />
      ) : (
        <rect x={app.x + 18} y={laneB + 54} width={app.w - 36} height="4" rx="2" fill="#d3a06a" />
      )}
      <Arrow x1={app.x + app.w + 8} x2={outB.x - 6} y={laneB + boxH / 2 + 2} />
      <Box x={outB.x} y={laneB + 16} w={outB.w} h={42} title={labels.output} variant="out" />
      {animate ? (
        <Appear at={DODA_APP[1]}>
          <text x={outB.x + outB.w / 2} y={laneB + 76} textAnchor="middle" className="sp-callout is-live">{labels.done}</text>
          <text x={outB.x + outB.w / 2} y={laneB + 90} textAnchor="middle" className="sp-note is-live">{labels.earlier}</text>
        </Appear>
      ) : (
        <>
          <text x={outB.x + outB.w / 2} y={laneB + 76} textAnchor="middle" className="sp-callout is-live">{labels.done}</text>
          <text x={outB.x + outB.w / 2} y={laneB + 90} textAnchor="middle" className="sp-note is-live">{labels.earlier}</text>
        </>
      )}
    </g>
  );

  const frame = (animate: boolean, key: string) => (
    <g className={animate ? "sp-anim" : "sp-static"} key={key}>
      <text x={L.grid - 8} y={laneA - 12} className="sp-lane is-warm">{labels.cpuLane}</text>
      {cpuLane(animate, key)}
      <line x1={L.grid - 8} y1={laneB - 30} x2={900} y2={laneB - 30} className="sp-rule" />
      <text x={L.grid - 8} y={laneB - 12} className="sp-lane is-live">{labels.dodaLane}</text>
      {dodaLane(animate, key)}
      <text x={900} y={laneB - 12} textAnchor="end" className="sp-speedup">{labels.speedup}</text>
    </g>
  );

  return (
    <svg className="flow-svg sp-svg" viewBox="0 0 920 350" role="img" aria-label={`${labels.cpuLane} vs ${labels.dodaLane}`}>
      <defs>
        <marker id="spArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#7f8b99" />
        </marker>
        <marker id="spArrowLive" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#30ddd4" />
        </marker>
      </defs>
      {frame(false, "static")}
      {frame(true, "anim")}
    </svg>
  );
}
