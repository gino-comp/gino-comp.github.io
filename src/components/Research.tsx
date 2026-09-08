import type { Dictionary } from "@/lib/i18n";

export default function ResearchSection({ dict }: { dict: Dictionary }) {
  const r = dict.researchCopy;
  return (
    <section className="section light-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">{r.kicker}</div>
            <h2>{r.title}</h2>
          </div>
          <p>{r.desc}</p>
        </div>

        <div className="research-card">
          {dict.papers.map((paper) => (
            <article className="paper-row" key={paper.title}>
              <span>{paper.year}</span>
              <div>
                {"href" in paper && paper.href ? (
                  <a href={paper.href} target="_blank" rel="noopener noreferrer"><h3>{paper.title}</h3></a>
                ) : (
                  <h3>{paper.title}</h3>
                )}
                <p>{paper.authors}</p>
              </div>
              <b>{paper.tag}</b>
            </article>
          ))}
        </div>

        <div className="ip-grid">
          <article className="ip-intro">
            <span>{r.ipKicker}</span>
            <h3>{r.ipTitle}</h3>
            <p>{r.ipBody}</p>
            <div className="ip-chain"><b>NUS Research</b><i>→</i><b>Patent Portfolio</b><i>→</i><b>Exclusive License</b><i>→</i><b>DODA</b></div>
          </article>
          <div className="patent-list">
            {dict.patents.map((patent) => (
              <article key={patent.code}>
                <code>{patent.code}</code>
                <h3>{patent.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
