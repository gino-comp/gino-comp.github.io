# RiDM Technology Website

Production-oriented Next.js implementation of the RiDM Technology website concept.

## Stack

- Next.js 15 / App Router
- React 19
- TypeScript
- Plain CSS (no runtime UI framework dependency)
- Korean / English routes
- Metadata, hreflang, sitemap, robots.txt
- JSON-LD for Organization and the 3DRA publication
- Static export (`output: "export"`) deployed to GitHub Pages via GitHub Actions

## Routes

```text
/
└── redirect → /ko

/ko                     /en
/ko/technology          /en/technology
/ko/applications        /en/applications
/ko/research            /en/research
/ko/news                /en/news
/ko/about               /en/about
/ko/contact             /en/contact
```

The homepage keeps the full editorial scroll experience, while the sub-routes expose the major content areas independently for navigation and SEO.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production check:

```bash
npm run typecheck
npm run build
npx serve out
```

`npm run build` produces a fully static site in `out/`. There is no Node server in
production, so `next start` is not used.

## GitHub

```bash
git init
git add .
git commit -m "Initial RiDM website"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

A GitHub Actions workflow in `.github/workflows/ci.yml` runs TypeScript and production build checks on pushes and pull requests.

## GitHub Pages deployment

The site is deployed as a static export to GitHub Pages from
`.github/workflows/deploy.yml`, which builds on every push to `main` and
publishes `out/`.

One-time repository setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   Without this the workflow builds but cannot publish.
2. Push to `main`. The site goes live at `https://gino-comp.github.io/`.

### Static-export constraints

GitHub Pages serves files only — no Node server. The following therefore apply
and must not be reintroduced:

- No `middleware.ts`. The `/` → `/ko` redirect is a static `public/index.html`
  meta-refresh instead.
- No request-time APIs (`headers()`, `cookies()`, dynamic `searchParams`).
  The root layout lives at `src/app/[locale]/layout.tsx` and takes `lang` from
  the route param.
- `next/image` runs with `unoptimized: true`.
- Route handlers used for metadata (`robots.ts`, `sitemap.ts`) declare
  `export const dynamic = "force-static"`.
- `trailingSlash: true`, so every route exports as `<route>/index.html` and
  canonical URLs carry the trailing slash.

### Moving to the ridm.tech domain later

1. Set `NEXT_PUBLIC_SITE_URL: https://www.ridm.tech` in `.github/workflows/deploy.yml`
   (this feeds canonical URLs, `hreflang`, `sitemap.xml`, `robots.txt` and JSON-LD).
2. Add `public/CNAME` containing `www.ridm.tech`.
3. Point DNS: `CNAME www → gino-comp.github.io`.
4. Settings → Pages → Custom domain, then enable **Enforce HTTPS**.
5. Update the absolute URL in `public/index.html`.

## Content updates

Primary bilingual copy and structured content lives in:

```text
src/lib/i18n.ts
```

This includes:

- Hero copy
- DODA / Technology copy
- Applications
- Research publications
- Patents
- What's New announcements
- Team profiles
- Contact copy

A What's New entry is two edits in that file: the date and category go in
`common.news`, and the title, body and optional outbound link go in
`newsCopy.items` under each locale, keyed the same. The link sits with the
prose because coverage of a milestone differs by language — the seed round
points at a Korean outlet in `ko` and an English one in `en`. A date carries only the precision that is
known (`"2026"`, `"2026-03"` or `"2026-03-14"`); the page renders and sorts each
entry at that precision, newest first, so a new entry can be added anywhere in
the list.

The site components live in:

```text
src/components/
```

## Brand assets

```text
public/brand/ridm-logo.png
public/team/jinho-lee.jpg
```

Team portraits are committed pre-sized and EXIF-stripped, because
`images.unoptimized` means the file shipped is the file downloaded. To add
another, derive it the same way and set `portrait` on that member in
`src/lib/i18n.ts` (members without a portrait use `portrait: null`):

```bash
convert <source> -crop <w>x<h>+<x>+<y> +repage -resize 900x1125 \
  -strip -interlace Plane -quality 82 public/team/<name>.jpg
```

The logo supplied for this project is used directly. Replace this file with an approved higher-resolution / transparent master if RiDM has one.

## Items to confirm with RiDM before production launch

The implementation intentionally avoids guessing on company information. Please confirm these before launch:

1. Official current title for each co-founder, especially Serena Xie and Tingting Xiang.
2. Whether `Near-Sensor Processor` is the preferred top-level market positioning.
3. Whether all three listed PCT patent families may be publicly displayed.
4. Official contact email or whether the existing `ridm.tech/contact-us` page should remain the primary contact endpoint.
5. Final outbound links for publications, patents and founder LinkedIn profiles.

## SEO / GEO included

- localized `title` / `description`
- canonical URL
- Korean / English alternates (`hreflang` via Next metadata)
- Open Graph and Twitter metadata
- `sitemap.xml`
- `robots.txt`
- Organization JSON-LD
- ScholarlyArticle JSON-LD for 3DRA
- semantic H1 / H2 hierarchy
- reduced-motion support and keyboard focus states

## Design direction

The final system uses RiDM's existing logo and product/research content while taking layout cues from contemporary deep-tech websites: oversized editorial typography, restrained motion, high-contrast technical diagrams, clear architecture hierarchy, and alternating dark/light content sections.
