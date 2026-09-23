# Gallery 2017 to 2020: review

URL: https://www.lambdaxi1911.com/2017-2020
Captures: `screenshots/` (including `1440-lightbox.png`), `source/`

## What the page contains

`h2` "The Good Bruhz" (no `h1`); one album of 60 thumbnails, 5 with alt text ("The Brothers ...", "Bro Brown and ..."); collapsed behind "Show more" at 1440. Page title is "Korea Bruhz".

## Measurements

| | 375 | 1440 |
|---|---|---|
| Page height | 2,134 px | 900 px until the album mounts (about 6 s), then expands |
| Requests | 215 | 209 |
| Bytes | 5.2 MB | 4.8 MB |

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| See the early photos | 2, wait about 6 s, "Show more" | 0 | The first pass (`tooling/digest-2.txt`, `docH` 900) found only the heading and the link; the grid mounted later (`screenshots/1440-full.png`, reshot, shows it). |
| Know which year a photo is from | not possible | 0 | Four years in one unlabelled album. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| G17-1 | Medium | Four years merged into one album with no dates or event names; title "Korea Bruhz", heading "The Good Bruhz", nav "2017-2020". | content.txt; inventory `title` | Three names, no dates. | Split by year and event where known; one label. |
| G17-2 | Medium | The album mounts about 6 s after load; a quick visitor sees a heading and a "Show more" link over nothing. | probe (`tooling/probe-forms.mjs` output: gallery items appeared at 6.8 s) | | Server-rendered thumbnails. |
| G17-3 | Medium | 55 of 60 images have `alt=""`; "Show more" 2.37:1. | content.txt; axe | | Captions; visible button. |
| G17-4 | Low | No `h1`. | inventory `headings` | | `h1` "Gallery 2017 to 2020". |

Site-wide: L2, L3, L4, L5, L6, L8, L9, L11, L12, L13.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x2, `landmark-one-main`, `meta-viewport-large`, `region` x16 |
| Lightbox | dialog, modal, Escape closes |

## Everything the page does (parity list)

One album, 60 photos, 5 alt texts; expander; lightbox.

## For the repo mock

The mock's "2017-2020" pill is empty. Carry the 60 photos; ask the chapter for event and year labels.
