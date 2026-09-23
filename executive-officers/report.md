# Executive Officers: review

URL: https://www.lambdaxi1911.com/executive-officers
Captures: `screenshots/`, `source/`

## Who comes here and why

Members, visiting brothers, partner organisations and parents who want to know who holds which office and how to address them.

## What the page contains

`h1` "Executive Officers"; eight cards in a three-column grid: photo (1200 x 1200 PNG shown at 360 px), `h3` office title, name. Basileus Eugene Gibbs, Immediate Past Basileus Richard Smith, Vice Basileus Randy Artis, Keeper of Records and Seal Charlesvester Wims, Keeper of Finance Marcus Shepard, Chaplain Andrew Wesley, Keeper of Peace Clint Carmichael, Editor to the Oracle Michael Robinson. Footer with social links.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find the Basileus | 1 (close popup) | 0 | First card. |
| Contact an officer | not possible | 1 | No email, no office address per officer, no link to Contact. |
| Find what an office does | not possible | 0 | Titles such as "Keeper of Peace" are unexplained. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| EO1 | High | 4.2 MB of officer photos: eight 1200 x 1200 PNGs of 351 to 545 KB, shown at 360 px (96 px on the repo mock). | `source/requests-1440.json`; `inventory-1440.json` `images` | Second-heaviest non-gallery page. | JPEG or WebP at 400 and 800 px with `srcset`; about 40 KB each. |
| EO2 | Medium | Every photo has `alt="Section image"`. | inventory `images` | Screen readers hear "Section image" eight times; the name is in the text, so alt should be the name or empty with the name as the accessible label of the card. | `alt="Brother Eugene Gibbs"` or `alt=""` with the card as a `figure` and `figcaption`. |
| EO3 | Medium | Heading order jumps from `h1` to `h3`; a duplicate "Keeper of Records and Seal" paragraph is rendered white on white (1.09:1) below the card. | axe `heading-order`, `color-contrast` x11 at 1440 | Leftover content and a broken outline. | `h2` per officer; delete the stray paragraph. |
| EO4 | Medium | No route to contact an officer or the chapter from this page. | inventory `links` | The page answers "who" and stops. | Chapter role email per office (basileus@, krs@) or a single "Contact the chapter" link. |
| EO5 | Low | At 375 the eight cards stack to 3,988 px with 360 px photos; the page is a long scroll for eight names. | `screenshots/375-full.png` | | 96 to 120 px round portraits in a two-column grid on phones. |
| EO6 | Low | The first full-page capture showed blank card areas: the theme animates sections in on scroll and had not rendered them when the page was captured after a fast scroll. The reshot capture, taken after a slow scroll, includes them. | `screenshots/1440-full.png` (reshot) | Content depends on scroll-triggered JavaScript. | Static content, no entrance animation, or `prefers-reduced-motion` respected. |

Site-wide: L2, L3, L4, L5, L6, L8, L9, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x11, `heading-order`, `landmark-one-main`, `meta-viewport-large`, `region` x15 |
| axe 375 | `color-contrast` x4, `heading-order`, `list`, plus the above |
| Keyboard | 10 stops at 1440 (nav, four social icons, cookie) |
| Headings | hidden h1, hidden h2, h1, eight h3 |

## Everything the page does (parity list)

Eight officer cards (photo, title, name); social links; footer.

## For the repo mock

`executive-officers.dc.html` already does this well: local 600 x 600 photos at 96 px, title and name per card, correct order. Add per-officer alt text or figure captions, `h2` per officer, a "what each office does" line behind a disclosure, and a contact route. Downsize the photos to 240 px sources (they are 600 px for a 96 px circle) and merge this page with Past Basilei and Lineage as proposed in `report.md` C1.
