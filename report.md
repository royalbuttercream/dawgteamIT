# lambdaxi1911.com: cross-page UX, accessibility and code review

Target: https://www.lambdaxi1911.com/ (Strikingly, "zine" theme)
Purpose: audit the live site page by page, then turn the findings into concrete changes for the new site being built in this repo (`Lambda Xi 1911 optimization/*.dc.html`). Repo-specific recommendations are in `mock-recommendations.md`.
Captured: 2026-09-23, Playwright 1.63 with Chromium 153 (headless shell, plus Google Chrome for one confirmation run), axe-core 4.11, widths 375 / 768 / 1440.
Method: look only. Every request that left the browser was GET, HEAD or OPTIONS; the crawler aborted every POST (analytics beacons, hCaptcha config, Issuu telemetry) before it left. No form was filled or submitted. Interactions were limited to closing the promo popup, opening the mobile drawer, hovering a dropdown, opening one gallery lightbox and pressing Escape.

Per-page reports are in `<slug>/report.md`. Evidence per page is in `<slug>/screenshots/` (fold and full-page captures at each width, popup, open menu, lightbox) and `<slug>/source/` (raw HTML, rendered DOM, request logs, axe results, structural inventories, extracted content, nav structure). The crawler and digests are in `tooling/`.

## 1. Page set

21 public pages in the menu plus one unlisted public page (22 reviewed). The root URL and `/home` are the same page.

| Slug | Path | Nav route | Purpose |
|---|---|---|---|
| home | / | Home | Hero, Basileus message, souvenir journal embed |
| history-of-lambda-xi | /history-of-lambda-xi | Our Legacy | Chapter history, charter members, accolades |
| executive-officers | /executive-officers | Our Legacy | 8 officers with photos |
| past-basilei | /past-basilei | Our Legacy | Year list 1977 to 2026 |
| lineage | /lineage | Our Legacy | Line history by decade (accordion), notable brothers |
| mandated-programs | /mandated-programs | Programs | 12 mandated programs with photos |
| scholarships | /scholarships | Programs | Two scholarships, PDF applications, online application form |
| achievement-week | /achievement-week | Upcoming Events | Essay contest flyer and link |
| essay-contest-registration | /essay-contest-registration | from Achievement Week | Embedded Google Form |
| youth-leadership-conference | /youth-leadership-conference | Upcoming Events | Conference poster and link |
| ylc-registration | /ylc-registration | from YLC page and popup | Embedded Google Form |
| all-star-game | /all-star-game | Upcoming Events | Poster only |
| 50th-anniversary-gala | /50th-anniversary-gala | Upcoming Events | Poster only, donation QR |
| gallery-2025 | /2025 | Gallery | 70 photos, 1 album |
| gallery-2024 | /2024 | Gallery | 640 photos, 4 albums |
| gallery-2023 | /2023 | Gallery | 345 photos, 4 albums |
| gallery-2022 | /2022 | Gallery | 395 photos, 9 albums |
| gallery-2021 | /2021 | Gallery | 146 photos, 3 albums |
| gallery-2017-2020 | /2017-2020 | Gallery | 60 photos, 1 album |
| news | /news | News | Two newsletter embeds (Issuu) |
| contact-us | /contact-us | Contact Us | Contact form |

Found after the first crawl, in the site configuration that Strikingly inlines into every page (`$S.nav`, 30 entries): one more public page, `/new-year-s-eve-party`, linked from nowhere (report in `new-years-eve-party/`), and eight members-only pages (`/history-of-omega-psi-phi`, `/dues`, `/meeting`, `/initiatives`, `/blackowt`, `/talent-hunt`, `/document`, `/prom-sponsorship`) that show the Strikingly "Register" page to visitors. Those eight are the targets of the empty "Members" menu and are outside a no-login audit; the chapter should decide whether their content moves to the rebuild behind its own login or is dropped.

