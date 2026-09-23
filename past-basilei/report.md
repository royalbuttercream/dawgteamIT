# Past Basilei: review

URL: https://www.lambdaxi1911.com/past-basilei
Captures: `screenshots/`, `source/`

## Who comes here and why

Brothers checking a year, families of past leaders, and anyone preparing anniversary material. They want "who led in year X" and "when did brother Y lead".

## What the page contains

`h2` "Past Basilei" (there is no visible `h1`); one left-aligned text block listing every year 1977 to 2026, 50 lines, of which 31 carry a name and 21 read "1979 –", "1980 –" and so on. Page title is "Korea Bruhz".

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find who led in 2019 | 1 (close popup), then scan 43 lines | 0 | No search, no decade grouping. |
| Find when Rodney Brown led | scan 50 lines | 0 | Three separate entries (2019, 2021, 2024). |
| Go to the current officers | 2 (hover Our Legacy, Executive Officers) | 0 mouse, blocked keyboard | No link between the two pages. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| PB1 | Medium | 21 empty years are printed as "1979 –". | `source/content.txt` | Reads as missing data or an error; doubles the scan length. | Omit empty years, or group by decade and note "records incomplete for 1979 to 1982" once. |
| PB2 | Medium | The list is a single text block, not a list or table. | `inventory-1440.json` `headings`, DOM | No structure for screen readers; no way to sort or filter. | `<table>` with year and name, or a `dl`. |
| PB3 | Medium | No `h1`; the page title is "Korea Bruhz". | inventory `title`, `headings` | Tab title, history and search results do not name the page. | `h1` "Past Basilei", title "Past Basilei | Lambda Xi Chapter". |
| PB4 | Low | The block is left-aligned under a centred heading with 700 px of empty space to the right at 1440. | `screenshots/1440-full.png` | | Two or three columns by decade. |
| PB5 | Low | No link to Executive Officers or Lineage. | inventory `links` | | "See also" block. |

Site-wide: L2, L3, L4, L5, L6, L8, L9, L11, L12, L16.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x1, `landmark-one-main`, `meta-viewport-large`, `region` x15 |
| axe 375 | `color-contrast` x4, `list`, plus the above |
| Keyboard | 6 stops |
| Headings | hidden h1, hidden h2, h2 |

## Everything the page does (parity list)

Year and name list 1977 to 2026 (31 named entries; 2021 lists two names, "Percy Jones/Rodney Brown").

## For the repo mock

`past-basilei.dc.html` already omits the empty years and renders year and name rows in a card, which is the right call. Change the rows to a real table or list, add a decade filter that the merged Leadership and Lineage page can share with the line data, and add the note about incomplete early records. Correct the page title pattern.
