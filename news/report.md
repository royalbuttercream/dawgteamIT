# News: review

URL: https://www.lambdaxi1911.com/news
Captures: `screenshots/`, `source/`

## Who comes here and why

Members and alumni who want the newsletter; partners and district officers checking what the chapter has done; the editor sending people to the latest issue.

## What the page contains

Background photograph of balloons; `h2` "RoK Hard News!" (no `h1`); "Lambda Xi Chapter - Omega Year 2026 Newsletters (November 2025 - October 2026)" with an Issuu embed (`lambda_xi_oy26_newsletters`); "Lambda Xi Chapter - Omega Year 2025 Newsletters (November 2024 - October 2025)" with an Issuu embed (`lambda_xi_rok_hard_news_oy_25`, 51 pages).

## Measurements

14.6 MB and 200 requests at 1440; svg.issuu.com alone is 9.4 MB. Two unnamed iframes; eleven focusable iframes in the tab order with no visible focus.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Read the latest newsletter | 1 (close popup), scroll, page through the flipbook | 0 | Reader controls are Issuu's; the first page renders at 386 px wide inside a 1,129 px frame. |
| Download the PDF | inside the Issuu chrome, if the publisher allows | 1 | No direct link. |
| Find a specific article | none | 1 | No table of contents, no dates per issue, no text. |
| Read on a phone | 1 | 0 | Flipbook at 330 px wide; text is unreadable without zoom inside the frame. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| NW1 | High | 14.6 MB for two embeds; heaviest non-gallery page. | `source/requests-1440.json` | | Cover image and PDF link per issue; reader on demand. |
| NW2 | High | Both iframes lack a `title`; eleven iframe tab stops with no focus indicator. | axe `frame-title` x2 at 375; `inventory-1440.json` `focus` | Keyboard and screen reader users cannot tell what the frames are. | `title="Omega Year 2026 newsletter reader"`. |
| NW3 | Medium | No `h1`; the two newsletter titles are paragraphs, not headings; no issue dates, no article list. | inventory `headings`; content.txt | The page cannot be scanned. | `h1` News, `h2` per issue with date, `h3` per article with a one-line summary. |
| NW4 | Medium | The 2026 newsletter is nested through a Strikingly proxy (`/show_iframe_component/26214466`) inside which the Issuu frame loads, doubling the frame depth. | content.txt; probe | | Direct embed or link. |
| NW5 | Low | White text over a busy balloon photograph; the headings pass only where the photo happens to be dark. | `screenshots/1440-full.png` | | Solid panel behind text. |

Site-wide: L2, L3, L4, L5, L6, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `frame-title`, `landmark-one-main`, `meta-viewport-large`, `region` x16 |
| axe 375 | `color-contrast` x3, `frame-title` x2, `list`, plus the above |
| Keyboard | 17 stops at 1440, 11 of them unnamed iframes without visible focus |

## Everything the page does (parity list)

Two newsletter volumes as embedded readers: Omega Year 2026 (Nov 2025 to Oct 2026) and Omega Year 2025 (Nov 2024 to Oct 2025, 51 pages). The souvenir journal on home belongs with these.

## For the repo mock

`news.dc.html` links both titles to lambdaxi1911.com/news, which will not exist after the migration. Host the PDFs (or link the Issuu documents by ID), show a cover thumbnail and a dated list of issues, add the souvenir journal, and give each issue an article list when the editor can supply one.
