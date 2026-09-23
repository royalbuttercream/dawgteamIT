# Mandated Programs: review

URL: https://www.lambdaxi1911.com/mandated-programs
Captures: `screenshots/`, `source/`

## Who comes here and why

Community partners, school counsellors, prospective members and district officers. They want to know what the chapter does locally and which programmes have a local event or application attached.

## What the page contains

`h1` "What We Do"; twelve alternating image-and-text rows, each with an `h3` and a paragraph: Achievement Week (links to the event page), College Endowment Fund, Fatherhood and Mentoring, Health Initiatives, Memorial Service, NAACP, Reclamation and Retention, Scholarship (links to Scholarships), Social Action, STEM, Talent Hunt, Voter Registration, Education and Mobilization. Photographs are the chapter's own event photos for most rows and stock graphics for four.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Learn what the chapter does | 1 (close popup), then a 4,800 px scroll at 1440 (6,150 px at 375) | 0 | Twelve equal rows with no overview or jump list. |
| Get to the essay contest | 1 (Achievement Week link) | 0 | Opens in a new tab. |
| Get to the scholarships | 1 (Scholarship link) | 0 | Opens in a new tab. |
| Find the Talent Hunt date | not possible | 0 | Talent Hunt is described but never dated or linked, though there is a 2025 gallery album for it. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| MP1 | High | 8.3 MB of images: 45 image requests for 13 visible pictures because the theme fetches several renditions, each up to 1,200 px wide and 346 KB, shown at 551 px. | `source/requests-1440.json`, `inventory-1440.json` `images` | Heaviest content page outside the galleries. | One rendition per breakpoint via `srcset`, WebP, about 60 KB each. |
| MP2 | Medium | Nav label "Mandated Programs", `h1` "What We Do". | inventory `headings` | Two names for one page. | Match label and heading. |
| MP3 | Medium | Only two of twelve programmes link anywhere; internal links open in new tabs; images that are links have `alt="Section image"` and no other name (axe: 2 focus stops read "image link"). | `source/content.txt`; `inventory-1440.json` `focus` | Visitors cannot tell which programmes have a local event, and keyboard users hear "image link". | Wrap the image and heading in one link per programme where a page exists; add "Learn more about X" text; same tab. |
| MP4 | Medium | Heading order `h1` then `h3`; no overview, no anchor list. | axe `heading-order` | | `h2` per programme with an in-page list of twelve at the top. |
| MP5 | Low | Text blocks sit on a light grey panel with 12 px body copy in some rows; the alternating layout forces the eye across the page twelve times. | `screenshots/1440-full.png` | | Consistent image left or a card grid with equal heights; 16 px body. |
| MP6 | Low | Four rows use stock art (blood drop, NAACP seal, STEM graphic, VOTE fist) with no alt. | inventory `images` | | Decorative: `alt=""`; photos: describe the event. |

Site-wide: L2, L3, L4, L5, L6, L8, L9, L11, L12, L14.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `heading-order`, `landmark-one-main`, `meta-viewport-large`, `region` x15 |
| axe 375 | `color-contrast` x4, `heading-order`, `list`, plus the above |
| Keyboard | 10 stops; two unnamed image links |
| Headings | hidden h1, hidden h2, h1, twelve h3 |

## Everything the page does (parity list)

Twelve programme rows with photo, title, description; links to Achievement Week and Scholarships.

## For the repo mock

`mandated-programs.dc.html` has the twelve titles and descriptions as a card grid with no images and no links. Add the twelve photographs (sized), link Achievement Week to the Events page and Scholarship to Scholarships in the same tab, add Talent Hunt and Youth Leadership Conference links where the chapter runs them, use `h2` per card, and add a twelve-item jump list at the top for phones.
