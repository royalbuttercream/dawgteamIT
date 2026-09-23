# Home: review

URL: https://www.lambdaxi1911.com/ (also /home)
Captures: `screenshots/{375,768,1440}-{fold,full}.png`, `375-popup.png`, `375-menu-open.png`, `375-menu-dropdown-open.png`, `1440-submenu-hover.png`; `source/` (raw.html, dom.html, requests-*.json, axe-*.json, inventory-*.json, content.txt, nav.json)

## Who comes here and why

Prospective members and their families, students and parents looking for the scholarships or the youth conference, brothers visiting Korea, and the press. They need to learn who the chapter is and where it is, what is coming up, and how to reach it.

## What the page contains

1. Header: crest, wordmark "The RoK Hard Ques", nav (Home, Our Legacy, Programs, Upcoming Events, Gallery, News, Members, Contact Us), purple "Seeking" pill to msp.oppf.org.
2. Hero: night photograph of Seoul, black script wordmark and Greek letters overlaid, `h1` "FRIENDSHIP IS ESSENTIAL TO THE SOUL".
3. "Message from the Basileus": six paragraphs, signed Bro. Eugene Gibbs, portrait in a gold crest ring.
4. "Annual Souvenir Journal": Issuu embed of a 23-page flipbook.
5. Footer: copyright, four social icons (mobile), and the mobile bottom bar (Home, Contact Us, Find Us).
6. Overlays on every load: timed promo popup for the Youth Leadership Conference, cookie banner.

## Task flows on the live page

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Learn who the chapter is | 1 (close popup) | 0 | Paragraph three of the message says it: active duty service members and civilians across the Korean Peninsula. Nothing above the fold says it. |
| Find the next event | 3 on desktop (close popup, hover Upcoming Events, choose); 2 on mobile (popup "Register Now!") | 1 | The popup only promotes one event. No event or date appears on the page itself. |
| Contact the chapter | 2 (close popup, Contact Us) | 0 | Then a six-field form with captcha. No email or phone on the page. |
| Find the chapter on a map | mobile: 2 (Find Us in bottom bar); desktop: not possible | 1 | |
| Read the souvenir journal | 1 (close popup) then scroll | 0 | 6.8 MB embed; the first page image alone is 650 KB. |
| Join | 1 (Seeking) | 0 | Label is jargon; opens a new tab with no warning. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| H1 | High | Home never says what, where or when. No event, date, deadline, address or email appears on the page. | `source/content.txt`: hero heading, message, journal heading; nothing else. | Every primary visitor task starts with a menu hunt. | Above the fold: one sentence ("The Lambda Xi Chapter of Omega Psi Phi Fraternity, Inc., serving the Korean Peninsula since 1977"), then a "Coming up" strip with the next three events and dates, the scholarship window, and a contact line. |
| H2 | High | The Issuu embed costs 6.8 MB and 60 requests, is an unnamed frame (axe `frame-title`), and puts 11 focusable iframes into the tab order with no visible focus. | `source/requests-1440.json` (svg.issuu.com 5.5 MB, e.issuu.com 1.3 MB); `inventory-1440.json` `focus`. | Slowest element on the site; a keyboard user tabs through eleven blank stops. | Cover image plus "Read the 2025 journal (PDF, 23 pages)" link; reader on click only. |
| H3 | High | Hero text is unreadable: black script "Home of the RoK Hard Ques" and black Greek letters over a dark photo; nav links sit on the image with no scrim. | `screenshots/1440-fold.png` | The brand line and the menu both lose legibility on the first screen. | Solid header bar; hero overlay with a dark scrim behind light text; drop the script watermark or render it as text with real contrast. |
| H4 | Medium | Promo popup on load, no accessible name, returns on every page (L3). | `screenshots/375-popup.png`, `inventory-375.json` `popup` | | Inline dismissible banner, remembered. |
| H5 | Medium | Two `h1`s plus a hidden `h2` before the visible heading; no landmarks; no `main`. | `inventory-1440.json` `headings`, axe `landmark-one-main`, `region` x17 | | One `h1`, landmarks (L6). |
| H6 | Medium | Wordmark #ffa64d on white 1.94:1; cookie "Accept all" 2.07:1; "Accept" button 34 x 12 px at 1440. | axe `color-contrast`; `inventory-1440.json` `tapTargets` | | L5, L8. |
| H7 | Medium | Google Maps JavaScript (90 KB plus 75 KB tiles) loads on home for a map nobody sees; Facebook connect and New Relic load before consent. | `source/requests-1440.json` | Weight and privacy. | Load the map only on Contact, and only after consent or on click. |
| H8 | Low | Portrait of the Basileus is a 1200 x 1200 PNG (258 KB) shown at 573 px; hero background is loaded blurred and full size. | `inventory-1440.json` `images`, `bgImages` | | Sized JPEG with `srcset`. |
| H9 | Low | The message is a single 6-paragraph column at 1440 with no subheadings; on mobile the portrait comes after the text rather than beside the signature. | `screenshots/375-full.png` | Long unbroken read. | Two-column at 1440 as now, portrait first on mobile, signature block with the photo. |

Site-wide findings that apply: L2, L3, L4, L5, L6, L8, L9, L11, L12, L15, L17, L18.

## Accessibility summary (WCAG 2.2 AA)

| Check | Result |
|---|---|
| axe 1440 | `frame-title` (serious), `landmark-one-main`, `meta-viewport-large`, `region` x17 |
| axe 375 | plus `aria-dialog-name` (serious), `color-contrast` x3, `image-alt` (critical: banner image in the popup), `list` |
| Keyboard, 1440 | 7 stops: Home, News, Contact Us, Seeking, iframe, Accept, Learn More. Five dropdown parents are skipped (L2). |
| Keyboard, 375 | 37 stops including 20 links inside the closed drawer. |
| Headings | h1 (hidden), h2 (hidden), h1, h2, h2 |
| Overflow | none at any width |
| Motion | none beyond the popup animation |

## Everything the page does (parity list for Phase B)

Header with crest and wordmark; eight-item nav with five dropdowns; Seeking pill; hero with headline; Basileus message with portrait and signature; souvenir journal viewer; social links; copyright; mobile drawer with expandable groups; mobile bottom bar with map popup; cookie banner; promo popup with a link to YLC registration.

## For the repo mock

The mock's home (`Lambda Xi Homepage.dc.html`) already has a hero with a legible headline, the message, stats, one event card, a gallery and a footer. Against the live page it should: use the full six-paragraph message; show all four events with dates in the events grid (not one card reading "Date TBA"); replace the 3.3 MB autoplay video with a poster image or a paused, muted clip with a control; make the subscribe form real or remove it; add the social links and a contact line to the footer; keep the journal and newsletters reachable from home as links, not embeds. Detail in `mock-recommendations.md`.
