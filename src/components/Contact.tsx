import type { Dictionary } from "@/lib/i18n";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  );
}

export default function ContactSection({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  return (
    <section className="section contact-section">
      <div className="container">
        <div className="contact-panel">
          <div>
            <span>{c.kicker}</span>
            <h2>{c.title}</h2>
            <p>{c.body}</p>
          </div>
          {/* The address is the label, so it can be read without clicking. */}
          <a className="button dark contact-email" href={`mailto:${c.email}`}>
            <MailIcon />
            {c.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
