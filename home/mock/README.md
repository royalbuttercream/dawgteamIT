# Home mock

Open `home-mock.html` by double-click or from any static server. It carries its own `tokens.css`, `mock.css` and `mock.js`; images are referenced from the repo's `images/` folder. The merged copy with working links between mocks is `merged/home.html`.

Source of the shared CSS and JS: `tooling/mock-src/`. Rebuild with `node tooling/build-mocks.mjs`; verify with `node tooling/verify-mock.mjs home`.

## What is real and what is sample

Every date, place, name, amount and quotation comes from lambdaxi1911.com as captured on 23 September 2026 (see `../source/content.txt` and the event page reports). Nothing on the page is sample data. The nav links for pages that do not have a mock yet open the live page in a new tab with an external marker; they switch to the mock automatically when that page is built.

Not carried over on purpose: the timed promo popup, the cookie banner, the Issuu embed (replaced by links), the Facebook, New Relic and Google Maps scripts, and the repo mock's subscribe form and hero video (neither exists on the live site; the form delivered nothing).

## Step counts

Steps are clicks, taps and typed fields from arriving on the page. "Repo mock" is the current `Lambda Xi Homepage.dc.html`.

| Task | Live home | Repo mock | This mock |
|---|---|---|---|
| Learn what and where the chapter is | 1 (close popup), read paragraph 3 | 0 | 0, first sentence of the hero |
| Find the next event and its date | 3 (popup, hover Upcoming Events, pick); dates only in posters | 2 (scroll, card says "Date TBA") | 0, six dated items above the fold on desktop |
| Register for the Youth Leadership Conference | 2 via popup | not possible | 1 |
| Find the scholarship window | 3 | 2 (footer, page) | 0 |
| Contact the chapter | 2 to the form; no email on page | 3 (Get Involved lands on footer) | 1 (email link) or 1 (contact page) |
| Find the chapter on a map | mobile 2, desktop not possible | 2 | 1 |
| Read the newsletter | scroll, 6.8 MB embed | 2 (news page, external) | 1 |
| Reach any dropdown page with a keyboard | not possible | not possible | Tab to parent, Enter, arrow or Tab into the list |
| Switch theme | not offered | not offered | 1 |

## Everything the live home does, and where it is here

| Live capability | Here |
|---|---|
| Header, crest, wordmark, tagline | Header |
| Eight-item nav with dropdowns and "Seeking" pill | Seven items in the consolidated structure, two dropdowns, "Interested in joining?" pill |
| Hero headline | Hero with headline, one-sentence description and two actions |
| Basileus message, six paragraphs, portrait | Full text; paragraphs five and six behind a disclosure; portrait with caption |
| Souvenir journal viewer | Link to the same Issuu document, plus both newsletters |
| Social links | Footer |
| Mobile drawer with expandable groups | Menu button, nav with disclosure buttons, Escape closes |
| Map via mobile bar | Map link on the Contact page |
| Promo popup for the YLC | YLC card in the events list with the registration link |
| Cookie banner | No third-party scripts, so none needed |

Added: events this month and next, theme toggle, skip link, landmarks, `aria-current`.

## Verification

`verify.json` holds the last run. Checks: axe-core (WCAG 2.2 A and AA plus best practice) at 375, 768 and 1440 in light and dark; horizontal overflow; keyboard walk with a visible focus indicator on every stop; dropdown opens with Enter, moves focus into the list, closes with Escape; theme choice persists across reload and "System" follows a live OS change. Token contrast: `node tooling/check-tokens.mjs`, 26 pairs per theme.

Review gate: see the frontend-reviewer result recorded below.

### frontend-reviewer result, 23 September 2026

No CRITICAL findings. Three warnings and five suggestions, all applied except two that are recorded as accepted:

| Finding | Action |
|---|---|
| `aria-label` on the social icons suppressed the "opens in a new tab" note | `mock.js` now appends the note to the label itself |
| `--brand-purple-2` and `--brand-gold-text` were not in the approved token table | Added to `CLAUDE.md`; both are the repo mock's own `oklch()` values converted to hex |
| Seven hardcoded white-alpha borders and hover fills | Replaced by `--on-brand-rule` and `--on-brand-hover` |
| Magic-number widths for menu, portrait and date tile | Tokens `--menu-width`, `--portrait`, `--date-tile` |
| `nav aria-label="Main"` next to `main` | Renamed "Primary" |
| `prefers-contrast: more` not handled | Added: muted text and rules take the foreground colour |
| CSS-generated middle dots between event meta items | Accepted: each item is a complete phrase on its own; no meaning rides on the separator |
| Skip link z-index above any future overlay | Accepted: no overlays exist; noted for later pages |

Re-verified after the fixes: token pairs all pass, axe clean at all six width and scheme combinations, no overflow, keyboard and theme checks pass.

### Revision, 24 September 2026, per operator feedback

Applied to the home page and, where shared, to every page:

| Point | Change |
|---|---|
| Basileus message cut off and below events | Full six paragraphs, no disclosure, placed directly under the hero |
| "Contact" in the header | "Contact Us" on every page (shared header partial) |
| Background photo | The live site's Seoul night photograph, imported at 1,920 and 960 px into `images/home/`, behind a dark scrim |
| Hero buttons | Removed |
| Events: this month and next, updating on its own | `events.js` reads `tooling/mock-src/data/events.json`, inlined into the page at build, and shows events whose dates fall in the current and next month in Korea time; when there are none it says so and links to the Events page. The Events page uses the same script and data for its Upcoming and Held lists, so the two never disagree. The chapter maintains one file. |
| "The chapter at a glance" | Removed; the charter date moved into the hero sentence, the awards remain on History |
| "Chapter moments" strip | Removed; the Gallery is one click away in the header |
| News section and Get in Touch section | Removed; both remain in the header |
| Footer | Social links and "© RoK Hard Since 1977" only, on every page |
| Spacing | One section rhythm (`clamp(3rem, 6vw, 4.5rem)`) on every page; one text column at 70 characters; one card grid on the page |

The page is now four blocks: header, hero, message, events this month and next, footer. Verified after the change: axe clean at five widths in both themes, no overflow, focus and dropdown checks pass. `merged/index.html` is the review hub listing every built page with its status.
