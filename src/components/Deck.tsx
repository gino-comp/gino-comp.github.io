import { Fragment, type ReactNode } from "react";
import { ConventionalFlow, RidmFlow, type Conventional, type Ridm } from "@/components/DataFlow";
import DeckShell from "@/components/DeckShell";
import { DataMovementStats, DataMovementSvg, type Why } from "@/components/DataMovement";
import { formatDate, newestFirst } from "@/components/News";
import StreamingPipeline from "@/components/StreamingPipeline";
import { labNotes } from "@/lib/lab-notes";
import type { LabFigure } from "@/lib/lab-notes";
import {
  siteUrl,
  type AcronymPart,
  type Dictionary,
  type Locale,
  type Milestone,
  type NewsCopy,
  type NewsEntry,
  type TeamGroup,
  type TeamMember
} from "@/lib/i18n";

/* The site's content as slides. Nothing here is written for the deck: every
   heading, paragraph, diagram and list is read from the same dictionary the
   pages use, so the deck cannot drift from the site. Each slide is one 16:9
   page in print; the stylesheet does the rest. */

type Lineage = { step: string; title: string; body: string; href: string | null; linkLabel: string | null };

// `.slide-body` is what auto-fit measures and scales; the section is the
// fixed 16:9 page around it.
function Slide({ id, kicker, className, fitMax, children }: { id: string; kicker?: string; className?: string; fitMax?: number; children: ReactNode }) {
  return (
    <section className={`slide${className ? ` ${className}` : ""}`} data-slide={id} data-fit-max={fitMax}>
      <div className="slide-body">
        {kicker ? <div className="slide-kicker">{kicker}</div> : null}
        {children}
      </div>
    </section>
  );
}

