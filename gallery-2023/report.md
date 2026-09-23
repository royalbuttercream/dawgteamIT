# Gallery 2023: review

URL: https://www.lambdaxi1911.com/2023
Captures: `screenshots/`, `source/`

## What the page contains

Four albums: `h1` "Achievement Week", `h2` "Vibes", `h2` "BlackOWT MasQUErade", `h2` "DHL New Year's Eve Party". 345 thumbnails, all `alt=""`, no captions. An empty `h4` between albums.

## Measurements

| | 375 | 768 | 1440 |
|---|---|---|---|
| Page height | 45,745 px | 93,245 px | 13,437 px |
| Requests | 719 | | 772 |
| Bytes | 13.0 MB | | 15.2 MB |
| Time to settle | 20 s | 35 s | 22 s |

At 768 the page is 93,245 px tall: the two-column layout stacks 345 portrait thumbnails at full column width.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| See Achievement Week 2023 | 2 | 0 | First album. |
| See the New Year's Eve photos on a tablet | 2, then scroll 90,000 px | 0 | No jump links. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| G23-1 | Critical | 15 MB, 772 requests; at 768 px the page is 93,245 px tall and takes 35 s to settle. | `inventory-768.json` `viewport.docH`, `settleMs` | Unusable on tablets; heavy everywhere. | Paginate per album; fixed-aspect thumbnails. |
| G23-2 | High | 345 images without alt or caption; one with no alt attribute. | content.txt; axe `image-alt` | | Captions. |
| G23-3 | Medium | Empty `h4` in the flow; heading order `h1`, `h2`, `h4`. | axe `empty-heading`, `heading-order` | | Remove. |
| G23-4 | Medium | Popup fired mid-load and captured focus during the walk. | `inventory-1440.json` `focus` | | L3. |

Site-wide: L2, L3, L4, L5, L6, L8, L11, L12, L13.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `aria-dialog-name`, `color-contrast` x3, `empty-heading`, `heading-order`, `image-alt`, `meta-viewport-large`, `region` x20 |

## Everything the page does (parity list)

Four albums: Achievement Week, Vibes, BlackOWT MasQUErade, DHL New Year's Eve Party; 345 photos; lightbox.

## For the repo mock

The mock's 2023 set is eight photos from two events (MLK Day of Service, Boat Ride) that are not in the live 2023 albums; the live 2023 albums are not in the mock. Reconcile with the chapter which photos are the 2023 record, then carry all four live albums.
