# Mandated Programs mock

Replaces `/mandated-programs`, a single scrolling page listing the twelve programmes every Omega chapter is required to run. The mock keeps the twelve rows but adds a jump list, an `h2` per programme, and links where Lambda Xi has a page for the programme. Built to `mandated-programs/mock/mandated-programs-mock.html` by `node tooling/build-mocks.mjs` from `tooling/mock-src/pages/programs.html`; verified with `node tooling/verify-mock.mjs mandated-programs`.

## What is real, what is inferred, what is sample

All twelve programmes are present in the source order of the live page, with matching text. Four images (blood drive, NAACP, STEM, voting) are stock graphics carried over from the live page and marked decorative (`alt=""`); the other eight are the chapter's own event photographs. Five rows carry cross-links to the chapter's own pages (Achievement Week, Youth Leadership Conference, All Star Game, Scholarships, the 2025 Talent Hunt album) that the live page does not have; the page's data-note discloses this. The live NAACP text's typo "could standing" is corrected to "good standing" here, also disclosed in the data-note. Nothing on this page is invented content: every title, description and photo traces to the live page or a chapter-run event page.

## Step counts

| Task | Live | Repo mock | This mock |
|---|---|---|---|
| Find a specific programme, e.g. STEM | scroll past however many rows come before it | scroll the card grid | 1 (jump list) |
| Reach the Achievement Week page from here | 1 (image or heading link, opens a new tab) | not possible: no links | 1 (same tab) |
| Read on a phone | 6,150 px scroll, no overview | scroll the card grid | jump list, then the target row |

## Everything the live page did, and where it is here

| Live capability | Here |
|---|---|
| Twelve programme rows, photo and text | Same rows, same text, same order |
| Achievement Week link | Kept, same tab instead of a new one |
| Scholarship link | Kept, same tab instead of a new one |
| Stock graphics for four programmes | Kept, marked `alt=""` |
| No overview or jump list | Twelve-item jump list added at the top |
| `h1` then `h3` heading order | `h1` page title, `h2` per programme |

## Images

Each of the twelve photos is a `<picture>` element: WebP sources at 400, 700 and 900px widths, with a JPEG `srcset` at the same three widths as fallback. Both sets were generated from the 900px originals in `images/programs/` using `sips` for the JPEG resizes and `cwebp` for the WebP encodes. Typical sizes per photo are about 31, 68 and 85 KB for the JPEG widths and 13, 26 and 38 KB for the WebP widths. Desktop viewports load the 700px WebP; a 375px phone loads the 400px WebP.

## Verification

`verify.json` in this folder: axe-core zero violations at 320, 375, 768, 1280 and 1440 in light and dark; no horizontal overflow; every focus stop has a visible indicator; the header dropdown opens, traps focus and closes on Escape; theme choice persists after reload and follows the OS default. All ten width-and-theme combinations pass.

### frontend-reviewer result, 24 September 2026

| Finding | Action |
|---|---|
| Images had no `srcset` and no WebP rendition | Added WebP and JPEG `srcset` at 400, 700 and 900px for all twelve photos |
| Cross-links to other chapter pages were undisclosed | Data-note extended to name the five linked pages |
| The NAACP typo correction was undisclosed | Data-note extended to note the correction |
| No README for this mock | This file |
| Unused `events.js` and `gallery.js` copies in the mock folder | Left as is; shared build output copied into every mock folder |
