# Gallery 2025: review

URL: https://www.lambdaxi1911.com/2025
Captures: `screenshots/` (including `1440-lightbox.png`), `source/`

## Who comes here and why

Brothers, families and performers looking for photos of a specific event; the chapter's own social media team. They want to find an album, view a photo large, and share or save it.

## What the page contains

`h1` "Talent Hunt"; one grid of 70 thumbnails (363 x 205 px background images, no alt text, no captions); each opens a Fancybox lightbox with previous, next, zoom, close and a dot pager.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| See the Talent Hunt photos | 2 (close popup, hover Gallery, 2025) | 0 | 6.0 MB, 225 requests. |
| View one photo large | 1 (click) | 0 | Lightbox works; the image loads after a spinner. |
| Find a photo of a specific performer | scan 70 identical-size thumbnails | 0 | No captions, no alt. |
| Share or download a photo | not offered | 1 | Lightbox has zoom and a dot pager only. |
| Find the 2025 Achievement Week photos | not possible | 1 | 2025 holds one album; the current year's other events are absent. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| G25-1 | High | 70 images, none with alt text or captions; the lightbox announces nothing. | `source/content.txt` (70 `img: alt=""`); `inventory-1440.json` `images` | Screen reader users get "image, image, image"; nobody can search for a person or moment. | Caption per photo or at least per album; alt from the caption. |
| G25-2 | Medium | The year page carries one event; Talent Hunt is not linked from Mandated Programs or Events. | content.txt | The programme description on Mandated Programs never says the chapter runs it. | Album index with cross-links (C4). |
| G25-3 | Medium | Thumbnails are background images inside links whose accessible name is "Thumbnail Gallery" repeated 35 times. | `inventory-1440.json` `focus` | 35 identical link names. | Name each link by its caption. |
| G25-4 | Medium | Nav links 1.67:1 on this page's dark background. | axe `color-contrast` x6 | | Header background. |
| G25-5 | Low | Each thumbnail is a 760 x 960 rendition (up to 319 KB) shown at 363 x 205. | requests | About 2 MB of thumbnails that could be 400 KB. | 400 px wide thumbnails. |

Site-wide: L2, L3, L4, L5, L6, L8, L9, L11, L12, L13.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x6, `landmark-one-main`, `meta-viewport-large`, `region` x50 |
| axe 375 | `color-contrast` x3, `list`, plus the above |
| Keyboard | 41 stops; all gallery links focusable and named "Thumbnail Gallery" |
| Lightbox | `role="dialog"`, `aria-modal="true"`, focus moves inside, Escape closes |

## Everything the page does (parity list)

One album, 70 photos, lightbox with prev/next/zoom/close and pager.

## For the repo mock

The mock's home gallery has six year pills and 10 photos. Replace with a Gallery page whose index lists albums by year (2025: Talent Hunt, 70), each album a paginated captioned grid with a lightbox that keeps the live one's keyboard behaviour.
