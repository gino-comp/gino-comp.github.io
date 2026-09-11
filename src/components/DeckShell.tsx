"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";

/* Everything interactive about the deck lives here; the slides themselves are
   rendered on the server and passed in.

   Order and selection. The chips are the deck: their order is the slide
   order, and a ticked chip is a slide that is in. Both are kept in the URL as
   ?slides=a,b,c — an ordered list of what is in — so any arrangement is a link
   you can send, and in localStorage so it sticks. With nothing stored, every
   slide is in, in the default order.

   Auto-fit — a slide measures its own content and scales it to fill most of
   the page: up when the content is sparse (capped, so a two-line slide does
   not become a poster), down when it would overflow. Slide typography is in
   container-query units and the fitted box is expressed in them too, so a
   scale factor computed on screen is exact on the printed 13.333in page. */

export type DeckSlide = { id: string; label: string; node: ReactNode };
export type DeckText = {
  export: string; fullscreen: string; back: string; backHref: string; hint: string;
  include: string; all: string; none: string; autofit: string;
  reorderHint: string; reset: string;
};

const ORDER_KEY = "ridm-deck:order";
const ENABLED_KEY = "ridm-deck:enabled";
const FIT_KEY = "ridm-deck:autofit";

// Grow sparse slides toward `target`; leave anything already fuller than
// `growBelow` alone; never scale beyond the caps.
const FIT = { target: 0.88, growBelow: 0.8, max: 1.5, min: 0.6, accept: 0.94 };

// A comma list from the URL or storage, kept to known ids, in the order given.
function parseList(ids: string[], list: string | null): string[] | null {
  if (!list) return null;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list.split(",")) {
    const id = raw.trim();
    if (ids.includes(id) && !seen.has(id)) { seen.add(id); out.push(id); }
  }
  return out.length ? out : null;
}

// `head` first, then whatever it left out, in default order.
function complete(ids: string[], head: string[]): string[] {
  return [...head, ...ids.filter((id) => !head.includes(id))];
}

