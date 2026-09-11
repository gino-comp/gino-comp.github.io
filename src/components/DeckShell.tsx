"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/* Everything interactive about the deck lives here; the slides themselves are
   rendered on the server and passed in.

   Selection — which slides are in the deck — is kept in the URL (?only=a,b,c),
   so a subset is a link you can bookmark or send, and in localStorage so it
   sticks between visits. With nothing stored, every slide is in.

   Auto-fit — a slide measures its own content and scales it to fill most of
   the page: up when the content is sparse (capped, so a two-line slide does
   not become a poster), down when it would overflow. Slide typography is in
   container-query units and the fitted box is expressed in them too, so a
   scale factor computed on screen is exact on the printed 13.333in page. */

export type DeckSlide = { id: string; label: string; node: ReactNode };
export type DeckText = {
  export: string; back: string; backHref: string; hint: string;
  include: string; all: string; none: string; autofit: string;
};

const ONLY_KEY = "ridm-deck:only";
const FIT_KEY = "ridm-deck:autofit";

// Grow sparse slides toward `target`; leave anything already fuller than
// `growBelow` alone; never scale beyond the caps.
const FIT = { target: 0.88, growBelow: 0.8, max: 1.5, min: 0.6, accept: 0.94 };

function allOn(ids: string[]): Record<string, boolean> {
  return Object.fromEntries(ids.map((id) => [id, true]));
}

function fromList(ids: string[], list: string | null): Record<string, boolean> | null {
  if (!list) return null;
  const set = new Set(list.split(",").map((s) => s.trim()).filter(Boolean));
  if (set.size === 0) return null;
  return Object.fromEntries(ids.map((id) => [id, set.has(id)]));
}

function measure(body: HTMLElement): number {
  const h = body.style.height;
  body.style.height = "auto";
  const n = body.scrollHeight;
  body.style.height = h;
  return n;
}

function fitSlide(slide: HTMLElement, on: boolean) {
  const body = slide.querySelector<HTMLElement>(".slide-body");
  if (!body) return;
  const cs = getComputedStyle(slide);
  const innerW = slide.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const innerH = slide.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  if (innerW <= 0 || innerH <= 0) return;
  // cqw resolves against the container's content box, so at scale 1 the body
  // is exactly 100cqw wide; height follows the content box's aspect
  const wCq = 100;
  const hCq = (innerH / innerW) * 100;
  // a slide may cap how far it is allowed to grow, when its layout rewraps badly
  const maxScale = Math.min(FIT.max, parseFloat(slide.dataset.fitMax ?? "") || FIT.max);

  body.style.transform = "";
  body.style.width = "";
  body.style.height = "";
  const natural = measure(body) / innerH;
  slide.dataset.natural = natural.toFixed(2);

  let s = 1;
  if (on && (natural > 1 || natural < FIT.growBelow)) s = FIT.target / natural;
  s = Math.max(FIT.min, Math.min(maxScale, s));

  // a different width rewraps the text, so converge rather than trust one pass
  for (let i = 0; i < 4 && s !== 1; i++) {
    body.style.width = `${wCq / s}cqw`;
    const fill = (measure(body) * s) / innerH;
    if (fill <= FIT.accept) break;
    s = Math.max(FIT.min, Math.min(s, (FIT.target * innerH) / measure(body)));
  }

  body.style.width = `${wCq / s}cqw`;
  const fill = (measure(body) * s) / innerH;
  body.style.height = `${hCq / s}cqw`;
  body.style.transform = s === 1 ? "" : `scale(${s})`;
  slide.dataset.scale = s.toFixed(2);
  slide.dataset.fill = fill.toFixed(2);
}

