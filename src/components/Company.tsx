import type { Dictionary } from "@/lib/i18n";

export default function CompanySection({ dict }: { dict: Dictionary }) {
  const c = dict.company;
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

        <div className="team-overview">
          <div><span>FOUNDING TEAM</span><h3>{c.overview}</h3></div>
          <p>{c.overviewNote}</p>
        </div>

        <div className="team-grid">
          {c.team.map((member, index) => (
            <details key={member.name} open={index === 0}>
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
