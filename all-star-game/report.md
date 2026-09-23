# All Star Game: review

URL: https://www.lambdaxi1911.com/all-star-game
Captures: `screenshots/`, `source/`

## Who comes here and why

Families and service members around Camp Humphreys and Osan, players, and mental-health partners. They want date, time, place, cost and schedule.

## What the page contains

A dark page with one poster (1200 x 1697, 1,054 KB, `alt=""`) and no text. The poster reads: 3rd Annual All Star Basketball Tournament, presented with the Peninsula Basketball League and the Humphreys Hoop Club; Saturday 12 September 2026, 11 AM, Collier Fitness Center; "One court. One community. One message. Mental health matters."; 11 AM Humphreys vs Osan, 1 PM D9 All Stars vs Humphreys Hoops Club; free event, giveaways, halftime entertainment, mental health resources; contacts Randy Artis 010.9747.1927 carolinacowboy1911@gmail.com, Andrew Wesley 010.8216.3229 fwaro247@gmail.com.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find date, time, place | 1 (close popup), read poster | 0 | At 375 the poster is 327 px wide; the schedule lines are about 6 px. |
| Add to calendar or get directions | not possible | 1 | No `<time>`, no map link. |
| Ask a question | copy from image | 1 | |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| AS1 | High | No `h1`, no text, one 1 MB image with empty alt carries everything. | `source/content.txt` (empty section); inventory `images` | L7 in full. | Text event block; poster as illustration at 800 px, about 150 KB. |
| AS2 | High | Nav links #2f3c4d on the page's near-black background (#1c1c1c): 1.52:1. | axe `color-contrast` x8 at 1440 | Menu invisible. | Header background. |
| AS3 | Medium | Two officers' personal mobile numbers and Gmail addresses are published. | poster | | Role contact. |
| AS4 | Medium | The event date (12 September 2026) is in the past relative to the audit date (23 September 2026) yet the page sits under "Upcoming Events" with no result, photos or "see you next year" note. | nav; poster | Stale content under an "upcoming" label. | Events page with upcoming and past sections; link past events to their gallery album. |
| AS5 | Low | Page title "Annual All Star Game" is fine; meta description mentions mental health awareness, which the page text does not, because there is no page text. | inventory | | Text block. |

Site-wide: L2, L3, L4, L5, L6, L7, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x8, `landmark-one-main`, `meta-viewport-large`, `region` x14 |
| axe 375 | `color-contrast` x3, `list`, plus the above |
| Keyboard | 6 stops |
| Headings | hidden h1 and h2 only |

## Everything the page does (parity list)

Poster only. Transcribed content above is the parity requirement.

## For the repo mock

Not present. Add to the Events page as a text block with the schedule table (11 AM, 1 PM), venue map link, partners, free admission and mental-health resources note, and move it to the past-events section after the date, linking to any gallery album.
