import type { Dictionary } from "@/lib/i18n";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  );
}

// The Contact page is the destination: it passes `deckHref` and shows the
// address itself. Every other page passes `contactHref` instead and the panel
// leads there rather than straight into a mail client.
export default function ContactSection({ dict, deckHref, contactHref }: { dict: Dictionary; deckHref?: string; contactHref?: string }) {
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
          <div className="contact-actions">
            {contactHref ? (
              <a className="button dark" href={contactHref}>{c.linkCta}</a>
            ) : (
              <>
                {/* The address is the label, so it can be read without clicking. */}
                <a className="button dark contact-email" href={`mailto:${c.email}`}>
                  <MailIcon />
                  {c.cta}
                </a>
                {deckHref ? <a className="button outline-dark" href={deckHref}>{dict.deck.open}</a> : null}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
