# Lambda Xi Chapter Website — Claude Context

## Project Overview
This is the official website for **Lambda Xi Chapter of Omega Psi Phi Fraternity, Inc.**
Static HTML built from `tooling/mock-src/` by `node tooling/build-mocks.mjs`. GitHub Pages serves the `docs/` output.

## Site Structure
Page sources are `tooling/mock-src/pages/<key>.html`; the key to folder mapping is `PAGES` and `SITE_PATHS` in `tooling/build-mocks.mjs`. Nine sections: Home `/`, History `/history/`, Leadership and Lineage `/leadership/` (officers, past basilei, lineage beneath it), Mandated Programs `/programs/`, Scholarships `/scholarships/`, Events `/events/` (one page per event beneath it), Gallery `/gallery/` (one page per year beneath it), News `/news/`, Contact `/contact/`. Each page folder also holds a `<slug>/mock/` standalone copy, the live-site audit (`report.md`, `source/`) and a README recording provenance and sign-off.

## Navigation
One shared header and footer: `tooling/mock-src/partials/header.html` and `footer.html`. Links use `{{href:key}}` and the build resolves them for every output. Do not hard-code page paths.

## Design system (approved 2026-09-23)
The palette and typefaces already used by the `.dc.html` pages are the brand system. The live site (lambdaxi1911.com) is reference for content and behaviour, not for colour or type. Token values, light theme:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#fbfaf7` | page background |
| `--fg` | `#1c1923` | body text |
| `--muted` | `#57535f` | secondary text |
| `--panel` | `#ffffff` | cards, header on light |
| `--field` | `#ffffff` | inputs |
| `--rule` | `#75708a` | input borders and separators that must meet 3:1 |
| `--accent` | `#34234f` | primary actions, links (deep purple) |
| `--accent-soft` | `#eee7fd` | accent tints |
| `--brand-purple` | `#1b0e2d` | dark header and hero surfaces |
| `--brand-purple-2` | `#231933` | submenu and raised surfaces on the dark header (the mock's `oklch(0.24 0.05 300)`) |
| `--brand-gold` | `#c69612` | gold accents, always with dark text |
| `--brand-gold-text` | `#e5bf6d` | gold text on purple; also the dark theme's `--accent` and `--link` (the mock's `oklch(0.82 0.11 85)`) |
| `--on-brand-rule`, `--on-brand-hover` | white at 35% and 10% | borders and hover fills on purple surfaces |

Dark theme values live in `tooling/mock-src/tokens.css` and must also pass WCAG 2.2 AA. Typefaces: Playfair Display (headings), Libre Franklin (body and UI), Archivo Black (display numerals only). Mono stack: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. Do not add gradients, palettes or typefaces beyond these.

## Forms
Every form posts to a Google Form (embed or link). No custom submit handlers, no `localStorage` stand-ins, no success copy that a real submission did not produce.

## Events data
`tooling/mock-src/data/events.json` is the single list of chapter events (title, start, end, place, summary, page key). The build embeds it into the home and Events mocks; `events.js` shows this month and next on home and the full list on Events, formatting dates in Korea time. Add or edit events there; never hard-code an event in a page.

## Audit and mocks
`report.md`, `mock-recommendations.md` and `<page>/report.md` hold the live-site audit. Phase B mocks live in `<page>/mock/`; shared source for their CSS and JS is `tooling/mock-src/`, copied into each mock folder by `tooling/build-mocks.mjs`. Each mock must pass the `frontend-reviewer` agent and an axe run at 375, 768 and 1440 before sign-off.

## Images
- Local images live in `images/` at the repo root, organized by section (e.g., `images/history-of-lambda-xi/`, `images/shared/`); the build copies referenced files into `docs/assets/`.
- Gallery photographs still load from the Strikingly CDN; migrate them to `images/` before the domain moves.

## External Links & Integrations
- **Parent organization**: Links to Omega Psi Phi national/district sites
- **Forms**: scholarship application and contact message are Google Forms owned by the chapter account; creation scripts in `tooling/forms/`
- **Newsletters and journal**: links to the chapter's Issuu documents on the News page

## Deployment
- Hosted on **GitHub Pages** at `https://royalbuttercream.github.io/dawgteamIT/`, served from the `docs/` folder on `main` (cut over 2026-09-24).
- `docs/` is build output: edit `tooling/mock-src/`, run `node tooling/build-mocks.mjs`, commit the result. Never hand-edit `docs/`, `merged/` or `<slug>/mock/`.
- Old live URLs are covered by redirect stubs generated from `tooling/mock-src/data/redirects.json`.
- Repo: `git@github.com:royalbuttercream/dawgteamIT.git`; pushes to `main` deploy automatically.
- The previous `.dc.html` site was removed on 2026-09-24; it remains in git history before that date.

## Workflow for Adding Images
1. Drop compressed image files into the appropriate `images/` subfolder
2. Reference them in the page source as `{{img:images/<section>/<filename>}}`
3. Run `node tooling/build-mocks.mjs`, review, then commit the source and the `docs/` output together

## Key Rules
- Never hand-edit `docs/`, `merged/` or `<slug>/mock/`; they are build output
- Keep images web-optimized (compress before adding; prefer `.jpg` for photos, `.png` for logos/crests; programme photos ship WebP and JPEG renditions)
- Changing a page's folder means a redirect: update `SITE_PATHS` and `tooling/mock-src/data/redirects.json` together

## Session Rules
- Never read image files or anything under `images/`.
- Exclude images from every git command that lists paths: `git <cmd> -- . ':!images'`.
- No screenshots unless asked.
- Pipe long command output through `head -50`.
