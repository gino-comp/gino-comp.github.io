"use client";

import { useEffect } from "react";

// The only client code the deck needs: a print call (the PDF export is the
// browser's print-to-PDF against the deck's print stylesheet) and arrow-key
// navigation between slides.
export default function DeckToolbar({ exportLabel, backLabel, backHref, hint }: {
  exportLabel: string;
  backLabel: string;
  backHref: string;
  hint: string;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const forward = ["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key);
      const back = ["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key);
      if (!forward && !back) return;
      const slides = Array.from(document.querySelectorAll<HTMLElement>(".slide"));
      if (slides.length === 0) return;
      const tops = slides.map((slide) => slide.getBoundingClientRect().top + window.scrollY);
      const here = window.scrollY + 160;
      let current = tops.findIndex((top) => top > here) - 1;
      if (current < 0) current = tops.findIndex((top) => top > here) === -1 ? slides.length - 1 : 0;
      const next = Math.min(slides.length - 1, Math.max(0, current + (forward ? 1 : -1)));
      event.preventDefault();
      slides[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="deck-toolbar">
      <button type="button" className="button primary" onClick={() => window.print()}>{exportLabel}</button>
      <a className="button secondary" href={backHref}>{backLabel}</a>
      <small>{hint}</small>
    </div>
  );
}
