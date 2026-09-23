# Gallery 2024: review

URL: https://www.lambdaxi1911.com/2024
Captures: `screenshots/`, `source/`

## What the page contains

Four albums on one page: `h1` "Achievement Week Banquet", `h2` "Letters and Sweaters", `h2` "Linen & Spring Dress", `h2` "BlackOWT". 640 thumbnails, all `alt=""`, no captions. Lightbox per album.

## Measurements

| | 375 | 768 | 1440 |
|---|---|---|---|
| Page height | 22,591 px | 21,026 px | 33,693 px |
| Requests | 811 | | 858 |
| Bytes | 22.6 MB | | 24.6 MB |
| HTML document | 1,580 KB | | |
| Time to settle | 15 s | 18 s | 25 s |

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| See the banquet photos | 2 | 0 | First album, but the page keeps loading for 25 s. |
| See the BlackOWT photos | 2, then scroll about 25,000 px | 0 | No album index or jump links. |
| Find one photo | scan 640 | 0 | No captions. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| G24-1 | Critical | 24.6 MB and 858 requests on one URL; a 1.6 MB HTML document. On a 10 Mbps connection this is a 20 second load before scrolling, and the browser holds 640 decoded images. | `source/requests-1440.json`, `inventory-1440.json` `perf` | The heaviest page on the site by a factor of two; phones with limited memory reload or crash on it. | Album index page; each album paginated at 24 to 48 photos; thumbnails at 400 px. |
| G24-2 | High | Four albums with no index, no jump links, and the fourth album starts about 25,000 px down at 1440. | `screenshots/1440-full.png` | | Album cards at the top; anchors. |
| G24-3 | High | 640 images with `alt=""` and no captions. | content.txt | | Captions per album at minimum. |
| G24-4 | Medium | The timed popup fired while the page was still loading and trapped keyboard focus; the crawler's focus walk shows Close, Close, Close for 80 stops. | `inventory-1440.json` `focus` | On slow pages the popup lands after the visitor has started, and a keyboard user is stuck in it. | Remove the popup (L3). |
| G24-5 | Medium | One image has no alt attribute at all (axe `image-alt`, critical). | axe 1440 | | |
| G24-6 | Low | Fonts: 56 font file requests, 2.2 MB, because each album section reloads the icon and display fonts. | requests `types` | | One font set. |

Site-wide: L2, L3, L4, L5, L6, L8, L11, L12, L13.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `aria-dialog-name` (popup), `color-contrast` x3, `image-alt` (critical), `meta-viewport-large`, `region` x23 |
| axe 375 | similar |
| Keyboard | focus trapped by the popup during the walk |

## Everything the page does (parity list)

Four albums: Achievement Week Banquet, Letters and Sweaters, Linen & Spring Dress, BlackOWT; 640 photos; lightbox.

## For the repo mock

Not present (the mock has no 2024 photos). Carry the four albums as separate paginated albums under 2024 in the Gallery index.