Nav items that leave the site or go nowhere: "History of Omega Psi Phi" goes to oppf.org/about-omega in a new tab; "Seeking" goes to msp.oppf.org in a new tab; "Members" is a dropdown with no link and no children. External destinations are not recreated. Two PDFs (the scholarship applications) and two Google Forms are linked content, recorded in the page reports.

## 2. How the site is built, and what that costs every page

Strikingly serves a single-page React application per URL. The HTML document itself is 700 KB to 1.6 MB because the whole site configuration is inlined, then 95 to 120 script files follow. Measured on the live site:

| Measurement | Value | Evidence |
|---|---|---|
| HTML document | 702 KB (event pages) to 1,580 KB (gallery 2024) | `*/source/inventory-1440.json` `perf.htmlDecoded` |
| Scripts per page | 95 to 120 files, 2.3 to 3.7 MB | `*/source/requests-1440.json` |
| Third-party hosts on every page | static-assets.strikinglycdn.com, cdnjs.cloudflare.com (Font Awesome), static-fonts.strikinglycdn.com, hcaptcha.com, connect.facebook.net, js-agent.newrelic.com, maps.googleapis.com, p.typekit.net | request logs |
| Lightest page | past-basilei, 3.3 MB, 114 requests | |
| Home | 10.9 MB, 188 requests; the Issuu journal embed alone is 6.8 MB of SVG pages and reader JavaScript | `home/source/requests-1440.json` |
| News | 14.6 MB; two Issuu embeds | |
| Gallery 2024 | 24.6 MB, 858 requests, 644 images, page 33,693 px tall at 1440 | `gallery-2024/source/` |
| Gallery 2023 at 768 | 93,245 px tall | `gallery-2023/source/inventory-768.json` |
| Time to settled page | 4.5 to 11 s on a fast connection; 15 to 35 s on the big galleries | `settleMs` |
| Landmarks | none: no `header`, `nav`, `main` or `footer` on any page | axe `region` x601, `landmark-one-main` x39 |
| Duplicate headings | every page carries a visually hidden `h1` and `h2` "The RoK Hard Ques" before its real `h1` | inventories `headings` |

The theme also fires a promotional popup after load on every page, injects a cookie banner, and loads Facebook and New Relic before consent.

None of this is fixable inside Strikingly beyond removing embeds and reducing gallery size. It is the strongest argument for the static rebuild in this repo: the same content as plain HTML, one stylesheet, one small script and sized images would put every page except the galleries under 1 MB and make the content indexable and readable without JavaScript.

## 3. Site-wide findings

IDs L1 to L18 are referenced from the page reports.

### L1 Critical: the Essay Contest registration form is not public

Evidence: `essay-contest-registration` embeds `docs.google.com/forms/d/e/1FAIpQLSdxXzX.../viewform?embedded=true`. The request returns HTTP 401 and a Google sign-in page (`essay-contest-registration/source/requests-1440.json`; confirmed with a direct fetch). The flyer on Achievement Week says "All qualified participants must submit an application packet ... no later than October 15, 2026" and the only online route is this form.

Why: a high-school senior following the flyer, the QR code or the "Application" button reaches a sign-in wall. Unless the student happens to have a Google account in the form owner's organisation, they cannot register.

Fix: in Google Forms, Settings, Responses, turn off "Restrict to users in ... and trusted organisations". Verify from a signed-out browser. The YLC form (`1FAIpQLSeLFC...`) is public and can serve as the reference.

### L2 Critical: dropdown menus cannot be opened from the keyboard, and the mobile drawer is always in the tab order

Evidence: at 1440 the focus walk on every page goes Home, News, Contact Us, Seeking and then leaves the header (`*/source/inventory-1440.json` `focus`). The five dropdown parents (Our Legacy, Programs, Upcoming Events, Gallery, Members) are not focusable and have no `aria-haspopup` or `aria-expanded`; focusing a parent by script does not reveal the submenu (`interactions.submenuVisibleOnFocus: false` on all 21 pages). Hover does open them for a mouse. At 375 the drawer links are focusable while the drawer is closed: 32 to 40 tab stops per page land on off-screen items (`inventory-375.json` `focus`).

