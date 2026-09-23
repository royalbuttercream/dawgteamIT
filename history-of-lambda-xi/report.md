# History of Lambda Xi: review

URL: https://www.lambdaxi1911.com/history-of-lambda-xi
Captures: `screenshots/`, `source/`

## Who comes here and why

Prospective members, visiting brothers, family members at events, and anyone writing about the chapter. They want the founding story, the names, and the record of awards.

## What the page contains

`h1` "Lambda Xi Chapter History"; four paragraphs (charter under Grand Basileus Edward J. Braynon, application via Brother B.T. Garnett on 20 October 1974, approval notified 23 May 1975 by Brother Harold J. Cook, charter on 22 February 1977 at Eighth United States Army Headquarters, Yongsan); the eleven charter members; the seven-member inaugural Executive Council as a list; a closing paragraph; a photograph of the 1977 newspaper page "Omegas Now in Korea! Lambda Xi First Chapter" (672 x 960); `h2` "Accolades" with nine district awards 2015 to 2026.

## Task flows on the live page

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Read the founding story | 1 (close popup) | 0 | Text is complete and specific. |
| Find who chartered the chapter | 1 then scan | 0 | Names are in running text, not a list. |
| Read the newspaper article | 1 then scroll | 0 | The article text exists only as a photograph; unreadable at 375 px (327 px wide). |
| Go on to officers or lineage | 2 (hover Our Legacy, click) | 0 mouse, blocked keyboard (L2) | No in-content links to the sibling pages. |
| Return to the national history | 2 (hover Our Legacy, History of Omega Psi Phi) | 1 | Leaves the site in a new tab. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| HL1 | High | Body text runs the full content width at 1440, about 1,150 px and 180 characters per line, at 16 px Georgia. | `screenshots/1440-full.png` | Hard to track line to line; the single most read page on the site. | 65 to 75 character measure (max-width about 70ch). |
| HL2 | Medium | The newspaper article is an image with `alt="Section image"` equivalent (empty caption, no transcript). | `source/content.txt` (media section is empty); `inventory-1440.json` `images` | The article names the first officers and the charter ceremony; none of it is searchable or readable by screen readers, and the 672 px scan is illegible on phones. | Transcribe the article below the image in a `details` element; give the image a real alt ("1977 newspaper page announcing the Lambda Xi charter"). |
| HL3 | Medium | Accolades are nine centred lines in the typewriter face with no structure; the `h3` concatenates all nine into one heading. | `inventory-1440.json` `headings`: "2026 - 13th District Graduate Chapter of the Year2026 - ..." | Screen readers announce one 300-character heading. | A definition list or table: year, award. |
| HL4 | Medium | Charter members and council are the page's most looked-up facts and are buried in paragraph three. | content.txt | | Two labelled lists with a jump link from the top. |
| HL5 | Low | No links out: to Officers, Past Basilei, Lineage, or the national site. | inventory `links`: header and footer only | Dead end. | "Continue" block at the end. |
| HL6 | Low | Mobile: the text column is fine, but the page is 2,940 px with the popup, cookie banner and bottom bar all present at once. | `screenshots/375-full.png` | | L3, L8. |

Site-wide: L2, L3, L4, L5, L6, L8, L9, L11, L12, L14.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x1 (wordmark), `landmark-one-main`, `meta-viewport-large`, `region` x15 |
| axe 375 | `color-contrast` x4, `list`, plus the above |
| Keyboard | 6 stops at 1440; dropdown parents skipped |
| Headings | hidden h1, hidden h2, h1, h2, h3 (concatenated) |
| Images | newspaper scan 672 x 960 shown at 672 px; crest 282 x 300 at 56 px |

## Everything the page does (parity list)

Header and nav; title; four paragraphs; charter members; inaugural council list; closing paragraph; newspaper photograph; accolades list; footer.

## For the repo mock

`history-of-lambda-xi.dc.html` keeps the text (slightly trimmed), the photo and the accolades as a badge grid. Restore the trimmed sentences (23 May 1975 notification; the full closing paragraph), keep the 70ch measure the mock already has, add the article transcript, render the accolades as a year and award table, and add the "Continue" links. Consider merging the two-paragraph national history from `history-of-omega-psi-phi.dc.html` into an introduction here with the oppf.org link, since the live site has no such page and the mock's text is unsourced.
