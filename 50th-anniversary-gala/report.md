# 50th Anniversary: review

URL: https://www.lambdaxi1911.com/50th-anniversary-gala
Captures: `screenshots/`, `source/`

## Who comes here and why

Alumni brothers planning travel to Korea, current members, sponsors and donors. They want dates, location, programme, how to attend and how to give.

## What the page contains

A dark page with one poster (1200 x 1692, 226 KB, `alt=""`): "Lambda Xi Chapter 50th Anniversary, 30 April to 2 May 2027, Republic of Korea"; a "Donate to support the cause" band with a PayPal QR code. No text, no link, no form.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find the dates | 1 (close popup), read poster | 0 | Handwriting-style font in the image; at 375 it is about 9 px. |
| Donate | scan the QR code with another device | 1 | On a phone you cannot scan your own screen; there is no link. |
| Register interest or buy a ticket | not possible | 1 | No form, no contact, no "details to follow" note. |
| Find where in Korea | not possible | 0 | "Republic of Korea" only. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| GA1 | High | The donation route is a QR code inside an image; there is no PayPal link. | poster; `source/content.txt` (no links) | Mobile visitors, the majority for a gala page shared on social media, cannot donate. | A "Donate" button with the PayPal URL, plus the QR for print. |
| GA2 | High | No `h1`, no text, dates only as pixels; no `<time>`, no venue, no programme, no RSVP. | inventory `headings`; content.txt | An alumnus booking flights seven months out needs text he can search, copy and calendar. | Text block: dates, city and venue when known, programme outline, hotel block, RSVP or interest form, donation, contact. |
| GA3 | High | Nav links 1.52:1 on the dark background. | axe `color-contrast` x8 | | Header background. |
| GA4 | Medium | The nav item is "50th Anniversary Gala"; the poster says "50th Anniversary" across three days, which reads as a weekend of events, not one gala. | nav.json; poster | | Name the page "50th Anniversary Weekend" with the gala as one item. |
| GA5 | Low | Page title "50th Anniversary" without the chapter name. | inventory `title` | | Title pattern. |

Site-wide: L2, L3, L4, L5, L6, L7, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x8, `landmark-one-main`, `meta-viewport-large`, `region` x14 |
| axe 375 | `color-contrast` x3, `list`, plus the above |
| Keyboard | 6 stops |
| Headings | hidden h1 and h2 only |

## Everything the page does (parity list)

Poster with dates; donation QR (PayPal). Parity for the rebuild: dates, donation link, and whatever RSVP the chapter wants.

## For the repo mock

`50th-anniversary-gala.dc.html` says "Date: TBA" and offers an RSVP form that stores to `localStorage`. Replace "TBA" with 30 April to 2 May 2027 (confirm with the chapter), add the donation link, make the RSVP real (Google Form or a form service) with a review step, and add the programme outline as it becomes known. Keep the poster as illustration with alt text.