Why: 17 of the 21 pages are reachable only through a dropdown. A keyboard or switch user on a desktop cannot get to History, Officers, Past Basilei, Lineage, Mandated Programs, Scholarships, any event or any gallery year. WCAG 2.1.1, 2.4.3, 4.1.2.

Fix for the rebuild: parent items are `<button aria-expanded>` that open on click, Enter and Space, the submenu opens on `:focus-within` as well as hover, Escape closes, and the drawer is `hidden` (or `inert`) until opened.

### L3 High: a timed promo popup fires on every page

Evidence: `*/screenshots/375-popup.png`, `inventory.popup`. The dialog has `role="dialog"` and `aria-modal="true"` but no accessible name (axe `aria-dialog-name`), covers the hero on mobile, and re-appears on every navigation because nothing remembers that it was dismissed. On the large gallery pages it fired after the crawler had already started tabbing and captured focus (`gallery-2024/source/inventory-1440.json` `focus`: Close, Close, Close ...). The "Register Now!" control inside it has no `href`.

Why: the first thing every visitor sees on every page is an interruption, and it repeats. WCAG 2.2.4 (interruptions, AAA) and 4.1.2.

Fix: show the YLC promotion once per session as an inline banner or a home page card, never as a modal that returns on each page.

### L4 High: page weight and third-party load

See section 2. Also: Font Awesome is loaded from cdnjs for four social icons; Typekit and Strikingly fonts both load; Google Maps JavaScript loads on pages with no visible map because the mobile "Find Us" popup is prebuilt.

### L5 High: colour contrast fails on the brand elements

Measured by axe (`tooling/axe-summary.mjs`), all ratios against WCAG 1.4.3 minimum 4.5:1 for text and 3:1 for large text:

| Pair | Ratio | Where |
|---|---|---|
| Logo wordmark #ffa64d on white, 28 px | 1.94:1 | every page |
| White on gold #cdb33a: "Application", "Submit", "Register Now", cookie "Accept all" | 2.07:1 | every page with a button |
| Nav links #2f3c4d over dark page backgrounds | 1.31:1 to 1.67:1 | all-star-game, 50th-anniversary-gala, youth-leadership-conference, gallery-2025 |
| "Show more" #2eb6dc on white | 2.37:1 | galleries 2021, 2022, 2017-2020 |
| Contact form placeholder labels #bbbbbb on white | 1.91:1 | contact-us |
| Upload helper "Upload File" and "Up to 20 MB" | 1.97:1 to 2.06:1 | scholarships |
| Cookie "Decline All" | 2.25:1 | every page at 375 |

The heading purple #7951a9 on white passes (4.6:1) and the "Seeking" pill passes.

### L6 High: no landmarks, doubled headings, zoom cap

Every page has zero landmarks and starts with a hidden `h1` and `h2` "The RoK Hard Ques" before its own `h1`, so screen reader users hear two page titles and cannot jump to main content. The mobile actions list is a `ul` whose children are `a` elements (axe `list`). `maximum-scale=3.0` caps pinch zoom (axe `meta-viewport-large`, minor). Three pages have no visible `h1` at all (past-basilei, 50th-anniversary-gala, all-star-game, youth-leadership-conference use images or an `h2`).

### L7 High: event information exists only inside poster images

Evidence: youth-leadership-conference (682 x 1024 poster, `alt=""`), all-star-game (1200 x 1697, `alt=""`), 50th-anniversary-gala (1200 x 1692, `alt=""`), achievement-week (1200 x 1697 flyer, `alt=""`). The dates, venues, times, eligibility, contest rules, prize amounts, organiser phone numbers and email addresses, and the donation QR code exist nowhere as text (`*/source/content.txt` for these pages holds one heading or none).

