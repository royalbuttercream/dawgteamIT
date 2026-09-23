# Events mocks

Five standalone pages: this index plus one page per event. Each folder holds its own `tokens.css`, `mock.css` and `mock.js`; the merged copies with working links are in `merged/`.

| Page | File | Replaces on the live site |
|---|---|---|
| Events index | `events/mock/events-mock.html` | the "Upcoming Events" dropdown, which had no index |
| Achievement Week | `achievement-week/mock/achievement-week-mock.html` | `/achievement-week` and `/essay-contest-registration` |
| Youth Leadership Conference | `youth-leadership-conference/mock/youth-leadership-conference-mock.html` | `/youth-leadership-conference` and `/ylc-registration` |
| All Star Game | `all-star-game/mock/all-star-game-mock.html` | `/all-star-game` |
| 50th Anniversary | `50th-anniversary-gala/mock/50th-anniversary-gala-mock.html` | `/50th-anniversary-gala` |

Rebuild: `node tooling/build-mocks.mjs`. Verify: `node tooling/verify-mock.mjs <folder>`.

## What is real, what changed, what is sample

Every date, time, venue, rule, award, price and partner name is transcribed from the four posters on lambdaxi1911.com as captured on 23 September 2026; the posters are reproduced on each page as illustrations with descriptive alt text. Two links were recovered by decoding the QR codes printed on the posters: the PayPal donation page for the 50th Anniversary, and the YLC registration short link (which opens the same Google Form the site embeds).

Marked on the pages:

- "change from poster" on the YLC and All Star pages: the posters print two officers' personal mobile numbers and Gmail addresses; the mocks route questions through the contact page instead.
- "verified 23 Sep 2026" on the Achievement Week page: the essay contest Google Form returns a Google sign-in wall (HTTP 401). The page says so and gives the email route until the form is made public.
- The "Every year" fixture list on the index is inferred from the posters and the mandated programme calendar; the note under it says which dates to confirm.

Registration for the essay contest links to the Google Form rather than embedding it, because an embedded sign-in wall would be a dead end. The YLC form is embedded inside a disclosure with a titled iframe, and also linked.

## Step counts

| Task | Live | Repo mock | These mocks |
|---|---|---|---|
| Find all upcoming events with dates | not possible: no index, dates inside four poster images | 1 card, "Date TBA" | 0 on the index: four upcoming and one recent, dated |
| Read the essay contest rules | open poster image; unreadable at 375 | not present | 0, as a numbered list |
| Register for the essay contest | 2, then a sign-in wall | not present | 1 (link), with the email route stated |
| Register for the YLC | 2 (Register Now, then the form in a new tab) | not present | 1 (button) or 0 (embedded form on the page) |
| Donate to the anniversary | scan a QR code with another device | not present | 1 |
| Get directions to a venue | not possible | not present | 1 (map link on each page) |
| Add an event to a calendar | copy from image | not possible | dates are machine-readable `time` elements; an `.ics` link can be added when the chapter wants it |
| Reach an event page by keyboard | not possible (dropdown parents not focusable) | not possible (dropdowns never open) | Tab, Enter, arrow |

## Everything the live pages did, and where it is here

| Live capability | Here |
|---|---|
| Four event posters | On each page as a figure with alt text and caption |
| "Application" link to the essay registration page | Register button plus the email route |
| "Register Now" link to the YLC form | Register button and embedded form |
| Donation QR code | Donate button (same PayPal page) plus the poster |
| Upcoming Events dropdown | Events dropdown with the index and four pages; index lists upcoming, recent and yearly fixtures |

## Verification

`verify.json` in each folder. All five pages: axe-core zero violations at 375, 768 and 1440 in light and dark; no horizontal overflow (a 17 px overflow on the Achievement Week page at 375 was fixed by stacking the detail list on narrow screens); visible focus on every stop; dropdowns keyboard-operable; theme persists and follows the OS.

Review gate: frontend-reviewer result recorded below when complete.

### frontend-reviewer result, 23 September 2026

The reviewer read the files while the poster crop was in progress and reported two CRITICAL findings about the organiser contact strip still showing on the All Star poster and the source and built dimensions disagreeing. Both posters were cropped from the source files before the final build; the shipped images, the source templates and the merged copies now agree (All Star 707 x 937, YLC 666 x 952) and the contact strips are gone. Remaining findings and actions:

| Finding | Action |
|---|---|
| Breadcrumb list had no landmark or label | Wrapped in `nav aria-label="Breadcrumb"` on all four event pages |
| Sections labelled "Details" also held Register, Schedule, Questions | Section-level labels removed; headings carry the structure |
| Sticky header would cover an anchor target on arrival | `scroll-margin-top` on every element with an id |
| Automated checks did not include 320 and 1280 | `verify-mock.mjs` now runs 320, 375, 768, 1280 and 1440; all six pages pass |
| Posters lazy-loaded although near the fold | Posters load eagerly |
| Repeated inline styles | Replaced with `list-plain` and `stack-top` utilities |
| `prefers-contrast: more` left status colours alone | Status colours map to foreground and background under that setting |
| Poster JPEG sizes | 138 to 288 KB each at about 700 x 1000; acceptable for a one-per-page illustration, recorded here |

Re-verified after the fixes: token pairs pass; all six built pages pass axe, overflow, focus, dropdown and theme checks at five widths in both themes.
