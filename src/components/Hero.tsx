import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";

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

        <SystemFlow dict={dict} />
      </div>
    </section>
  );
}

function SystemFlow({ dict }: { dict: Dictionary }) {
  return (
    <div className="system-flow">
      <div className="system-flow-top">
        <span>{dict.hero.stageTitle}</span>
        <small>{dict.hero.stageNote}</small>
      </div>
      <svg className="system-flow-svg" viewBox="0 0 1000 360" role="img" aria-label="Sensor to DODA to host compute system flow">
        <defs>
          <linearGradient id="flowGradient" gradientUnits="userSpaceOnUse" x1="0" y1="180" x2="1000" y2="180">
            <stop stopColor="#30ddd4" />
            <stop offset=".55" stopColor="#4c78ff" />
            <stop offset="1" stopColor="#8c4cff" />
          </linearGradient>
        </defs>
        <rect x="35" y="103" width="180" height="154" rx="22" className="flow-box" />
        <text x="125" y="152" textAnchor="middle" className="flow-title">SENSOR ARRAY</text>
        <text x="125" y="181" textAnchor="middle" className="flow-sub">{dict.hero.sensorSub1}</text>
        <text x="125" y="205" textAnchor="middle" className="flow-sub">{dict.hero.sensorSub2}</text>

        <path d="M215 180 C290 180 310 180 365 180" className="flow-line" />

        <rect x="365" y="68" width="270" height="224" rx="34" className="doda-box" />
        <text x="500" y="124" textAnchor="middle" className="flow-accent">RiDM</text>
        <text x="500" y="182" textAnchor="middle" className="doda-label">DODA</text>
        <text x="500" y="218" textAnchor="middle" className="flow-accent">FILTER · FUSE · PROCESS · INFER</text>
        <text x="500" y="246" textAnchor="middle" className="flow-sub">Runtime-programmable dataflow</text>

        <path d="M635 180 C710 180 735 180 790 180" className="flow-line" />

        <rect x="790" y="103" width="175" height="154" rx="22" className="flow-box" />
        <text x="877" y="152" textAnchor="middle" className="flow-title">HOST COMPUTE</text>
        <text x="877" y="181" textAnchor="middle" className="flow-sub">CPU / GPU</text>
        <text x="877" y="205" textAnchor="middle" className="flow-sub">{dict.hero.hostSub}</text>
      </svg>

      <div className="system-flow-mobile">
        {[
          ["01", "Sensor Array", `${dict.hero.sensorSub1} · ${dict.hero.sensorSub2}`],
          ["02", "DODA", "Filter · Fuse · Process · Infer"],
          ["03", "Host Compute", `CPU / GPU · ${dict.hero.hostSub}`],
        ].map(([n, title, sub], index) => (
          <div key={title}>
            {index > 0 && <div className="mobile-arrow">↓</div>}
            <div className={`mobile-flow-card ${title === "DODA" ? "is-doda" : ""}`}>
              <span>{n}</span>
              <div>
                <strong>{title}</strong>
                <small>{sub}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