Why: the information is invisible to screen readers, search, translation, copy and paste, and to anyone on a small screen where a 1200 px poster renders at 327 px. The All Star and YLC posters also publish officers' personal mobile numbers and Gmail addresses.

Fix: every event gets a text block (what, when, where, who, cost, how to register, contact) with the poster as an illustration that has a short alt. Use chapter role addresses rather than personal ones.

### L8 Medium: mobile header and overlays

The hamburger is a `div` with no role, name, `tabindex` or state (`inventory-375.json` `interactions.toggle`). The fixed bottom bar (Home, Contact Us, Find Us) plus the cookie banner plus the popup can cover the whole lower half of a 375 x 812 viewport (`contact-us/screenshots/375-full.png`). The cookie "Accept" button at 1440 is 34 x 12 px. The mobile header stacks logo and wordmark to 150 px tall on the contact page.

### L9 Medium: labels, titles and nav targets

| Item | Problem |
|---|---|
| Page titles | past-basilei, lineage and 2017-2020 are all titled "Korea Bruhz"; ylc-registration and essay-contest-registration have empty meta descriptions |
| Lineage | nav says "Lineage", the page `h1` says "Line History" |
| Members | dropdown with nothing in it; on desktop it is a dead item, on mobile an expander that opens empty |
| Our Legacy (parent) | its own link goes to oppf.org, an external site, so a click on the parent leaves lambdaxi1911.com |
| Gallery (parent) | goes to /2025; Upcoming Events (parent) goes to the gala |
| Seeking | fraternity jargon for "interested in joining"; no external marker |
| History of Omega Psi Phi | external link inside the site menu with no indication |
| Executive Officers | "Keeper of Records and Seal" title is rendered a second time in white on white (axe 1.09:1), a leftover |

No item carries `aria-current`; the theme colours the active item purple, which is the only cue.

### L10 Medium: forms

Contact: fields are labelled by placeholder only (`#bbbbbb`, 1.91:1), the topic control renders as an unstyled "Select..." combobox with no label (axe `label` critical), and the phone field defaults to the United Kingdom (+44) for a chapter in Korea serving a US community. Scholarships: the online form has visible labels and required markers (good), asks for parent phone and email and a mandatory upload up to 20 MB, and gives no statement of what happens after submission or who reads it. On both pages the form mounts only after it scrolls into view and a few seconds pass; until then the visitor sees the heading "Submit Application" over blank space (`scholarships/screenshots/1440-full.png` from the first pass, `1440-form-late.png` after waiting). The two scholarship PDFs open in new tabs with no file type or size shown.

### L11 Medium: new tabs everywhere

