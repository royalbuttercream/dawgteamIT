# Recommendations for the new site in this repo

Scope: what the rebuild in `Lambda Xi 1911 optimization/` should carry over from lambdaxi1911.com, what it should fix, and where it currently loses content or capability against the live site. Live-site evidence is cited by page slug (`<slug>/report.md`, `<slug>/source/content.txt`). Repo evidence is cited by file. Findings on the live site are numbered L1 to L18 in `report.md`.

## 1. Content parity: what the repo mock is missing

The live site is the chapter's record. The rebuild currently drops a large part of it.

| Live content | Live location | Repo mock today | Action |
|---|---|---|---|
| Line history: 5 decades, about 130 named brothers by semester (Fall 77 to Fall 25) | lineage, accordions | `lineage.dc.html` shows five decade pills with no data behind them | Carry the full list. Source text is in `lineage/source/content.txt`. Model it as `{ decade, semester, names[] }` and render as a filterable list. Note the live data has no 1990s block; ask the chapter whether lines exist for 1990 to 1999 before publishing a gap. |
| Photo galleries: 1,656 photos in 22 albums across six years | gallery-2017-2020 to gallery-2025 | 10 photos (2023, 2022) on the home page behind six year pills, four of them empty | Build a gallery page with an album index. Album names and counts are in each `gallery-*/source/content.txt`. Only 2022 has alt text on the live site; the rebuild needs captions per album at minimum. |
| Three more events: Achievement Week and its essay contest, Youth Leadership Conference (17 October 2026, Humphreys Middle School, grades 9 to 12, free, first 60), All Star basketball tournament (12 September 2026, 11:00, Collier Fitness Center) | achievement-week, youth-leadership-conference, all-star-game | Only the gala | Add an Events page with all four, as text, with the poster as illustration (L7). |
| 50th Anniversary dates: 30 April to 2 May 2027, Republic of Korea, with a PayPal donation route | 50th-anniversary-gala poster | `50th-anniversary-gala.dc.html` says "Date: TBA" | Use the published dates; add a donate link (not just a QR). Confirm with the chapter that the dates are final. |
| Souvenir journal (23 pages) and two newsletters (Omega Year 2025, 51 pages; Omega Year 2026) | home, news | `news.dc.html` links both newsletters to lambdaxi1911.com/news | Host the PDFs in the repo or link the Issuu documents directly (`lambda_xi_achievement_week_journal`, `lambda_xi_rok_hard_news_oy_25`, `lambda_xi_oy26_newsletters`). Show a cover image and a PDF link first; the Issuu reader costs 7 to 14 MB. |
| Basileus message, six paragraphs | home | three paragraphs | Use the full text (`home/source/content.txt`) unless the Basileus approved the cut. |
| Chapter history: the 23 May 1975 approval by Brother Harold J. Cook, the longer closing paragraph, the charter newspaper photo | history-of-lambda-xi | trimmed text, photo present | Restore the trimmed sentences. |
| Mandated programs: twelve photographs, one per programme | mandated-programs | text cards, no images | Reuse the twelve photos (they are the chapter's own event photos) at 600 px wide with `srcset`. |
| Scholarship applications: two PDF forms plus an online form with Name, School (select), Student Email, Parent Name, Parent Phone, Parent Email, File Upload (required, up to 20 MB) | scholarships | a different form (scholarship select, names, email, high school, college, essay) that saves to localStorage | Decide one field set with the Scholarship Committee. The live form and `google-forms-spec.md` in this repo disagree with each other and with the mock. Whatever is chosen must post somewhere real (see section 3). |
| Contact form: First Name, Last Name, Email, topic select, Phone with country code, Message, hCaptcha | contact-us | similar fields, no phone, no spam protection, saves nothing | Same as above. Default the country code to +82 and +1, not +44 as the live site does. |
| Social links: Facebook, Instagram, YouTube, Messenger | every live footer | none | Add to the footer with accessible names. URLs are in `executive-officers/source/inventory-1440.json` `links`. |
| Map: Pyeongtaek, "Find Us" | mobile bottom bar | footer link on home only | Footer link on every page plus a static map image on Contact. |
| Accolades (9), inaugural council, charter members | history-of-lambda-xi | present | Keep. |
| Past Basilei, 31 named years | past-basilei | present, gaps correctly omitted | Keep. |
| Executive officers, 8, with photos | executive-officers | present, local photos | Keep. |
| Notable brothers: two entries for Freddie Thompson, IV (12th District Representative; IHQ 2024-2025 Brigadier General Charles Young Military Leadership Award) | lineage | one entry | Add the award. |
| "History of Omega Psi Phi" | live nav item is an external link to oppf.org/about-omega | `history-of-omega-psi-phi.dc.html` contains two paragraphs that do not appear on the live site | Either get the text approved by the chapter or replace the page with a short introduction on the History page plus the external link, marked external. Do not publish unsourced text about the fraternity's founding. |
| Impact statistics on home: "49 Years of Service", "2 Annual Scholarships", "$5.5K Awarded Each Year" | not on the live site | present in `Lambda Xi Homepage.dc.html` | Verify the money figure. The live scholarship page says $2,500 awarded to three students and $3,000 to one; if the amounts are per student the total is $10,500. Compute the years figure from the charter date (22 February 1977) rather than hard-coding 49. |

## 2. Fix the two things the live site gets right and the mock breaks

| Capability | Live | Repo mock | Fix |
|---|---|---|---|
| Dropdown menus open | hover opens them for mouse users (keyboard does not, L2) | never open: the submenu's inline `opacity:0; visibility:hidden` beats the `.nav-item-wrap:hover .submenu` rule in every page's `<style>` block, so hover, keyboard and touch all fail on desktop | Move the closed state to a class, open on hover and `:focus-within`, make the parent a `button` with `aria-expanded`. |
| Forms deliver | contact and scholarship forms post to Strikingly with hCaptcha; event registration goes to Google Forms | scholarship, RSVP and contact forms write to the visitor's `localStorage` (`js/lambdaxi-data.js`) and then show "a brother will follow up" | Do not ship a form that says it delivered when it did not. Until a backend exists, embed the Google Forms (the chapter already uses them) or post to a form service, and make the success copy true. |

## 3. Fix the things both sites get wrong

| Topic | Live (L-ref) | Repo mock | Requirement for the rebuild |
|---|---|---|---|
| Keyboard access to the menu | L2 | dropdown items are `visibility: hidden`, so they are not in the tab order either | Button parents, `aria-expanded`, `:focus-within`, Escape closes, `aria-current="page"` on the active item. |
| Landmarks and headings | none; two `h1`s per page (L6) | no `main`, no `lang`, no skip link | `<html lang="en">`, one `h1`, `header`, `nav aria-label`, `main id="main"`, `footer`, skip link first. |
| Form labels | placeholders on contact; labels on scholarships (L10) | placeholders only, `outline: none` on every field, selects with no name | Visible `label for` on every field, `autocomplete` tokens, visible `:focus-visible` ring, error text tied with `aria-describedby`, a review step before submit. |
| Contrast | wordmark 1.94:1, gold buttons 2.07:1, nav over dark 1.3 to 1.7:1 (L5) | gold eyebrow 3.98:1 on scholarships; field borders 1.58:1 | Token set with both palettes checked at AA. Gold `#c69612` with near-black text passes (6.8:1); gold with white text does not. |
| Event details as text | posters only (L7) | gala has text but "Date TBA" | Structured event block: title, date and time (with `<time>`), venue, audience, cost, action, contact, then the poster with a one-line alt. |
| Images | 1200 px sources for 360 px avatars, 644 images on one page, no `srcset` (L4, L13) | 900 px gallery sources for 203 px tiles, 3.3 MB hero video on mobile | `srcset` and `sizes`, `loading="lazy"` below the fold, `width`/`height`, a poster and pause control for any video, no autoplay under `prefers-reduced-motion`. |
| New tabs | 3 to 7 unmarked `_blank` links per page (L11) | none | Same tab for internal links; external links get an icon, `rel="noopener"` and "(opens in new tab)" for assistive tech. |
| Footer | copyright and social icons only (L12) | full footer on home, "Back to Home" on the other ten pages | One footer partial on every page: contact email, map link, social links, nav groups. |
| Page titles and labels | "Korea Bruhz" on three pages, "Lineage" vs "Line History", empty "Members", "Seeking" (L9) | "Lineage" vs "Line History" copied over; "Seeking" copied over | Unique titles per page in the form "Page name | Lambda Xi Chapter"; nav label equals `h1`; drop Members until it has content; relabel "Seeking" to "Interested in joining?" with the external marker. |
| Home content | popup, hero, message, journal embed (L15, L17) | hero video, message, stats, one event, gallery, teaser, dead subscribe form | Home should answer, above the fold, who and where the chapter is, and show the next two or three events with dates, the scholarship window, and how to contact the chapter. Keep the Basileus message as the second block. |
| Popups and banners | timed modal on every page, cookie banner, bottom bar (L3, L8) | none | Do not add a modal. If a promotion is needed, an inline dismissible banner remembered in `localStorage`. |
| Weight | 3 to 25 MB per page | 4.9 MB home (video), 53 to 778 KB elsewhere | Under 1 MB for every page except gallery albums, which paginate. |
| Client-side rendering | Strikingly React app, 700 KB HTML | `support.js` runtime plus React from unpkg, template with `{{ }}` visible without JavaScript | Static HTML per page. The content model in this document does not need a runtime. |

## 4. Information architecture for the rebuild

Nine pages (see `report.md` section 6 for the reasoning and the pages-removed count):

| New page | Absorbs | Nav label |
|---|---|---|
| Home | home | Home |
| History | history-of-lambda-xi, plus a short introduction linking to oppf.org for the national history | Our Legacy: History |
| Leadership and Lineage | executive-officers, past-basilei, lineage | Our Legacy: Leadership |
| Mandated Programs | mandated-programs | Programs: Mandated Programs |
| Scholarships | scholarships, application PDFs and one online form | Programs: Scholarships |
| Events | achievement-week, essay-contest-registration, youth-leadership-conference, ylc-registration, all-star-game, 50th-anniversary-gala | Events |
| Gallery | the six year pages, as an album index with year and event filters | Gallery |
| News | news, newsletters and the souvenir journal | News |
| Contact | contact-us, with email, map and the form | Contact |

Every live URL in the page table of `report.md` should redirect to its new home. The QR codes on the printed posters point at `/ylc-registration` and `/essay-contest-registration`.

## 5. Repo hygiene noticed during the audit

- `CLAUDE.md` says the nav array lives in `support.js`. It does not; each `.dc.html` defines its own `navItems`, and the home copy already differs from the other ten.
- `google-forms-spec.md` describes forms whose field sets differ from the live site's forms. Reconcile before building any of them.
- `migration-brief.md` states "Date: TBA" for the gala and "$5.5K" for scholarships; both conflict with the live site.
- The folder name `Lambda Xi 1911 optimization` becomes part of every public URL on GitHub Pages (`/Lambda%20Xi%201911%20optimization/Lambda%20Xi%20Homepage.dc.html`). Rename before launch or serve from the root.

## 6. Order of work

1. Agree the nine-page structure and the content parity table (section 1) with the chapter. Lineage and gallery are the two largest gaps.
2. Decide the form backend (Google Forms embed is the zero-cost option the chapter already operates).
3. Phase B mocks, one page at a time, built to the design target in the audit brief: tokens, light/system/dark, labelled forms with a review step, one shared header and footer, no runtime.
