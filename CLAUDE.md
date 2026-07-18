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
The nav is defined as a JavaScript array in `support.js` with nested submenus under "Our Legacy" and "Programs".

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