Three to seven links per page carry `target="_blank"`, including internal links on Mandated Programs (`content.txt`: the Achievement Week and Scholarship images and headings open the chapter's own pages in a new tab). No link says it opens a new tab. WCAG 3.2.5 advisory, and a real cost on mobile where tabs pile up.

### L12 Medium: footer and contact surface

The footer is a copyright line and four social icons. No address, no email, no phone, no navigation. The only route to the map is the mobile bottom bar's "Find Us" (a Google Maps popup for Pyeongtaek); desktop visitors have no map at all. The contact page has no email address or phone as text, only the form.

### L13 Medium: galleries

Six year pages hold 60 to 644 photos each on a single page. Only 2022 has alt text (314 of 395); the others have `alt=""` on every image and the lightbox therefore announces nothing. There is no album navigation, no filter, and the "Show more" expander is 2.37:1. The lightbox (Fancybox) is good: `role="dialog"`, `aria-modal`, focus moves in, Escape closes, arrows work.

### L14 Low: typography and measure

Headings and many captions use Special Elite, a typewriter face, at sizes down to 14 px. Body text on History runs the full 1,150 px column at 1440, about 180 characters per line. The Lineage accordion labels wrap "1970" and "s" onto two lines (`lineage/screenshots/1440-full.png`).

### L15 Low: home hero

The hero stacks a black script wordmark ("Home of the RoK Hard Ques") and the Greek letters over a dark night photograph; the wordmark is unreadable at every width. Nav links sit over the image with no scrim. There is no statement of what the chapter is, where it is, or what a visitor can do next; the only calls to action on the home page are the promo popup and the external "Seeking" pill.

### L16 Low: data gaps that look like errors

Past Basilei prints 21 empty years as "1979 –". Lineage has no 1990s entry although Past Basilei lists leaders for 1996 to 1999. The "Notable Chapter Brothers" `h3` concatenates two lines into one heading.

### L17 Low: home has no "what is on"

After the Basileus message the only content is the souvenir journal embed. Nothing on home mentions the four upcoming events, the scholarship window (1 February to 1 May), or how to contact the chapter, other than the popup.

### L18 Low: consent order

The cookie banner exists, but Facebook connect, New Relic and hCaptcha load before any choice is made.

## 4. What the live site does well (carry these into the rebuild)

- Real, deep content: line history back to 1977, 31 years of Basilei, 1,650 photographs, two newsletters, twelve programme descriptions with photographs, the charter newspaper page.
- A working, spam-protected contact form and a scholarship application form with labels, required markers and file upload.
- Event registration through Google Forms, which gives the chapter a spreadsheet of responses for free.
- Favicon, Open Graph tags, canonical link and meta descriptions on almost every page.
- The lightbox is accessible and Escape closes it.
- Social links with accessible names (facebook, instagram, youtube, messenger).
- A mobile action bar with a map link, which desktop lacks.

## 5. Task flows across the site

Steps count clicks, taps and typed fields from the page named. Wrong turns are places a reasonable visitor would go first and be sent back.

| Task | Start | Live steps | Wrong turns | Outcome today |
|---|---|---|---|---|
| Find out what the chapter is and where | home | 1 (close popup) then read | 0 | Basileus message answers "who" in paragraph three; "where" is never stated as a place on home |
| Find the next event and its date | home, desktop | 3 (close popup, hover Upcoming Events, pick one) | 1 (the parent link goes to the gala, not a list) | four dates exist only inside posters |
| Register for the Youth Leadership Conference | home, mobile | 2 (popup "Register Now!", then the Google Form) plus the form's own pages | 0 | works; form is public |
| Register for the essay contest | achievement-week | 2 (Application, then form) | 0 | blocked by Google sign-in (L1) |
| Apply for a scholarship | home, desktop | 3 to reach the page, 2 to open a PDF, or 9 fields plus upload plus captcha for the online form | 1 (form is blank until it mounts) | works, but two competing routes (PDF and online form) with no guidance on which to use |
| Read the chapter history | home, desktop | 2 (hover Our Legacy, click) | 1 (clicking the parent goes to oppf.org) | works |
| Find who is Basileus | home | 0 (signed message) or 2 (Officers page) | 0 | works |
| Look up a line brother by year | home | 3 (hover, Lineage, open decade) | 0 | works; no 1990s |
| See photos from Achievement Week 2024 | home | 3 (hover Gallery, 2024, scroll to album) | 0 | 24 MB page, first album is the right one |
| Contact the chapter | any page, desktop | 1 (Contact Us) + 6 fields + captcha | 0 | works; no email or phone alternative |
| Find the chapter on a map | any page, desktop | not possible | 1 | map exists only in the mobile bar |
| Donate to the 50th anniversary | gala page | scan QR from screen | 1 | no link; QR only |
| Reach any dropdown page with a keyboard | any page, desktop | not possible | | L2 |

## 6. Consolidation review

The site has 21 URLs for content that a visitor thinks of as seven things: who we are, who leads, what we do, what is coming up, photos, news, contact. Each proposal keeps every word and photograph.

| Finding | Pages involved | Recommendation | Pages removed |
|---|---|---|---|
| C1. Executive Officers, Past Basilei and Lineage answer one question, "who leads and who came through". Past Basilei is one screen; Lineage is five accordions. | executive-officers, past-basilei, lineage | One "Leadership and Lineage" page: current officers, then Basilei by year (gaps hidden, not printed), then lines by decade with a working filter. In-page jump links keep each section one click away. | 2 |
| C2. The two registration pages exist only to hold an iframe. | essay-contest-registration, ylc-registration | Embed or link the form on the event's own page, directly under the event details. | 2 |
| C3. Four event pages are each one poster. Upcoming Events has no list, so the parent link points at one event. | achievement-week, youth-leadership-conference, all-star-game, 50th-anniversary-gala | One "Events" page: a dated list with each event as a section (text details, poster, register or donate action). Individual anchors keep deep links working. When an event passes it moves to an archive section instead of lingering as "upcoming". | 3 |
| C4. Six gallery pages, 60 to 644 photos each, no album index. | the six gallery year pages | One "Gallery" page with an album index (year, event, count), each album opening as a paginated grid of 24 to 48 thumbnails with captions. Year and event filters replace the six nav items. | 5 |
| C5. History of Omega Psi Phi is an external link dressed as a page. | nav item only | Keep it as a clearly marked external link in the History page's introduction, not in the site menu. | 0 (nav item removed) |
| C6. Members is an empty dropdown. | nav item only | Remove until there is member content, or make it a plain link to whatever it is meant to open. | 0 (nav item removed) |
| C7. News is two newsletter embeds. | news | Keep as a page, but list newsletters as dated items with a cover image and a PDF link first, and the Issuu reader as the secondary option; it saves 7 to 14 MB per visit. | 0 |

Adopting C1 to C4 takes the site from 21 pages to 9: Home, History, Leadership and Lineage, Mandated Programs, Scholarships, Events, Gallery, News, Contact. Total pages removed: 12. Every current URL should redirect to its new section so the QR codes on printed posters and the links inside the newsletters keep working.

## 7. Recommended order of work on the live site while the rebuild proceeds

1. Make the Essay Contest Google Form public (L1). Five minutes, and the 15 October deadline depends on it.
2. Turn off or reduce the popup to once per session (L3).
3. Add text details under every event poster (L7) and a chapter email address to the footer (L12).
4. Fix the four button and wordmark colours (L5): darker gold, or dark text on gold.
5. Everything structural (landmarks, keyboard menus, weight, galleries) lands with the rebuild; see `mock-recommendations.md`.

Phase B (recreated pages in the design-target style) starts after this report, the 21 page reports and `mock-recommendations.md` are signed off.

Two decisions are needed before Phase B, because the project's frontend review gate (`~/.claude/agents/frontend-reviewer.md`) treats an unconfirmed palette or typeface as a critical defect:

1. Design system. The repo mock already uses a purple and gold palette in `oklch()` (header `#1b0e2d`, gold `#c69612`, page `#fbfaf7`) with Playfair Display, Libre Franklin and Archivo Black. The live site uses purple `#7951a9`, gold `#cdb33a`, orange `#ffa64d`, Special Elite and Sansita. Neither is written down as the chapter's brand system. Confirm which set the mocks should tokenise, or supply the brand colours and typefaces. The crest in `images/shared/omega-psi-phi-crest.png` is the only fixed brand asset.
2. Form destination. Google Forms embeds (already in use for events), a form service, or a backend to be built later. The mocks will label the submit path as sample data either way, but the field sets differ between the live forms, the repo mock and `google-forms-spec.md`, and one has to be chosen.

Acceptance for each Phase B mock, in addition to the bar in the brief: a pass from the frontend-reviewer agent with no CRITICAL findings, a step-count table against the live page and the current repo mock, and an axe run at 375, 768 and 1440 with zero violations.
