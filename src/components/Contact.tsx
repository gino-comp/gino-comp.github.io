import type { Dictionary } from "@/lib/i18n";

export default function ContactSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="section contact-section">
      <div className="container">
        <div className="contact-panel">
          <div>
            <span>{dict.contact.kicker}</span>
            <h2>{dict.contact.title}</h2>
            <p>{dict.contact.body}</p>
          </div>
          <a className="button dark" href="https://www.ridm.tech/contact-us" target="_blank" rel="noopener noreferrer">
            {dict.contact.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
