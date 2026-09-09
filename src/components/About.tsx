import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import type { AcronymPart, Dictionary, Milestone, TeamGroup, TeamLink, TeamMember, TeamStat } from "@/lib/i18n";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
      />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9.25" />
      <path d="M2.75 12h18.5M12 2.75c2.4 2.6 3.6 5.7 3.6 9.25s-1.2 6.65-3.6 9.25c-2.4-2.6-3.6-5.7-3.6-9.25S9.6 5.35 12 2.75z" />
    </svg>
  );
}

function ProfileLinks({ links, websiteLabel }: { links: readonly TeamLink[]; websiteLabel: string }) {
  if (links.length === 0) return null;
  return (
    <div className="profile-links">
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
          {link.type === "linkedin" ? <LinkedInIcon /> : <WebsiteIcon />}
          <span>{link.type === "linkedin" ? "LinkedIn" : websiteLabel}</span>
        </a>
      ))}
    </div>
  );
}

function ProfileDetails({ member }: { member: TeamMember }) {
  return (
    <dl>
      {member.details.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            {typeof value === "string" ? value : (
              <ul className="detail-list">
                {value.map((line) => <li key={line}>{line}</li>)}
              </ul>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Profile({ member, expand, collapse, websiteLabel, style }: {
  member: TeamMember;
  expand: string;
  collapse: string;
  websiteLabel: string;
  style?: CSSProperties;
}) {
  return (
    <details open style={style}>
      <summary>
        <div><span>{member.role}</span><strong>{member.name}</strong><small>{member.school}</small></div>
        <i>
          <span className="toggle-expand">{expand}</span>
          <span className="toggle-collapse">{collapse}</span>
        </i>
      </summary>
      <div className="profile-body">
        <ProfileDetails member={member} />
        <ProfileLinks links={member.links} websiteLabel={websiteLabel} />
      </div>
    </details>
  );
}

export default function AboutIntro({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  // Real spaces between the words rather than flex gaps, so the phrase still
  // reads correctly when copied or announced by a screen reader.
  const expansion = a.acronym.expansion as readonly AcronymPart[];

  return (
    <section className="section dark-section page-intro">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{a.kicker}</div>
            <h2>{a.title}</h2>
          </div>
          <p>{a.desc}</p>
        </div>

        <div className="acronym">
          <span>{a.acronym.kicker}</span>
          <p className="acronym-expansion">
            {expansion.map(([initial, rest], index) => (
              <Fragment key={initial + rest}>
                {index > 0 ? " " : null}
                <b>{initial}</b>
                <span>{rest}</span>
              </Fragment>
            ))}
          </p>
          <p className="acronym-note">{a.acronym.note}</p>
        </div>
      </div>
    </section>
  );
}

export function TeamSection({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  const lead = a.lead as TeamMember;
  const groups = a.groups as readonly TeamGroup[];
  const stats = a.stats as readonly TeamStat[];

  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{a.teamKicker}</div>
            <h2>{a.teamTitle}</h2>
          </div>
          <div className="team-stats">
            {stats.map(([value, label]) => (
              <div key={label}><b>{value}</b><span>{label}</span></div>
            ))}
          </div>
        </div>

        <article className="founder-lead">
          <div className="founder-portrait">
            {lead.portrait ? (
              <Image src={lead.portrait} alt={lead.name} width={900} height={1125} priority />
            ) : null}
          </div>
          <div className="founder-copy">
            <span>{lead.role}</span>
            <h3>{lead.name}</h3>
            <small>{lead.school}</small>
            <ProfileDetails member={lead} />
            <ProfileLinks links={lead.links} websiteLabel={a.websiteLabel} />
          </div>
        </article>

        {/*
          One grid rather than a container per location: cards only share a row
          height, and so line up across the two columns, if they are siblings.
          Placement is explicit; the mobile breakpoint drops it and the cards
          fall back to DOM order, which is already grouped by location.
        */}
        <div className="team-columns">
          {groups.map((group, groupIndex) => (
            <Fragment key={group.label}>
              <div className="team-column-head" style={{ gridColumn: groupIndex + 1, gridRow: 1 }}>
                <div><strong>{group.label}</strong><span>{group.entity}</span></div>
                <em>{group.note}</em>
              </div>
              {group.members.map((member, memberIndex) => (
                <Profile
                  key={member.name}
                  member={member}
                  expand={a.expand}
                  collapse={a.collapse}
                  websiteLabel={a.websiteLabel}
                  style={{ gridColumn: groupIndex + 1, gridRow: memberIndex + 2 }}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OriginSection({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  return (
    <section className="section dark-section head-only">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{a.story.kicker}</div>
            <h2>{a.story.title}</h2>
          </div>
          <div className="origin-body">
            {a.story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MilestonesSection({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  const milestones = a.milestones as readonly Milestone[];

  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{a.milestonesKicker}</div>
            <h2>{a.milestonesTitle}</h2>
          </div>
        </div>
        <div className="milestones">
          {milestones.map((milestone) => (
            <article key={milestone.title}>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
