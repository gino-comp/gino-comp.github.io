import type { Dictionary } from "@/lib/i18n";

/* The "why" figure: sensors on the left, processors on the right, and raw data
   hauled between them, lane after lane, all the time. The point is volume, so
   the traffic is continuous rather than slotted, and a faint fifth column of
   sensors pulses in to say the count is still growing.

   Motion is SMIL, as in the data-path diagrams. Print and reduced-motion get a
   static snapshot with the trucks placed along the lanes by hand, since an
   unanimated <use> would otherwise sit at the origin. */

export type Why = {
  kicker: string;
  homeKicker: string;
  title: string;
  desc: string;
  sensors: string;
  processors: string;
  processorsNote: string;
  caption: string;
  stats: readonly (readonly [string, string])[];
  trend: string;
};

const SENSOR_COLS = [40, 80, 120, 160];
const FUTURE_COL = 200;
const ROWS = [56, 104, 152, 200];
const LANES = ROWS.map((y) => y + 14);
const LANE_START = 250;
const LANE_END = 690;
const CHIP_COLS = [740, 786, 832, 878];
const TRUCKS_PER_LANE = 5;
const LANE_SECONDS = 4.2;

export function DataMovementSvg({ why }: { why: Why }) {
  return (
    <svg className="flow-svg dm-svg" viewBox="0 0 980 300" role="img" aria-label={why.title}>
      <defs>
        <symbol id="dmSensor" viewBox="0 0 26 28">
          <rect x="1" y="1" width="24" height="26" rx="5" />
          <circle cx="13" cy="12" r="5.5" />
          <circle cx="13" cy="12" r="2" fill="#6fdad4" stroke="none" />
          <rect x="8" y="21" width="10" height="2" rx="1" fill="#6f7f92" stroke="none" />
        </symbol>
        <symbol id="dmChip" viewBox="0 0 32 32">
          <rect x="5" y="5" width="22" height="22" rx="4" />
          <rect x="11" y="11" width="10" height="10" rx="2" />
          <path d="M11 5V1M16 5V1M21 5V1M11 31V27M16 31V27M21 31V27M5 11H1M5 16H1M5 21H1M31 11H27M31 16H27M31 21H27" />
        </symbol>
        <symbol id="dmTruck" viewBox="0 0 26 18">
          <rect x="0" y="3" width="16" height="10" rx="1.5" />
          <path d="M16 6h5l4 4v3h-9z" />
          <circle cx="5" cy="14.5" r="2.4" fill="#0a0f16" stroke="#c98a45" strokeWidth="1.3" />
          <circle cx="20" cy="14.5" r="2.4" fill="#0a0f16" stroke="#c98a45" strokeWidth="1.3" />
        </symbol>
        {/* trucks fade in at the sensors and out at the processors */}
        <linearGradient id="dmFade" gradientUnits="userSpaceOnUse" x1={LANE_START - 10} x2={LANE_END + 10}>
          <stop offset="0" stopColor="#000" />
          <stop offset=".1" stopColor="#fff" />
          <stop offset=".9" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="dmLaneMask">
          <rect x={LANE_START - 10} y="30" width={LANE_END - LANE_START + 20} height="230" fill="url(#dmFade)" />
        </mask>
      </defs>

      <text x="40" y="36" className="fl-tag">{why.sensors}</text>
      {ROWS.map((y) =>
        SENSOR_COLS.map((x) => <use key={`${x}-${y}`} href="#dmSensor" x={x} y={y} width="26" height="28" className="dm-sensor" />)
      )}
      {/* the column that is not there yet */}
      <g className="dm-future">
        {ROWS.map((y) => <use key={y} href="#dmSensor" x={FUTURE_COL} y={y} width="26" height="28" className="dm-sensor" />)}
        <animate attributeName="opacity" values=".12;.55;.12" dur="3.6s" repeatCount="indefinite" />
      </g>

      {LANES.map((y) => <line key={y} x1={LANE_START} x2={LANE_END} y1={y} y2={y} className="dm-lane" />)}

      <g className="dm-trucks" mask="url(#dmLaneMask)">
        {LANES.map((y, lane) =>
          Array.from({ length: TRUCKS_PER_LANE }, (_, k) => (
            <use key={`${lane}-${k}`} href="#dmTruck" width="26" height="18" className="dm-truck">
              <animateMotion
                dur={`${LANE_SECONDS}s`}
                repeatCount="indefinite"
                begin={`${-(k * (LANE_SECONDS / TRUCKS_PER_LANE) + lane * 0.23)}s`}
                path={`M${LANE_START},${y - 9} L${LANE_END},${y - 9}`}
              />
            </use>
          ))
        )}
      </g>
      <g className="dm-trucks-static">
        {LANES.map((y, lane) =>
          [280, 380, 480, 580].map((x) => (
            <use key={`${lane}-${x}`} href="#dmTruck" x={x + lane * 18} y={y - 9} width="26" height="18" className="dm-truck" />
          ))
        )}
      </g>
      <text x={(LANE_START + LANE_END) / 2} y="262" textAnchor="middle" className="dm-caption">{why.caption}</text>

      <text x="740" y="36" className="fl-tag">{why.processors}</text>
      {ROWS.map((y) =>
        CHIP_COLS.map((x) => <use key={`${x}-${y}`} href="#dmChip" x={x} y={y - 2} width="32" height="32" className="dm-chip" />)
      )}
      <text x="740" y="262" className="fl-note">{why.processorsNote}</text>
    </svg>
  );
}

export function DataMovementStats({ why }: { why: Why }) {
  return (
    <div className="dm-stats">
      {why.stats.map(([value, label]) => (
        <div key={label}><b>{value}</b><span>{label}</span></div>
      ))}
      <p className="dm-trend">{why.trend}</p>
    </div>
  );
}

/* Technology page: a full section, first on the page. */
export function WhySection({ dict }: { dict: Dictionary }) {
  const why = dict.why as Why;
  return (
    <section id="why" className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{why.kicker}</div>
            <h2>{why.title}</h2>
          </div>
          <p>{why.desc}</p>
        </div>
        <div className="dm-panel">
          <div className="flow-scroll"><DataMovementSvg why={why} /></div>
        </div>
        <DataMovementStats why={why} />
      </div>
    </section>
  );
}

/* Homepage: a panel in the hero, ahead of the system-flow panel, so the
   problem is stated before the approach. */
export function WhyPanel({ dict }: { dict: Dictionary }) {
  const why = dict.why as Why;
  return (
    <div className="system-flow why-panel">
      <div className="system-flow-top">
        <span>{why.homeKicker}</span>
        <small>{dict.technology.diagramNote}</small>
      </div>
      <p className="why-claim">{why.title}</p>
      <p className="system-flow-lead">{why.desc}</p>
      <div className="flow-scroll"><DataMovementSvg why={why} /></div>
      <DataMovementStats why={why} />
    </div>
  );
}
