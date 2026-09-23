# Gallery 2022: review

URL: https://www.lambdaxi1911.com/2022
Captures: `screenshots/`, `source/`

## What the page contains

Nine albums, each an `h2`: Achievement Week, Halloween, Going Away, Back to School, Juneteenth/Father's Day, Easter Fellowship, BlackOWT MasQUErade, Rooftop Brunch, Supporting the Scouts. 395 thumbnails; 314 have alt text (the only gallery page that does). No visible captions. Several albums start collapsed behind a "Show more" link.

## Measurements

| | 375 | 1440 |
|---|---|---|
| Page height | 15,164 px | 19,087 px |
| Requests | 614 | 835 |
| Bytes | 6.9 MB | 9.5 MB |

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| See the Halloween photos | 2, scroll to album two, click "Show more" | 0 | "Show more" is 2.37:1 cyan text, 18 px tall. |
| Find the Scouts photos | 2, scroll to the ninth album | 0 | No index. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| G22-1 | High | Nine albums on one page with no index; 9.5 MB. | inventory | | Album index (C4). |
| G22-2 | Medium | "Show more" expanders: #2eb6dc on white 2.37:1, 73 x 18 px, no `aria-expanded`. | axe `color-contrast`; `inventory-375.json` `tapTargets` | Hard to see, hard to tap, state not announced. | Button with visible style, 44 px target, `aria-expanded`. |
| G22-3 | Medium | Alt text exists on 314 images but is not shown as captions, so sighted visitors get less than screen reader users. | content.txt | The work is done; show it. | Caption from alt. |
| G22-4 | Low | 81 images still have `alt=""`; one has none. | inventory; axe `image-alt` | | Complete the set. |

Site-wide: L2, L3, L4, L5, L6, L8, L11, L12, L13.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `aria-dialog-name`, `color-contrast` x9, `image-alt`, `meta-viewport-large`, `region` x16 |

## Everything the page does (parity list)

Nine albums; 395 photos, 314 with alt; "Show more" expanders; lightbox.

## For the repo mock

The mock has two 2022 photos (13th District Conference). Carry the nine live albums and reuse the 314 existing alt texts as captions; this is the one year where the caption work already exists.
