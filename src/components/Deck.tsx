import { Fragment, type ReactNode } from "react";
import { ConventionalFlow, RidmFlow, type Conventional, type Ridm } from "@/components/DataFlow";
import DeckToolbar from "@/components/DeckToolbar";
import { DataMovementStats, DataMovementSvg, type Why } from "@/components/DataMovement";
import { formatDate, newestFirst } from "@/components/News";
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

function Slide({ kicker, className, children }: { kicker?: string; className?: string; children: ReactNode }) {
  return (
    <section className={`slide${className ? ` ${className}` : ""}`}>
      {kicker ? <div className="slide-kicker">{kicker}</div> : null}
      {children}
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
  const news = [...(dict.news as readonly NewsEntry[])].sort(newestFirst).slice(0, 4);
  const newsCopy = (key: string) => dict.newsCopy.items[key as keyof typeof dict.newsCopy.items] as NewsCopy;
  const leadResearch = lead.details[0]?.[1];

  const slides: ReactNode[] = [
    <Slide key="title" className="slide-title">
      <div className="slide-kicker">{dict.hero.label}</div>
      <h1>{dict.hero.lead} <span>{dict.hero.accent}</span></h1>
      <p className="slide-lead">{dict.hero.body}</p>
      <div className="slide-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ridm-logo.png" alt="" />
        <div><strong>RiDM Technology</strong><small>{dict.brandSub}</small></div>
      </div>
    </Slide>,

    <Slide key="why" kicker={why.homeKicker}>
      <h2>{why.title}</h2>
      <p className="slide-lead slide-lead-tight">{why.desc}</p>
      <div className="slide-figure"><DataMovementSvg why={why} /></div>
      <DataMovementStats why={why} />
    </Slide>,

    <Slide key="problem" kicker={t.kicker}>
      <h2>{t.title}</h2>
      <p className="slide-sub">{conventional.title}</p>
      <div className="slide-figure"><ConventionalFlow side={conventional} sensorsLabel={t.sensorsLabel} /></div>
      <ul className="slide-costs">{conventional.costs.map((cost) => <li key={cost}>{cost}</li>)}</ul>
    </Slide>,

    <Slide key="approach" kicker={ridm.overline} className="is-ridm">
      <h2>{ridm.title}</h2>
      <p className="slide-lead slide-lead-tight">{dict.hero.stageLead}</p>
      <div className="slide-figure"><RidmFlow side={ridm} sensorsLabel={t.sensorsLabel} /></div>
      <ul className="slide-costs">{ridm.costs.map((cost) => <li key={cost}>{cost}</li>)}</ul>
    </Slide>,

    <Slide key="builtfor" kicker={dict.hero.builtFor}>
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
    </Slide>,

    <Slide key="doda" kicker={dict.doda.kicker}>
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
    </Slide>,

    <Slide key="lineage" kicker={dict.doda.lineageKicker}>
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
    </Slide>,

    <Slide key="simulator" kicker={dict.doda.simulator.kicker}>
      <h2>{dict.doda.simulator.title}</h2>
      <p className="slide-lead">{dict.doda.simulator.body}</p>
      <p className="slide-sub slide-mono">{dict.doda.simulator.href}</p>
    </Slide>,

    <Slide key="team" kicker={dict.about.teamKicker}>
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
    </Slide>,

    <Slide key="milestones" kicker={dict.about.milestonesKicker}>
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
    </Slide>,

    <Slide key="news" kicker={dict.newsCopy.kicker}>
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
    </Slide>,

    <Slide key="contact" kicker={dict.contact.kicker} className="slide-contact">
      <h2>{dict.contact.title}</h2>
      <p className="slide-lead">{dict.contact.body}</p>
      <div className="slide-email">{dict.contact.email}</div>
      <div className="slide-url">{siteUrl}</div>
    </Slide>
  ];

  return (
    <div className="deck-page">
      <DeckToolbar
        exportLabel={dict.deck.export}
        backLabel={dict.deck.back}
        backHref={`/${locale}/`}
        hint={dict.deck.hint}
      />
      <div className="deck-stack">
        {slides.map((slide, index) => (
          <Fragment key={index}>
            {slide}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
