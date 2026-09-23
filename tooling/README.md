# Audit tooling

Read-only crawler and analysis scripts used for the lambdaxi1911.com review. Node 24, Playwright 1.63, axe-core 4.11, jsdom. `node_modules/` is ignored by git; run `npm install` here to restore it.

| Script | What it does | Output |
|---|---|---|
| `crawl.mjs [slug ...]` | Loads each page in `pages.json` at 375, 768 and 1440; blocks every non-GET request; records the promo popup then closes it; scrolls to mount lazy sections; takes fold and full-page screenshots; runs the structural inventory (`inventory.js`), a keyboard focus walk (`focus-walk.js`), axe-core, and safe interactions (mobile drawer, dropdown hover, first lightbox); saves raw HTML, rendered DOM, request log, nav structure | `../<slug>/screenshots/`, `../<slug>/source/`, `../<slug>/summary.json` |
| `reshoot.mjs [slug ...]` | Re-takes only the full-page screenshots with a slow scroll so scroll-triggered sections are rendered | `../<slug>/screenshots/<width>-full.png` |
| `summarize.mjs [slug ...]` | Prints a per-page digest of the crawl artifacts (weight, hosts, headings, links, controls, focus order, axe rules) | stdout; `digest-1.txt` and `digest-2.txt` are the first-pass digests kept as evidence |
| `extract-content.mjs [slug ...]` | Extracts headings, paragraphs, lists, accordion bodies, links, images and form fields from the rendered DOM in document order | `../<slug>/source/content.txt` |
| `axe-summary.mjs` | Aggregates axe rule counts across all pages and lists every distinct failing colour pair with its ratio | stdout |
| `probe-mobile.mjs`, `probe-forms.mjs`, `probe-desktop-forms.mjs` | One-off probes used to find the popup and drawer selectors and to confirm that forms mount late rather than being absent at desktop widths | stdout; `../<slug>/screenshots/<width>-form-late.png` |

Logs from the audit run: `crawl.log`, `crawl-rerun.log` (five pages re-run after interaction timeouts), `crawl-forms.log` (four form pages re-run with a longer settle), `reshoot.log`.

Look-only guarantee: `crawl.mjs` and `reshoot.mjs` install a route that aborts any request whose method is not GET, HEAD or OPTIONS. Blocked requests are recorded in each `requests-<width>.json` with status `BLOCKED-NON-GET`; all of them were third-party telemetry (Issuu, New Relic, hCaptcha site-config, Facebook).
