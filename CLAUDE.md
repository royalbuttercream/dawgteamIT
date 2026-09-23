# Lambda Xi Chapter Website — Claude Context

## Project Overview
This is the official website for **Lambda Xi Chapter of Omega Psi Phi Fraternity, Inc.**
Built with static HTML pages (`.dc.html` format from Claude's design canvas), rendered via `support.js`.

## Site Structure
All pages live in `Lambda Xi 1911 optimization/`:

| File | Page |
|------|------|
| `Lambda Xi Homepage.dc.html` | Home (also contains #gallery, #events, #contact anchors) |
| `history-of-omega-psi-phi.dc.html` | History of Omega Psi Phi (parent org) |
| `history-of-lambda-xi.dc.html` | History of Lambda Xi chapter |
| `executive-officers.dc.html` | Current officers |
| `past-basilei.dc.html` | Past chapter leaders |
| `lineage.dc.html` | Member lineage |
| `mandated-programs.dc.html` | Fraternity mandated programs |
| `scholarships.dc.html` | Scholarship information |
| `50th-anniversary-gala.dc.html` | Events (50th Anniversary Gala) |
| `news.dc.html` | News and announcements |
| `contact-us.dc.html` | Contact page |

## Navigation
Each `.dc.html` page defines its own `navItems` array inside its `<script data-dc-script>` block (not `support.js`). The home copy uses anchor links; the other ten use file links. Keep them in step until the pages share one header.

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
- Local images live in `images/` at the repo root, organized by section (e.g., `images/history-of-lambda-xi/`, `images/shared/`)
- Some images still reference the old Strikingly CDN — these should be migrated to local `images/` paths over time
- Officer photos are currently hosted on Strikingly CDN

## External Links & Integrations
- **Parent organization**: Links to Omega Psi Phi national/district sites
- **Email**: Contact form or mailto links on `contact-us.dc.html`
- **Interactive media**: Placeholder for embedded video, audio, or social media content (YouTube, Instagram, etc.)

## Deployment
- Hosted on **GitHub Pages** at `https://royalbuttercream.github.io/dawgteamIT/`
- Repo: `git@github.com:royalbuttercream/dawgteamIT.git`
- Branch: `main` — all pushes to main deploy automatically

## Workflow for Adding Images
1. Drop image files into the appropriate `images/` subfolder
2. Run `./upload.sh` from the repo root to commit and push to GitHub
3. Reference images in HTML as `../images/<section>/<filename>`

## Key Rules
- Do not rename `.dc.html` files — `support.js` and internal nav links depend on exact filenames
- Keep images web-optimized (compress before adding; prefer `.jpg` for photos, `.png` for logos/crests)
- Test nav links after any structural changes — the nav array in `support.js` drives all page routing
