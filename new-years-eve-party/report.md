# New Year's Eve Party: review

URL: https://www.lambdaxi1911.com/new-year-s-eve-party
Reached from: nowhere. The page is not in the menu, the footer or any in-content link; it was found in the site configuration inlined into every page (`$S.nav` lists 30 pages). It is public. Eight other unlisted pages (`/history-of-omega-psi-phi`, `/dues`, `/meeting`, `/initiatives`, `/blackowt`, `/talent-hunt`, `/document`, `/prom-sponsorship`) are marked members-only in that configuration and show the Strikingly "Register" page to visitors; they are the intended targets of the empty "Members" menu and are out of scope for a no-login audit.
Captures: `screenshots/`, `source/`

## Who comes here and why

Whoever is handed the link: brothers, families and guests at Camp Humphreys and Yongsan planning New Year's Eve at Dragon Hill Lodge. They want date, time, place, price, tickets, and what is on for children.

## What the page contains

Two poster images side by side, both `alt=""`, and nothing else: no heading, no text, no link.

Poster one: Omega Psi Phi Fraternity, Inc.; "2026 New Year's Eve Party at Dragon Hill Lodge"; Wednesday 31 December, 10:00 PM; DJs, multiple dance floors, bars, finger food, midnight balloon drop; "Contact your Omega group representative for more info on the event and special ticket pricing"; three photographs from the 2025 party.

Poster two, "Schedule": 8 PM to 10 PM Children's Party at Naija Ballroom, music, games, a buffet line for children, a balloon-drop countdown at 9:45 PM, for children 5 to 12 accompanied by an adult; 10 PM to 2 AM New Year's Eve Adults Party in the hotel lobby and at Bentley's, music, food, the balloon drop at midnight; 12 AM to 1 AM midnight breakfast buffet at Greenstreet, "Kick off 2026"; must be 18 or older to attend, 21 or older to drink.

The page's meta description reads "Information about Dragon Hill Lodge's Annual New Year's Eve party hosted by Lambda Xi", which is the only text on the page.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find the page | not possible from the site | 1 | Unlinked. |
| Find date, time and place | 1 (close popup), read poster | 0 | Poster one says 10 PM; poster two starts at 8 PM with the children's party. |
| Buy a ticket or find the price | not possible online | 1 | "Contact your Omega group representative": no name, number, email or link. |
| Read the schedule on a phone | read a 1,171 px poster at 327 px wide | 0 | The age lines are about 5 px tall. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| NY1 | High | Orphan page: no route to it, no `h1`, no text, two posters with empty alt. | `source/content.txt`; `inventory-1440.json` `headings`, `images` | It exists for people who receive the link and cannot be found or read by anyone else. | Fold into the Events page as an annual event with a text block; keep the URL as a redirect. |
| NY2 | High | Two posters disagree on the start time (10 PM on the headline poster, 8 PM children's party on the schedule). | posters | Families arrive at the wrong time. | One text schedule with both blocks. |
| NY3 | High | Ticketing depends on knowing an "Omega group representative"; nothing on the site says who that is. | poster one | Guests outside the fraternity cannot buy tickets. | Contact route on the page (contact form topic, or a ticket link when one exists). |
| NY4 | Medium | The event has passed (31 December 2025) and the page stays as is with no note, while "2026" in the title reads as the coming year. | poster; audit date 23 September 2026 | Confusing for a page that may be shared again in December. | Date the event fully (31 December 2025) and mark it held; add the next one when announced. |
| NY5 | Medium | Nav links over the dark page background 1.5:1; page title lacks the chapter name; description lives only in metadata. | axe `color-contrast` x4 | | Header background; title pattern; put the description on the page. |
| NY6 | Low | 7.5 MB page for two posters, because of the usual script and third-party load. | `source/requests-1440.json` | | L4. |

Site-wide: L2, L3, L4, L5, L6, L7, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `aria-dialog-name` (popup), `color-contrast` x4, `image-alt` (critical), `meta-viewport-large`, `region` x15 |
| Keyboard | header links only |
| Headings | hidden h1 and h2 only |

## Everything the page does (parity list)

Two posters. The transcription above is the parity requirement.

## For the repo mock

Not present in the repo mock. Added to the Events set as a subpage (`new-years-eve-party/mock/`), dated 31 December 2025 and marked held, with the schedule as text, the age rules, the venue, and a contact route in place of the unnamed representative.
