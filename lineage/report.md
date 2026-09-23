# Lineage: review

URL: https://www.lambdaxi1911.com/lineage
Captures: `screenshots/`, `source/` (`content.txt` holds the full line data)

## Who comes here and why

Brothers looking up their own line or a line brother, prospective members' families, and reunion organisers. They want "who crossed in Fall 84" and "which semester did brother X cross".

## What the page contains

`h1` "Line History"; five accordion rows labelled 1970s, 1980s, 2000s, 2010s, 2020s (no 1990s); each opens to a list grouped by semester: Fall 77 (3 names), 1980s (Spring 82 to Fall 88, 9 semesters, about 50 names), 2000s (Spring 00 to Spring 09, 5 semesters, 22 names), 2010s (Fall 11 to Spring 19, 8 semesters, about 33 names), 2020s (Spring 21 to Fall 25, 6 semesters, 18 names). Names marked with an omega symbol denote brothers who have entered Omega Chapter. `h2` "Notable Chapter Brothers": Freddie Thompson, IV, Twelfth 13th District Representative and IHQ 2024 to 2025 Brigadier General Charles Young Military Leadership Award recipient. Page title is "Korea Bruhz".

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find who crossed in Fall 84 | 2 (close popup, open 1980s), then scan about 50 names | 0 | Names inside an accordion run together in one paragraph in places ("Fall 83Geoffrey E. PierceBobby D. Thomas"). |
| Find brother X's line | open up to five accordions and scan | 0 | No search. |
| Find a 1990s line | not possible | 1 | No decade; the page does not say whether none exist. |
| Understand the omega symbol | not possible | 0 | No legend. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| LN1 | High | Line data is stored as free text: semester labels and names are concatenated without separators in several blocks ("Spring 16Alexander WilkinsNicholson D. Lawrence"). | `source/content.txt` accordion answers | Screen readers read run-on names; copy and search fail; the repo mock could not carry the data across (it has none). | Structured data: decade, semester, names as a list; one `ul` per semester. |
| LN2 | Medium | Accordion headers are `div role="button"` and the text wraps "1970" and "s" onto two lines because the label column is 60 px wide. | `screenshots/1440-full.png`; `inventory-1440.json` `controls` | Looks broken; button semantics come from ARIA on a div with no `aria-expanded` reported. | Native `button` inside `h2`, or `details`/`summary`; let the label take the row width. |
| LN3 | Medium | No 1990s block, no explanation. Past Basilei has leaders for 1996 to 1999. | content.txt; `../past-basilei/source/content.txt` | Looks like lost data. | Add the decade with "no lines recorded" or the missing names. |
| LN4 | Medium | The omega marker has no legend; the "Notable Chapter Brothers" `h3` merges two facts into one 130-character heading. | content.txt | | Legend line; two list items under one heading. |
| LN5 | Medium | Nav label "Lineage", `h1` "Line History", title "Korea Bruhz". | inventory | Three names for one page. | One label. |
| LN6 | Low | Everything below the accordions is centred typewriter text at 14 to 16 px. | screenshot | Legibility. | Body face for lists. |

Site-wide: L2, L3, L4, L5, L6, L8, L9, L11, L12, L14, L16.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x1, `empty-heading` (an `h4` with no text inside each accordion), `heading-order`, `landmark-one-main`, `meta-viewport-large`, `region` x16 |
| axe 375 | `color-contrast` x4, `list`, plus the above |
| Keyboard | 11 stops; the five accordion buttons are focusable and toggle with Enter (div role=button) |
| Headings | hidden h1, hidden h2, h1, empty h4 x5, h2, h3 |

## Everything the page does (parity list)

Five decade accordions with semester lists (about 130 names); omega marker for deceased brothers; notable brothers section. The full text is in `source/content.txt`.

## For the repo mock

This is the mock's largest content loss: `lineage.dc.html` shows the five decade pills (as non-interactive divs) with no names behind them and one notable brother. Load the semester lists from a data file, render each decade as a `details` group or a filtered list, add the legend and the 1990s note, keep the label "Lineage" everywhere, and merge with Past Basilei and Executive Officers (C1). Add the Charles Young award to the notable brothers entry.
