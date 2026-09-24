# History of Lambda Xi mock

One standalone page, `history-of-lambda-xi/mock/history-of-lambda-xi-mock.html`, replacing `/history-of-lambda-xi`. Source is `tooling/mock-src/pages/history.html`. Build with `node tooling/build-mocks.mjs`, then verify with `node tooling/verify-mock.mjs history-of-lambda-xi`.

## What is real, what is inferred, what is sample

- Content parity is complete: the charter date, the application and approval dates, the eleven charter members in order, the seven council members, all nine accolades, and the closing paragraph are transcribed from the live page.
- The "Roots at Howard, 1911" introduction was added on 24 September 2026 and removed the same day at the operator's direction; the national history is reached from the Our Legacy menu, which links to oppf.org.
- An earlier draft's cardinal-principles clause was removed. It had no source on the live page.
- The newspaper article is transcribed from the scan, as printed, on 24 September 2026, and opens in a pop-up dialog from a "Read the article" button under the photograph. Its spellings and office list are kept even where they differ from the live page; a few words at the cut right edge are completed from context.

## Step counts

| Task | Live | Repo mock | This mock |
|---|---|---|---|
| Find the charter date | 1 then scan a running paragraph | 1 then scan a running paragraph, missing the approval date | 0, first section |
| Find a charter member | 1 then scan running text | 1 then scan running text | 0, a list beside the council |
| Find an award year | 1 then scan nine run-together lines; a screen reader hears one 300-character heading | 1 then scan a nine-tile badge grid | 1 (jump link) then a 5-row table with year row headers |
| Read the newspaper article | 1 then scroll; the text exists only as a photograph, illegible at 375 px | not present | 1 (button) opens the article text in a dialog; Escape closes it |

## Everything the live page did, and where it is here

| Live capability | Here |
|---|---|
| Founding narrative and charter date | Same text, under "The charter, 1977" |
| Eleven charter members in running text | Same eleven, in order, as a two-column list under "Charter members" |
| Seven-member inaugural council as a list | Same seven, as a definition list under "First council" |
| Closing paragraph | Kept in full |
| Newspaper photograph, alt equivalent to "Section image" | Same photo, a real description, a caption and the full article text |
| Nine accolades as one run-on heading | Table by year with row headers, five rows |
| No links out | None on the page; the header menu carries them |

## Verification

`verify.json`: axe-core reports zero violations at 320, 375, 768, 1280 and 1440 in light and dark; no horizontal overflow at any width; 17 focus stops at 320, 375 and 768, 24 at 1280 and 1440, all with a visible indicator; the header dropdown opens on click, keeps focus inside, and closes on Escape at every width; the theme persists after reload and follows the OS.

Review gate: frontend-reviewer result recorded below.

### frontend-reviewer result, 24 September 2026

| Finding | Action |
|---|---|
| Unapproved founding narrative in the introduction | Trimmed to the founding date and the oppf.org link; an "intro text to approve" badge added |
| Jump link text did not match its heading | Link label aligned to the heading text |
| Inline max-width style on the accolades table | Replaced with the `.table--narrow` class |
| Newspaper article transcript not delivered | Transcribed from the scan by the operator's direction on 24 September 2026 |

## Notes moved off the page, 24 September 2026

Text, names and accolades are from the live History page as captured on 23 September 2026. The 1911 introduction is not on the live page; the operator approved it on 24 September 2026. The article transcript keeps the scan's spellings (Herschel and Herschell; William and Willie Hensley) and its office list, which gives Campbell as Keeper of Finance and Blakely as Dean of Pledgees where the live page lists Blakely as Keeper of Finance; a few words at the cut right edge are completed from context.

## Layout change, 24 September 2026

At the operator's direction: the on-page jump links, the 1911 introduction and the "Continue" links were removed; the charter members and the inaugural council sit side by side above 640 px and stack below it; the article text moved from the page body into a modal dialog opened by a button under the scan. The Our Legacy menu now reads: The History of Omega Psi Phi (oppf.org), The History of Lambda Xi, Executive Officers, Past Basilei, Lineage, 13th District (oppf13th.org). The Leadership and Lineage index page is no longer in the menu.

Later the same day the inaugural Executive Council list was removed from this page at the operator's direction; it stays on the Leadership and Lineage index. The charter members list returned to two columns in the text column.
