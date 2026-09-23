# Youth Leadership Conference: review

URL: https://www.lambdaxi1911.com/youth-leadership-conference
Captures: `screenshots/`, `source/`

## Who comes here and why

Parents and students in grades 9 to 12 near Camp Humphreys, teachers, and the partner sorority chapter. They want date, place, who may attend, cost, and how to register.

## What the page contains

A purple page with one poster image (682 x 1024, `alt=""`) and a gold "Register Now" button to /ylc-registration (new tab). The poster reads: Lambda Xi Chapter and the RoK Alumnae Chapter of Delta Sigma Theta Sorority present the 2026 Youth Leadership Conference; tracks (leadership development, teamwork and collaboration, community service, goal setting and success, financial literacy); Saturday 17 October 2026, 11:00 AM; Humphreys Middle School; grades 9 to 12; registration free, limited to the first 60 students; QR code; for more info Clint Carmichael, 010-3057-1911, clint.carmichael818@gmail.com.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find date and place | 1 (close popup), then read the poster | 0 | Legible at 1440; at 375 the poster is 327 px wide and the details line is about 7 px tall. |
| Register | 1 (Register Now) then the Google Form (public, works) | 0 | New tab, unannounced. |
| Ask a question | copy a phone number out of the image | 1 | No text contact. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| YL1 | High | The page has no `h1`, no text, and one image with empty alt; every fact is pixels. | `source/content.txt` (one link); inventory `headings` (only the hidden site headings) | Unsearchable, unreadable on phones and by screen readers; no `<time>`, no map link. | Text block: title, partner, date and time, venue with map link, audience, cost and capacity, tracks, register button, contact; poster as illustration. |
| YL2 | High | Nav links are dark grey (#2f3c4d) on the purple page background (#370b6c): 1.31:1. | axe `color-contrast` x3 at 1440; `screenshots/1440-fold.png` | The menu is invisible on this page. | Header with its own background on every page. |
| YL3 | Medium | Personal mobile number and Gmail address of an officer published in the poster. | poster text | Privacy and continuity when the office changes hands. | Role address (ylc@ or programs@) and a chapter number. |
| YL4 | Medium | "Register Now" is white on gold 2.07:1 and opens a new tab. | axe; inventory `links` | | L5, L11. |
| YL5 | Low | The popup on every page also promotes this event, so a visitor who is already here is interrupted by an advert for the page they are on. | `screenshots/375-popup.png` | | Suppress the popup on its own target page, or remove it. |

Site-wide: L2, L3, L4, L5, L6, L7, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x3, `landmark-one-main`, `meta-viewport-large`, `region` x15 |
| axe 375 | `color-contrast` x4, `list`, plus the above |
| Keyboard | 7 stops |
| Headings | hidden h1 and h2 only |

## Everything the page does (parity list)

Poster; register link. The poster content transcribed above is the parity requirement.

## For the repo mock

Not present in the mock. Add to the Events page as a full text event block with the register link (the Google Form is public and can stay), the map link for Humphreys Middle School, and the capacity note. Keep `/youth-leadership-conference` and `/ylc-registration` as redirects for the printed QR code.
