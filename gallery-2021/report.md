# Gallery 2021: review

URL: https://www.lambdaxi1911.com/2021
Captures: `screenshots/` (including `1440-lightbox.png`), `source/`

## What the page contains

Three albums, each an `h2`: Holiday Season, Achievement Week, Halloween. 146 thumbnails, 46 with alt text; all three albums collapsed behind "Show more" at 1440 (page is 1,453 px until expanded) and expanded at 375 (4,585 px).

## Measurements

| | 375 | 1440 |
|---|---|---|
| Page height | 4,585 px | 1,453 px (collapsed) |
| Requests | 327 | 306 |
| Bytes | 6.2 MB | 6.5 MB |

Even collapsed, the page downloads 2.4 MB of images and 3.1 MB of scripts.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| See any album | 2, then "Show more" | 0 | Three expanders, each 2.37:1. |
| Return to a specific album later | no anchors | 0 | |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| G21-1 | Medium | Collapsed albums show three rows and a low-contrast "Show more"; expanding all three on desktop is three extra clicks and the page then behaves like the others. | `screenshots/1440-full.png`; axe `color-contrast` | The pattern is right (progressive disclosure) but the control is nearly invisible and not announced. | Visible button with count ("Show 40 more"), `aria-expanded`. |
| G21-2 | Medium | 100 of 146 images have `alt=""`. | content.txt | | Captions. |
| G21-3 | Low | Heading order incomplete (axe `heading-order` x5 flagged as needs review) because album titles are `h2` under a hidden `h1` "The RoK Hard Ques". | axe incomplete | | Real `h1` "Gallery 2021". |

Site-wide: L2, L3, L4, L5, L6, L8, L11, L12, L13.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x2, `landmark-one-main`, `meta-viewport-large`, `region` x18 |
| Lightbox | dialog, modal, focus inside, Escape closes |

## Everything the page does (parity list)

Three albums (Holiday Season, Achievement Week, Halloween); 146 photos; expanders; lightbox.

## For the repo mock

The mock's 2021 pill is empty. Carry the three albums.
