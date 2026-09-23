# Essay Contest Registration: review

URL: https://www.lambdaxi1911.com/essay-contest-registration
Reached from: the "Application" button on Achievement Week and the flyer's QR code.
Captures: `screenshots/`, `source/`

## Who comes here and why

A student (or parent) who has read the flyer and wants to enter the essay contest. One task: register.

## What the page contains

`h1` "2026 Achievement Week Essay Contest" and an embedded Google Form (`docs.google.com/forms/d/e/1FAIpQLSdxXzX...`), 640 px wide and 3,769 px tall inside the page. Nothing else: no summary of the contest, no deadline, no fallback contact.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Register | 1 (close popup), then the form | blocked | The embedded form returns HTTP 401 and a Google sign-in prompt (confirmed with a direct request; `source/requests-1440.json`). |
| Find another way to enter | not possible from this page | 1 | The email address is on the flyer image one page back. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| ER1 | Critical | The Google Form is restricted; visitors are asked to sign in to Google and most cannot proceed. | `source/requests-1440.json` 401; `screenshots/375-full.png` | The contest cannot be entered online. | Google Forms: turn off the organisation restriction, then test signed out. |
| ER2 | High | The iframe has no `title` (axe `frame-title`), and the page has no text of its own, so a screen reader user lands on a heading and an unnamed frame. | axe 375; `source/content.txt` | | `title="Essay contest registration form"`, plus a paragraph with the deadline and a fallback email. |
| ER3 | Medium | The form is 3,769 px tall in a 640 px column; the page gives no indication of length or of the fields required (name, school, parent consent) before the visitor starts. | `inventory-375.json` `iframes` | | List the required items and a time estimate above the form. |
| ER4 | Medium | The frame mounts late and only once scrolled into view; the first capture at 1440 was a 900 px page with a heading and nothing else. | `tooling/digest-2.txt` (first pass, `docH` 900, no iframes) vs `source/inventory-1440.json` (re-capture) | A fast visitor sees an empty page. | Server-render the embed or link to the form directly. |
| ER5 | Low | Empty meta description; title pattern "Essay Contest Registration - The RoK Hard Ques" is fine. | inventory | | Add a description. |

Site-wide: L2, L3, L4, L5, L6, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x1, `landmark-one-main`, `meta-viewport-large`, `region` x15 |
| axe 375 | `color-contrast` x4, `frame-title` (serious), `list`, plus the above |
| Keyboard | at 375, 33 stops including the iframe |

## Everything the page does (parity list)

Heading; embedded registration form. Consolidation C2 folds this into the Achievement Week event block.

## For the repo mock

The mock has no equivalent. In the rebuild, place the registration link or embed on the Achievement Week event block, state the deadline and required items beside it, and keep the `/essay-contest-registration` URL as a redirect because it is printed on the flyer's QR code.
