import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";

const icons: Record<string, ReactNode> = {
  networking: (
    <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="16" cy="20" r="5"/><circle cx="40" cy="40" r="6"/><circle cx="64" cy="20" r="5"/><circle cx="18" cy="61" r="5"/><circle cx="62" cy="60" r="5"/><path d="M20 22 35 36M45 36 60 22M22 57 35 44M45 44 58 57M22 20h36"/></svg>
  ),
  sensing: (
    <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="30" r="6"/><path d="M28 49c4-8 8-11 12-11s8 3 12 11M18 59c7-16 17-24 22-24s15 8 22 24M14 63h52"/></svg>
  ),
  robotics: (
    <svg viewBox="0 0 80 80" aria-hidden="true"><rect x="17" y="22" width="19" height="18" rx="4"/><path d="M27 40c0 8 6 12 12 12h8c7 0 12-5 12-12v-7M47 33 58 22"/><circle cx="61" cy="19" r="5"/><path d="M32 52v10M49 52v10M26 62h11M43 62h11"/></svg>
  ),
  physicalAI: (
    <svg viewBox="0 0 80 80" aria-hidden="true"><rect x="29" y="29" width="22" height="22" rx="6"/><circle cx="40" cy="40" r="3"/><path d="M40 11v12M40 57v12M11 40h12M57 40h12"/><path d="M21 21l8 8M59 21l-8 8M21 59l8-8M59 59l-8-8"/></svg>
  ),
  edge: (
    <svg viewBox="0 0 80 80" aria-hidden="true"><rect x="24" y="24" width="32" height="32" rx="6"/><path d="M31 16v8M40 16v8M49 16v8M31 56v8M40 56v8M49 56v8M16 31h8M16 40h8M16 49h8M56 31h8M56 40h8M56 49h8"/><circle cx="33" cy="34" r="3"/><circle cx="46" cy="34" r="3"/><circle cx="40" cy="46" r="3"/><path d="M33 34h13M39 37l1 6"/></svg>
  )
};

export default function ApplicationsSection({ dict }: { dict: Dictionary }) {
  const c = dict.applicationsCopy;
  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{c.kicker}</div>
            <h2>{c.title}</h2>
          </div>
          <p>{c.desc}</p>
        </div>

        <div className="applications-grid">
          {dict.applications.map((item) => (
            <article key={item.key}>
              <div className="application-icon">{icons[item.key]}</div>
              <h3>{item.title}</h3>
              <p>{c.bodies[item.key as keyof typeof c.bodies]}</p>
              <div className="tags">
                {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
