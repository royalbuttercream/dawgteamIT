# YLC Registration: review

URL: https://www.lambdaxi1911.com/ylc-registration
Reached from: the "Register Now" button, the popup on every page, and the poster's QR code.
Captures: `screenshots/`, `source/`

## Who comes here and why

A parent or student registering for the 17 October 2026 conference.

## What the page contains

`h1` "Register for the 2026 YLC" and an embedded Google Form (`1FAIpQLSeLFC...`, public), 640 px wide and 4,828 px tall. The form's first page asks for an email address and says "Register for the 2026 Youth Leadership Conference on Saturday, 17 October 2026, at the Humphreys Middle School." It is a multi-page form (Next button).

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Register | 1 (close popup) then the form's pages | 0 | Works. The page does not say how many pages or what is asked. |
| Check the details before committing | 1 | 0 | Date and venue are in the form's description; nothing else (time, cost, capacity) is repeated here. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| YR1 | High | The frame has no `title`; the page has no text; at 375 the frame is 330 px wide inside a 375 px viewport with the Google Forms chrome, so fields are cramped and the form is 4,828 px tall. | axe `frame-title` at 375; `inventory-375.json` `iframes` | | `title="Youth Leadership Conference registration"`; a summary block above; or link out to the form full-screen on phones. |
| YR2 | Medium | Late mounting: first capture at 1440 was a 900 px page with only the heading. | `tooling/digest-2.txt` (first pass, `docH` 900) vs `source/inventory-1440.json` (re-capture, 5,310 px) | | Server-render or link. |
| YR3 | Medium | The popup that advertises this page also fires on this page. | `inventory-375.json` `popup` | | Suppress on target. |
| YR4 | Low | Empty meta description. | inventory | | Add. |

Site-wide: L2, L3, L4, L5, L6, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x1, `landmark-one-main`, `meta-viewport-large`, `region` x15 |
| axe 375 | `color-contrast` x4, `frame-title`, `list`, plus the above |
| Keyboard | at 375 the frame and its hCaptcha frames add 7 iframe stops |

## Everything the page does (parity list)

Heading; embedded public Google Form. Consolidation C2 folds this into the YLC event block.

## For the repo mock

Not present. In the rebuild, embed or link the same Google Form from the YLC event block with a summary (date, time, venue, audience, capacity, what the form asks) above it, and keep this URL as a redirect for the QR code.
