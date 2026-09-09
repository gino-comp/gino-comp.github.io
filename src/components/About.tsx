import Image from "next/image";
import type { Dictionary, Milestone, TeamMember } from "@/lib/i18n";

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
            <dl>
              {founder.details.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </div>
        </article>

        <div className="team-grid">
          {others.map((member) => (
            <details key={member.name}>
              <summary>
                <div><span>{member.role}</span><strong>{member.name}</strong><small>{member.school}</small></div>
                <i>+</i>
              </summary>
              <div className="profile-body">
                <dl>
                  {member.details.map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
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