export default function Deck({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.technology;
  const why = dict.why as Why;
  const conventional = t.conventional as Conventional;
  const ridm = t.ridm as Ridm;
  const expansion = dict.doda.acronym.expansion as readonly AcronymPart[];
  const lineage = dict.doda.lineage as readonly Lineage[];
  const lead = dict.about.lead as TeamMember;
  const groups = dict.about.groups as readonly TeamGroup[];
  const milestones = dict.about.milestones as readonly Milestone[];
  const news = [...(dict.news as readonly NewsEntry[])].sort(newestFirst).slice(0, 7);
  const newsCopy = (key: string) => dict.newsCopy.items[key as keyof typeof dict.newsCopy.items] as NewsCopy;
  const leadResearch = lead.details[0]?.[1];

  const slides: { id: string; node: ReactNode; group?: string; label?: string }[] = [
    { id: "title", node: <Slide key="title" id="title" className="slide-title">
      <div className="slide-kicker">{dict.hero.label}</div>
      <h1>{dict.hero.lead} <span>{dict.hero.accent}</span></h1>
      <p className="slide-lead">{dict.hero.body}</p>
      <div className="slide-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ridm-logo.png" alt="" />
        <div><strong>RiDM Technology</strong><small>{dict.brandSub}</small></div>
      </div>
    </Slide> },

    { id: "why", node: <Slide key="why" id="why" kicker={why.homeKicker}>
      <h2>{why.title}</h2>
      <p className="slide-lead slide-lead-tight">{why.desc}</p>
      <div className="slide-figure"><DataMovementSvg why={why} /></div>
      <DataMovementStats why={why} />
    </Slide> },

    { id: "problem", node: <Slide key="problem" id="problem" kicker={t.kicker}>
      <h2>{t.title}</h2>
      <p className="slide-sub">{conventional.title}</p>
      <div className="slide-figure"><ConventionalFlow side={conventional} sensorsLabel={t.sensorsLabel} /></div>
      <ul className="slide-costs">{conventional.costs.map((cost) => <li key={cost}>{cost}</li>)}</ul>
    </Slide> },

    { id: "approach", node: <Slide key="approach" id="approach" kicker={ridm.overline} className="is-ridm">
      <h2>{ridm.title}</h2>
      <p className="slide-lead slide-lead-tight">{dict.hero.stageLead}</p>
      <div className="slide-figure"><RidmFlow side={ridm} sensorsLabel={t.sensorsLabel} /></div>
      <ul className="slide-costs">{ridm.costs.map((cost) => <li key={cost}>{cost}</li>)}</ul>
    </Slide> },

    { id: "builtfor", node: <Slide key="builtfor" id="builtfor" kicker={dict.hero.builtFor}>
      <h2>{dict.applicationsCopy.title}</h2>
      <div className="slide-grid cols-5">
        {dict.applications.map((area) => (
          <div className="slide-card" key={area.key}>
            <h3>{area.title}</h3>
            <p>{dict.applicationsCopy.bodies[area.key as keyof typeof dict.applicationsCopy.bodies]}</p>
            <div className="tags">{area.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        ))}
      </div>
    </Slide> },

    { id: "doda", node: <Slide key="doda" id="doda" kicker={dict.doda.kicker}>
      <h2>{dict.doda.title}</h2>
      <p className="slide-lead">{dict.doda.desc}</p>
      <div className="acronym">
        <span>{dict.doda.acronym.kicker}</span>
        <p className="acronym-expansion">
          {expansion.map(([initial, rest], index) => (
            <Fragment key={initial + rest}>{index > 0 ? " " : null}<b>{initial}</b><span>{rest}</span></Fragment>
          ))}
        </p>
        <p className="acronym-note">{dict.doda.acronym.note}</p>
      </div>
    </Slide> },

    { id: "lineage", node: <Slide key="lineage" id="lineage" kicker={dict.doda.lineageKicker}>
      <h2>{dict.doda.lineageTitle}</h2>
      <div className="slide-grid cols-2">
        {lineage.map((item) => (
          <div className="slide-card" key={item.step}>
            <b>{item.step}</b>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            {item.href ? (
              <div className="link">{item.linkLabel} · {item.href}</div>
            ) : (
              <ul className="patent-codes">
                {dict.patents.map((patent) => <li key={patent.code}><b>{patent.code}</b><span>{patent.title}</span></li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Slide> },

    { id: "simulator", node: <Slide key="simulator" id="simulator" kicker={dict.doda.simulator.kicker}>
      <h2>{dict.doda.simulator.title}</h2>
      <p className="slide-lead">{dict.doda.simulator.body}</p>
      <p className="slide-sub slide-mono">{dict.doda.simulator.href}</p>
    </Slide> },

    // One overview slide plus one slide per deck-flagged section, read from
    // the same registry as /lab-notes. They share one toolbar chip with a
    // menu to pick which slides are in.
    ...labNotes.flatMap((note) => {
      const copy = note.copy[locale];
      const id = `lab-${note.slug}`;
      const kicker = `${dict.labNotes.kicker} · ${copy.title}`;

      function DeckFigure({ figure }: { figure: LabFigure }) {
        const m = figure.media;
        if (m.kind === "pipeline") return <div className="slide-figure"><StreamingPipeline labels={dict.labNotes.pipeline} /></div>;
        if (m.kind === "compare") return (
          <div className="slide-lab-compare">
            <div><span>{m.left}</span><span>{m.right}</span></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={m.alt} />
          </div>
        );
        // eslint-disable-next-line @next/next/no-img-element
        return <img className="slide-lab-img" src={m.src} alt={m.alt} />;
      }

      const overview = { id, group: "lab", label: copy.title, node: (
        <Slide key={id} id={id} kicker={`${kicker} · ${copy.status} · ${dict.labNotes.updated} ${formatDate(note.updated, locale)}`} className="slide-lab" fitMax={1.2}>
          <div className="slide-lab-grid">
            <div className="slide-lab-copy">
              <h2>{copy.title}</h2>
              <p className="slide-sub">{copy.tagline}</p>
              <p className="slide-lead">{copy.summary}</p>
              <div className="slide-lab-stats">
                {copy.stats.map((stat) => (
                  <div key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></div>
                ))}
              </div>
            </div>
            <div className="slide-lab-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={note.cover.src} alt="" />
            </div>
          </div>
          <p className="slide-lab-url slide-mono">{siteUrl}/{locale}/lab-notes/{note.slug}/</p>
        </Slide>
      ) };

      const sectionSlides = copy.sections
        .filter((s) => s.deck)
        .map((section) => {
          const sid = `${id}-${section.id}`;
          const hasFigures = !!section.figures?.length;
          return { id: sid, group: "lab", label: `${copy.title} · ${section.title}`, node: (
            <Slide key={sid} id={sid} kicker={kicker} className="slide-lab slide-lab-section">
              <h2>{section.title}</h2>
              {hasFigures ? (
                <div className="slide-lab-media">
                  {section.figures!.map((fig, j) => <DeckFigure key={j} figure={fig} />)}
                </div>
              ) : null}
              {section.body?.map((p) => <p key={p.slice(0, 40)} className="slide-lead-tight">{p}</p>)}
              {section.bullets ? (
                <ul className="slide-costs">{section.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              ) : null}
            </Slide>
          ) };
        });

      return [overview, ...sectionSlides];
    }),

    { id: "team", node: <Slide key="team" id="team" kicker={dict.about.teamKicker} fitMax={1.45}>
      <h2>{dict.about.teamTitle}</h2>
      <div className="slide-team">
        <div className="slide-founder">
          {lead.portrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lead.portrait} alt={lead.name} />
          ) : null}
          <div>
            <span>{lead.role}</span>
            <strong>{lead.name}</strong>
            <small>{lead.school}</small>
            {typeof leadResearch === "string" ? <p>{leadResearch}</p> : null}
          </div>
        </div>
        <div className="slide-groups">
          {groups.map((group) => (
            <div className="slide-group" key={group.label}>
              <h4>{group.label}<span>{group.entity}</span></h4>
              <em>{group.note}</em>
              <ul>
                {group.members.map((member) => (
                  <li key={member.name}>{member.name}<small>{member.role} · {member.school}</small></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Slide> },

    { id: "milestones", node: <Slide key="milestones" id="milestones" kicker={dict.about.milestonesKicker}>
      <h2>{dict.about.milestonesTitle}</h2>
      <div className="slide-grid cols-3">
        {milestones.map((milestone) => (
          <div className="slide-card" key={milestone.title}>
            <b>{milestone.year}</b>
            <h3>{milestone.title}</h3>
            <p>{milestone.body}</p>
            {milestone.logos && milestone.logos.length > 0 ? (
              <div className="milestone-logos">
                {milestone.logos.map((logo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={logo.src} src={logo.src} alt={logo.alt} style={{ height: logo.height }} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Slide> },

    { id: "news", node: <Slide key="news" id="news" kicker={dict.newsCopy.kicker}>
      <h2>{dict.newsCopy.title}</h2>
      <ul className="slide-news">
        {news.map((entry) => (
          <li key={entry.key}>
            <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
            <b>{entry.category}</b>
            <strong>{newsCopy(entry.key).title}</strong>
          </li>
        ))}
      </ul>
    </Slide> },

    { id: "contact", node: <Slide key="contact" id="contact" kicker={dict.contact.kicker} className="slide-contact">
      <h2>{dict.contact.title}</h2>
      <p className="slide-lead">{dict.contact.body}</p>
      <div className="slide-email">{dict.contact.email}</div>
      <div className="slide-url">{siteUrl}</div>
    </Slide> }
  ];

  const labels = dict.deck.slides as Record<string, string>;
  return (
    <DeckShell
      slides={slides.map((s) => ({ ...s, label: s.label ?? labels[s.id] ?? s.id }))}
      groups={[{ id: "lab", label: labels.lab }]}
      text={{
        export: dict.deck.export,
        fullscreen: dict.deck.fullscreen,
        back: dict.deck.back,
        backHref: `/${locale}/`,
        hint: dict.deck.hint,
        include: dict.deck.include,
        all: dict.deck.all,
        none: dict.deck.none,
        autofit: dict.deck.autofit,
        reorderHint: dict.deck.reorderHint,
        reset: dict.deck.reset
      }}
    />
  );
}
