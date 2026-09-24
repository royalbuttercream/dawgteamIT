# Leadership and Lineage mocks

Four standalone pages: this index plus Executive Officers, Past Basilei and Lineage. Each folder holds its own `tokens.css`, `mock.css` and `mock.js`; merged copies with working links are in `merged/`.

| Page | File | Replaces on the live site |
|---|---|---|
| Leadership and Lineage index | `leadership/mock/leadership-mock.html` | no equivalent; the live "Our Legacy" dropdown had no overview |
| Executive Officers | `executive-officers/mock/executive-officers-mock.html` | `/executive-officers` |
| Past Basilei | `past-basilei/mock/past-basilei-mock.html` | `/past-basilei` |
| Lineage | `lineage/mock/lineage-mock.html` | `/lineage` |

Past Basilei and Lineage are generated from `tooling/mock-src/data/basilei.json` and `lineage.json` by `node tooling/gen-lineage.mjs`; edit the data, not the markup. Then `node tooling/build-mocks.mjs` and `node tooling/verify-mock.mjs <folder>`.

## What is real, what is inferred, what is sample

- Officers: the eight names, offices and photographs are from the live page. The one-line office descriptions behind each "About the office" disclosure are the standard meanings of the fraternity's offices, written for outsiders, and are marked "descriptions to confirm".
- Past Basilei: all 31 recorded years from the live page. The live page prints the 21 blank years as "1979 –"; this page lists recorded years only and states each decade's gap once, marked "gap in source".
- Lineage: 29 lines and 119 brothers transcribed from the live accordions, with the omega marker for brothers who have entered Omega Chapter (8) carried over and given visually hidden text. The live site has no 1990s block; at the operator's request the data file carries an empty 1990s decade that renders as "data pending" and will fill in when the chapter supplies the names. Two source spellings are kept as published. The live Lineage spells the Fall 2024 Keeper of Finance "Shepherd" while Officers spells it "Shepard"; the chapter confirmed it is the same brother, so "Shepard" is used on both mock pages.
- The inaugural 1977 council on the index is from the History page.

## Step counts

| Task | Live | Repo mock | These mocks |
|---|---|---|---|
| Find who is Basileus | 1 (Officers page) | 1 | 0 on the index, 1 on Officers |
| Find what "Keeper of Peace" means | not possible | not possible | 1 (disclosure) |
| Find who led in 2019 | scan 50 lines, 21 of them blank | scan 31 rows | 1 (2010s jump) then a 10-row table |
| Find who crossed Fall 1984 | 2 (open 1980s accordion), then scan about 50 run-together names | not possible: the repo mock has no line data | 1 (1980s jump) then a labelled card of 9 names |
| Find your own line brother by name | open up to 5 accordions | not possible | browser find-in-page works: every name is a list item |
| Know what the omega marker means | not possible | not possible | legend at the top; text alternative on each marked name |
| Reach these pages by keyboard | not possible (dropdown parents not focusable) | not possible | Tab, Enter, arrow |

## Everything the live pages did, and where it is here

| Live capability | Here |
|---|---|
| Eight officer cards (photo, office, name) | Same, with office descriptions |
| Year and name list 1977 to 2026 | Tables by decade with row headers |
| Five decade accordions with semester lists | Decade sections with semester cards and jump links |
| Omega marker | Kept, with a legend and visually hidden text |
| Notable chapter brothers | Kept, with both of Freddie Thompson, IV's distinctions |

## Verification

`verify.json` in each folder. All four pages: axe-core zero violations at 320, 375, 768, 1280 and 1440 in light and dark; no overflow; visible focus on every stop; dropdowns keyboard-operable; theme persists and follows the OS. Two defects were caught and fixed by the checks before review: a link inside the purple page head used the light theme's dark link colour (1.3:1), and semester headings skipped from h2 to h4.

Review gate: frontend-reviewer result recorded below when complete.

### frontend-reviewer result, 23 September 2026

One CRITICAL finding (the 1990s gap section rendered after the 2020s and was missing from the decade jump list) had been fixed in the generator minutes before the report landed; the built page now reads 1970s, 1980s, 1990s, 2000s, 2010s, 2020s with all six in the jump list. Remaining findings and actions:

| Finding | Action |
|---|---|
| Per-name omega glyph not hidden from assistive tech, so it was announced twice | `aria-hidden="true"` on the glyph; the visually hidden text remains |
| `.person h3` rule matched nothing after names became `h2.h3` | Selector changed to `.person .h3` |
| Officer portraits below the fold not lazy-loaded | First two eager, the other six lazy |
| Avatar size was a bare 160 px | Token `--avatar: 10rem` |
| Confirm the portrait files are compressed | The eight files exist in `images/executive-officers/`; resized in place from 600 x 600 (730 KB total) to 400 x 400 (349 KB total). The repo's `.dc.html` officer page uses the same files at 96 px, so it benefits too. |

Re-verified after the fixes: all four pages and home pass axe, overflow, focus, dropdown and theme checks at five widths in both themes.

## Notes moved off the pages, 24 September 2026

- Officers: the one-line office descriptions are standard meanings written for visitors; the chapter should confirm the wording.
- Past Basilei: the live page prints every year from 1977 to 2026 and leaves 21 blank; the page lists recorded years and states each decade's gap once. 2021 is recorded as "Percy Jones / Rodney Brown".
- Lineage: two source spellings kept as published, "Henry l. Simmons" and "SirSedrick C. Kendrick". The 1990s block shows "No lines are recorded for this decade yet" until the chapter supplies names.
- Index: the 1977 council names are from the History page.

## Menu change, 24 September 2026

The Our Legacy menu no longer lists this index page; it lists Executive Officers, Past Basilei and Lineage directly, with links to the national history and the 13th District. The index page is still built and reachable by URL.

## Officers page change, 24 September 2026

At the operator's direction the Executive Officers page is the eight cards only: photograph, name and office. The introduction, the "About the office" disclosures and the "Reach the officers" block were removed.