export default function DeckShell({ slides, text }: { slides: DeckSlide[]; text: DeckText }) {
  const ids = slides.map((s) => s.id);
  // Server renders everything on; stored choices apply after hydration.
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => allOn(ids));
  const [autofit, setAutofit] = useState(true);
  const [ready, setReady] = useState(false);
  const stack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get("only");
    const stored = fromList(ids, url) ?? fromList(ids, window.localStorage.getItem(ONLY_KEY));
    if (stored) setEnabled(stored);
    const fit = window.localStorage.getItem(FIT_KEY);
    if (fit === "0") setAutofit(false);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep the URL and storage in step with the selection
  useEffect(() => {
    if (!ready) return;
    const on = ids.filter((id) => enabled[id]);
    const url = new URL(window.location.href);
    if (on.length === ids.length) { url.searchParams.delete("only"); window.localStorage.removeItem(ONLY_KEY); }
    else { url.searchParams.set("only", on.join(",")); window.localStorage.setItem(ONLY_KEY, on.join(",")); }
    window.history.replaceState(null, "", url.toString());
    window.localStorage.setItem(FIT_KEY, autofit ? "1" : "0");
  }, [enabled, autofit, ready, ids]);

  const refit = useCallback(() => {
    const root = stack.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".slide").forEach((slide) => {
      if (slide.offsetParent !== null) { fitSlide(slide, autofit); return; }
      delete slide.dataset.natural; delete slide.dataset.scale; delete slide.dataset.fill;
      const body = slide.querySelector<HTMLElement>(".slide-body");
      if (body) { body.style.transform = ""; body.style.width = ""; body.style.height = ""; }
    });
  }, [autofit]);

  useEffect(() => {
    refit();
    let raf = 0;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(refit); };
    const ro = new ResizeObserver(schedule);
    stack.current?.querySelectorAll<HTMLElement>(".slide").forEach((el) => ro.observe(el));
    window.addEventListener("load", schedule);
    return () => { ro.disconnect(); window.removeEventListener("load", schedule); cancelAnimationFrame(raf); };
  }, [refit, enabled]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement | null)?.tagName === "INPUT") return;
      const forward = ["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key);
      const back = ["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key);
      if (!forward && !back) return;
      const visible = Array.from(document.querySelectorAll<HTMLElement>(".slide")).filter((el) => el.offsetParent !== null);
      if (visible.length === 0) return;
      const tops = visible.map((el) => el.getBoundingClientRect().top + window.scrollY);
      const here = window.scrollY + 160;
      const firstBelow = tops.findIndex((top) => top > here);
      const current = firstBelow === -1 ? visible.length - 1 : Math.max(0, firstBelow - 1);
      const next = Math.min(visible.length - 1, Math.max(0, current + (forward ? 1 : -1)));
      event.preventDefault();
      visible[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const setAll = (value: boolean) => setEnabled(Object.fromEntries(ids.map((id) => [id, value])));
  const count = ids.filter((id) => enabled[id]).length;

  return (
    <div className="deck-page">
      <div className="deck-toolbar">
        <div className="deck-toolbar-row">
          <button type="button" className="button primary" onClick={() => window.print()}>{text.export}</button>
          <a className="button secondary" href={text.backHref}>{text.back}</a>
          <label className="deck-check">
            <input type="checkbox" checked={autofit} onChange={(e) => setAutofit(e.target.checked)} />
            {text.autofit}
          </label>
          <small>{text.hint}</small>
        </div>
        <div className="deck-toolbar-row deck-include">
          <span className="deck-include-label">{text.include} · {count}/{ids.length}</span>
          {slides.map((s) => (
            <label key={s.id} className="deck-chip" data-on={enabled[s.id] ? "1" : "0"}>
              <input type="checkbox" checked={!!enabled[s.id]} onChange={(e) => setEnabled({ ...enabled, [s.id]: e.target.checked })} />
              {s.label}
            </label>
          ))}
          <button type="button" className="deck-mini" onClick={() => setAll(true)}>{text.all}</button>
          <button type="button" className="deck-mini" onClick={() => setAll(false)}>{text.none}</button>
        </div>
      </div>
      <div className="deck-stack" ref={stack}>
        {slides.map((s) => (
          <div key={s.id} className="deck-item" hidden={!enabled[s.id]}>
            {s.node}
          </div>
        ))}
      </div>
    </div>
  );
}