function reorder(list: string[], id: string, targetId: string, place: "before" | "after"): string[] {
  if (id === targetId) return list;
  const without = list.filter((x) => x !== id);
  const at = without.indexOf(targetId) + (place === "after" ? 1 : 0);
  return [...without.slice(0, at), id, ...without.slice(at)];
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
  const byId = Object.fromEntries(slides.map((s) => [s.id, s]));
  // Server renders everything on, in default order; stored choices apply after hydration.
  const [order, setOrder] = useState<string[]>(ids);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(ids.map((id) => [id, true])));
  const [autofit, setAutofit] = useState(true);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [drop, setDrop] = useState<{ id: string; place: "before" | "after" } | null>(null);
  const [presenting, setPresenting] = useState(false);
  const stack = useRef<HTMLDivElement>(null);

  // Full screen is requested on the stack alone, so the site header and this
  // toolbar are left out of it without any hiding.
  useEffect(() => {
    const onChange = () => setPresenting(document.fullscreenElement === stack.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const present = () => { stack.current?.requestFullscreen?.(); };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseList(ids, params.get("slides") ?? params.get("only"));
    if (fromUrl) {
      setOrder(complete(ids, fromUrl));
      setEnabled(Object.fromEntries(ids.map((id) => [id, fromUrl.includes(id)])));
    } else {
      const storedOrder = parseList(ids, window.localStorage.getItem(ORDER_KEY));
      const storedOn = parseList(ids, window.localStorage.getItem(ENABLED_KEY));
      if (storedOrder) setOrder(complete(ids, storedOrder));
      if (storedOn) setEnabled(Object.fromEntries(ids.map((id) => [id, storedOn.includes(id)])));
    }
    if (window.localStorage.getItem(FIT_KEY) === "0") setAutofit(false);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDefault = order.every((id, i) => id === ids[i]) && ids.every((id) => enabled[id]);

  // keep the URL and storage in step with the arrangement
  useEffect(() => {
    if (!ready) return;
    const on = order.filter((id) => enabled[id]);
    const url = new URL(window.location.href);
    url.searchParams.delete("only");
    if (isDefault) {
      url.searchParams.delete("slides");
      window.localStorage.removeItem(ORDER_KEY);
      window.localStorage.removeItem(ENABLED_KEY);
    } else {
      url.searchParams.set("slides", on.join(","));
      window.localStorage.setItem(ORDER_KEY, order.join(","));
      window.localStorage.setItem(ENABLED_KEY, on.join(","));
    }
    window.history.replaceState(null, "", url.toString());
    window.localStorage.setItem(FIT_KEY, autofit ? "1" : "0");
  }, [order, enabled, autofit, ready, isDefault]);

  const refit = useCallback(() => {
    const root = stack.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".slide").forEach((slide) => fitSlide(slide, autofit));
  }, [autofit]);

  useEffect(() => {
    refit();
    let raf = 0;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(refit); };
    const ro = new ResizeObserver(schedule);
    stack.current?.querySelectorAll<HTMLElement>(".slide").forEach((el) => ro.observe(el));
    window.addEventListener("load", schedule);
    return () => { ro.disconnect(); window.removeEventListener("load", schedule); cancelAnimationFrame(raf); };
  }, [refit, enabled, order]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.target as HTMLElement | null)?.tagName === "INPUT" || event.altKey) return;
      const forward = ["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key);
      const back = ["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key);
      if (!forward && !back) return;
      const visible = Array.from(document.querySelectorAll<HTMLElement>(".slide")).filter((el) => el.offsetParent !== null);
      if (visible.length === 0) return;
      // on the page a slide sits below the sticky header; in full screen at the top
      const offset = document.fullscreenElement ? 0 : 150;
      let current = 0, nearest = Infinity;
      visible.forEach((el, i) => {
        const d = Math.abs(el.getBoundingClientRect().top - offset);
        if (d < nearest) { nearest = d; current = i; }
      });
      const next = Math.min(visible.length - 1, Math.max(0, current + (forward ? 1 : -1)));
      event.preventDefault();
      visible[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const setAll = (value: boolean) => setEnabled(Object.fromEntries(ids.map((id) => [id, value])));
  const reset = () => { setOrder(ids); setEnabled(Object.fromEntries(ids.map((id) => [id, true]))); };
  const count = ids.filter((id) => enabled[id]).length;

  // --- drag and drop between chips
  const onDragStart = (id: string) => (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setDragging(id);
  };
  const onDragOver = (id: string) => (e: DragEvent<HTMLElement>) => {
    if (!dragging || dragging === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const box = e.currentTarget.getBoundingClientRect();
    setDrop({ id, place: e.clientX < box.left + box.width / 2 ? "before" : "after" });
  };
  const onDrop = (id: string) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (dragging && drop && drop.id === id) setOrder((prev) => reorder(prev, dragging, id, drop.place));
    setDragging(null); setDrop(null);
  };
  const onDragEnd = () => { setDragging(null); setDrop(null); };
  // Alt + arrow on a focused chip moves it one place
  const onChipKey = (id: string) => (e: KeyboardEvent<HTMLElement>) => {
    if (!e.altKey || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = e.key === "ArrowLeft" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="deck-page">
      <div className="deck-toolbar">
        <div className="deck-toolbar-row">
          <button type="button" className="button primary" onClick={() => window.print()}>{text.export}</button>
          <button type="button" className="button secondary" onClick={present}>{text.fullscreen}</button>
          <a className="button secondary" href={text.backHref}>{text.back}</a>
          <label className="deck-check">
            <input type="checkbox" checked={autofit} onChange={(e) => setAutofit(e.target.checked)} />
            {text.autofit}
          </label>
          <small>{text.hint}</small>
        </div>
        <div className="deck-toolbar-row deck-include">
          <span className="deck-include-label">{text.include} · {count}/{ids.length}</span>
          {order.map((id) => (
            <label
              key={id}
              className={`deck-chip${dragging === id ? " is-dragging" : ""}`}
              data-on={enabled[id] ? "1" : "0"}
              data-drop={drop?.id === id ? drop.place : undefined}
              draggable
              onDragStart={onDragStart(id)}
              onDragOver={onDragOver(id)}
              onDragLeave={() => setDrop((d) => (d?.id === id ? null : d))}
              onDrop={onDrop(id)}
              onDragEnd={onDragEnd}
              onKeyDown={onChipKey(id)}
            >
              <span className="deck-grip" aria-hidden="true">⋮⋮</span>
              <input type="checkbox" checked={!!enabled[id]} onChange={(e) => setEnabled({ ...enabled, [id]: e.target.checked })} />
              {byId[id].label}
            </label>
          ))}
          <button type="button" className="deck-mini" onClick={() => setAll(true)}>{text.all}</button>
          <button type="button" className="deck-mini" onClick={() => setAll(false)}>{text.none}</button>
          {!isDefault ? <button type="button" className="deck-mini deck-reset" onClick={reset}>{text.reset}</button> : null}
          <small className="deck-reorder-hint">{text.reorderHint}</small>
        </div>
      </div>
      {/* Slides that are out are not mounted, not merely hidden: the print
          stylesheet suppresses the page break after the last item, and a
          hidden last item would leave the last visible slide forcing a blank
          trailing page. */}
      <div className={`deck-stack${presenting ? " is-presenting" : ""}`} ref={stack} tabIndex={-1}>
        {order.filter((id) => enabled[id]).map((id, i, on) => (
          <div key={id} className="deck-item" data-n={`${i + 1} / ${on.length}`}>
            {byId[id].node}
          </div>
        ))}
      </div>
    </div>
  );
}
