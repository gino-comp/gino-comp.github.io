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
- GitHub Actions build check

## Routes

```text
/
└── redirect → /ko

/ko                     /en
/ko/technology          /en/technology
/ko/applications        /en/applications
/ko/research            /en/research
/ko/company             /en/company
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
npm start
```

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

## Vercel deployment

1. Push this directory to GitHub.
2. Import the repository into Vercel.
3. Framework preset should resolve automatically to **Next.js**.
4. Add the environment variable below if the production URL differs from `https://www.ridm.tech`:

```text
NEXT_PUBLIC_SITE_URL=https://www.ridm.tech
```

5. Deploy to a preview domain first.
6. After QA, attach the production domain in Vercel and update DNS.

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
- Team profiles
- Contact copy

The site components live in:

```text
src/components/
```

## Brand assets

```text
public/brand/ridm-logo.png
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
