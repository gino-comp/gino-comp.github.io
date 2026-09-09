import Image from "next/image";
import type { Dictionary, Milestone, TeamLink, TeamMember } from "@/lib/i18n";

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
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  );
}

export default function AboutSection({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  const team = a.team as readonly TeamMember[];
  const [founder, ...others] = team;

  return (
    <section className="section dark-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{a.kicker}</div>
            <h2>{a.title}</h2>
          </div>
          <p>{a.desc}</p>
        </div>

        <div className="team-overview">
          <div><span>{a.teamKicker}</span><h3>{a.overview}</h3></div>
          <p>{a.overviewNote}</p>
        </div>

        <article className="founder-lead">
          <div className="founder-portrait">
            {founder.portrait ? (
              <Image src={founder.portrait} alt={founder.name} width={900} height={1125} priority />
            ) : null}
          </div>
          <div className="founder-copy">
            <span>{founder.role}</span>
            <h3>{founder.name}</h3>
            <small>{founder.school}</small>
            <ProfileDetails member={founder} />
            <ProfileLinks links={founder.links} websiteLabel={a.websiteLabel} />
          </div>
        </article>

        <div className="team-grid">
          {others.map((member) => (
            <details key={member.name} open>
              <summary>
                <div><span>{member.role}</span><strong>{member.name}</strong><small>{member.school}</small></div>
                <i>
                  <span className="toggle-expand">{a.expand}</span>
                  <span className="toggle-collapse">{a.collapse}</span>
                </i>
              </summary>
              <div className="profile-body">
                <ProfileDetails member={member} />
                <ProfileLinks links={member.links} websiteLabel={a.websiteLabel} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorySection({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  const milestones = a.milestones as readonly Milestone[];

  return (
    <section className="section dark-section">
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

        <div className="milestones-head">
          <span>{a.milestonesKicker}</span>
          <h3>{a.milestonesTitle}</h3>
        </div>
        <div className="milestones">
          {milestones.map((milestone) => (
            <article key={milestone.title}>
              <b>{milestone.year}</b>
              <h3>{milestone.title}</h3>
              <p>{milestone.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
