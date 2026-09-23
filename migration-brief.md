# Lambda Xi Chapter Site — AI Studio Migration Brief

Paste this into Google AI Studio's Build mode, section by section, to rebuild the site there. Real content below is verified against the current live site and the redesigned local repo — copy it in as-is rather than letting Gemini invent placeholder text. Binary assets (photos, video) aren't included here — see the Asset Manifest at the end for what to drag in separately.

## 1. Site Map & Navigation

11 pages, one nav bar repeated on every page:

- **Home** (`/`)
- **Our Legacy** (dropdown)
  - History of Omega Psi Phi
  - History of Lambda Xi
  - Executive Officers
  - Past Basilei
  - Lineage
- **Programs** (dropdown)
  - Mandated Programs
  - Scholarships
- **Events** → 50th Anniversary Gala
- **Gallery** (anchor on Home, year-filtered: 2025 / 2024 / 2023 / 2022 / 2021 / 2017-2020)
- **News**
- **Contact**

Top-right of nav: a gold pill button labeled **"Seeking"** linking out to `https://msp.oppf.org/` (the fraternity's external membership portal — keep this external link, don't rebuild it).

## 2. Design System

**Colors** (converted from this repo's oklch values to hex):

| Role | Hex | Notes |
|---|---|---|
| Header / hero background (dark) | `#1b0e2d` | deep purple |
| Header background (scrolled state) | `#11071f` | slightly darker |
| Submenu / card-on-dark background | `#231933` | |
| Gold accent (buttons, CTAs) | `#c69612` | |
| Gold accent (hover state) | `#dca81c` | |
| Gold text (eyebrow labels, stat numbers) | `#e5bf6d` | |
| Body text | `#1c1923` | near-black |
| Page background | `#fbfaf7` | warm off-white, not pure white |
| Card border | `#e0ded7` | subtle gray |

**Typography** (all Google Fonts, load via `<link>` the same way):
- **Playfair Display** (600/700/800) — all headings
- **Libre Franklin** (400/500/600/700) — body text, nav
- **Archivo Black** — oversized display treatment (hero watermark word, stat numbers, "Our Impact Runs Deep" heading)

**Layout patterns to recreate:**
- **Hero**: full-bleed looping background video, dark gradient scrim over it, an oversized (clamp 64–190px) low-opacity white word ("UPLIFT") centered behind the headline, crest logo + eyebrow + H1 + subhead + two pill CTAs on top, all centered.
- **Impact stat band**: dark purple background, 3 stats in a row (big Archivo Black gold numbers over small white uppercase labels): **49 — Years of Service**, **2 — Annual Scholarships**, **$5.5K — Awarded Each Year**.
- **Principles marquee**: a thin gold horizontal band with "MANHOOD • SCHOLARSHIP • PERSEVERANCE • UPLIFT •" scrolling infinitely left, dark purple text on gold.
- **Sticky header**: transparent-ish dark purple, gets slightly darker + gains a shadow once the page is scrolled past ~40px.
- **Cards**: white background, 1px `#e0ded7` border, 14px border-radius, generous padding (32–44px), used for events, program listings, gallery-adjacent content.
- **Gallery**: pill year-filter buttons above a responsive grid of square (aspect-ratio 1) photo tiles, rounded corners, `object-fit: cover`.

## 3. Real Page Content (verbatim)

### Home — Hero
- Eyebrow: "Omega Psi Phi Fraternity, Inc. · Lambda Xi Chapter"
- H1: "Friendship Is Essential to the Soul"
- Subhead: "The RoK Hard Ques — serving active-duty service members, civilians, and communities across the Korean Peninsula since 1977."
- CTAs: "Our Legacy" (gold, links to History section) / "Get Involved" (outline, links to Contact)

### Home — Basileus Message
> Greetings, on behalf of the Brothers of the Lambda Xi Chapter, welcome and thank you for visiting our official website. I am honored to serve as Basileus for the 2025–2026 Omega Year, guided by our theme: "Exceeding Our Founders' Expectations."
>
> Our Founders established Omega Psi Phi Fraternity, Inc. on the principles of Manhood, Scholarship, Perseverance, and Uplift — values that continue to shape our work and define our purpose.
>
> Lambda Xi is composed of active duty service members and civilians residing across various regions of the Korean Peninsula, united in friendship and committed to advancing the mission of Omega. As one of Omega's international chapters, we proudly serve the Korean Peninsula.
>
> In Friendship and Service,
> **Bro. Eugene Gibbs**
> Basileus, Lambda Xi Chapter

### History of Lambda Xi
> The year 1977 proved to be an exciting one for the international expansion of Omega Psi Phi Fraternity, as two chapters, on opposite sides of the world, were chartered six months apart. As only the fifth chapter to be chartered outside of the continental United States, Lambda Xi would call the Republic of Korea its home — a brotherly expansion under Grand Basileus Edward J. Braynon.
>
> The original application was initiated through the Third District Representative, Brother B.T. Garnett, on 20 October 1974. On 22 February 1977, Lambda Xi was chartered at the Eighth United States Army Headquarters, United States Army Garrison Yongsan, Republic of Korea.
>
> The eleven charter members consisted of Brothers Leroy C. Bell, Peter J. Baker, Curtis A. Baylor, Marshal F. Atkins, James H. Campbell, Thurman R. Hampton, James H. Jackson, Thomas G. Joiner, Henry L. Gibson, William J. Bryant, and Roosevelt Adams.
>
> **Inaugural Executive Council:**
> Brother Alphonso Maldon — Basileus · Brother Joe Howze — Vice Basileus · Brother Willie Hensley — Keeper of Records and Seal · Brother William Blakely — Keeper of Finance · Brother Charles Burton — Keeper of Peace · Brother Herschel Jones — Chaplain · Brother Freddie Price — Chapter Editor
>
> The Lambda Xi Chapter was the first Black Greek Letter Organization activated on the Korean Peninsula. For nearly five decades, the Men of Lambda Xi have proudly served with distinction — whether assisting the less fortunate or uplifting those striving for academic excellence.

**Accolades** (display as a badge grid):
2026 — 13th District Graduate Chapter of the Year · 2026 — 13th District Social Action Chapter of the Year · 2025 — 13th District Graduate Chapter of the Year · 2025 — 13th District Social Action Chapter of the Year · 2024 — 13th District Graduate Chapter of the Year · 2024 — 13th District Social Action Chapter of the Year · 2023 — 13th District Graduate Chapter of the Year · 2023 — 13th District Runner-Up Social Action Chapter of the Year · 2015 — 13th District Graduate Chapter of the Year

### History of Omega Psi Phi (national)
> On Friday evening, November 17, 1911, three Howard University undergraduate students, with the assistance of their faculty adviser, gave birth to the Omega Psi Phi Fraternity. Bound by the cardinal principles of **Manhood, Scholarship, Perseverance, and Uplift**, the Fraternity grew from that single campus chapter into an international organization spanning colleges, cities, and — as of 1977, with the chartering of Lambda Xi — the Korean Peninsula.
>
> Those founding principles continue to guide every chapter's work today, shaping how Omega men serve their communities, support scholarship, and uphold the Fraternity's enduring legacy of brotherhood.

### Executive Officers (current roster)
| Title | Name |
|---|---|
| Basileus | Brother Eugene Gibbs |
| Immediate Past Basileus | Brother Richard Smith |
| Vice Basileus | Brother Randy Artis |
| Keeper of Records and Seal | Brother Charlesvester Wims |
| Keeper of Finance | Brother Marcus Shepard |
| Chaplain | Brother Andrew Wesley |
| Keeper of Peace | Brother Clint Carmichael |
| Editor to the Oracle | Brother Michael Robinson |

(Headshots: see Asset Manifest — `images/executive-officers/`, filenames match `firstname-lastname.jpg`)

### Past Basilei (year → name)
1977 Alphonso Maldon, II · 1978 Anthony Aiken · 1983 Clarence D. Demory · 1985 Clarence D. Demory · 1989 John D. Cooper · 1996 Lee Packnett · 1998 Robert Davis · 1999 Darrell Harris · 2000 Arthur Sobers · 2005 Alvin Wilkins · 2006 Marvin Chisolm · 2007 Anthony Wiggins, Sr · 2008 Kaleth Wright · 2009 Anthony Wiggins, Sr · 2010 Anthony Wiggins, Sr · 2011 Aaron Braxton, II · 2012 Anthony Cole · 2013 Darryle Albert · 2014 Brian Stanfield · 2015 Barrcary Lane · 2016 David Patterson · 2017 Greg Smith · 2018 Raphael Moore · 2019 Rodney Brown · 2020 Hughie Fewell · 2021 Percy Jones / Rodney Brown · 2022 Desmond Smith · 2023 Desmond Smith · 2024 Rodney Brown · 2025 Richard Smith · 2026 Eugene Gibbs Jr.

### Mandated Programs (12, title + description)
1. **Achievement Week** — Observed each November, recognizing individuals who have made a noteworthy contribution toward improving quality of life for Black Americans, alongside a High School Essay Contest.
2. **College Endowment Fund** — Each year the Fraternity gives at least $50,000 to Historically Black College Institutions (HBCUs), with chapters assessed donations based on chapter size.
3. **Fatherhood and Mentoring** — Every chapter plays an active role supporting the Fraternity's Fatherhood Mentoring initiative.
4. **Health Initiatives** — Facilitating activities that promote good health practices, including the Charles Drew Blood Drive and partnership with the American Diabetes Association.
5. **Memorial Service** — March 12th of each year is Memorial Day — chapters conduct a service recalling members who have entered Omega Chapter.
6. **NAACP** — Every district and chapter maintains a Life Membership at Large in the NAACP, or a yearly membership in good standing.
7. **Reclamation and Retention** — A concerted effort to retain active brothers and return inactive brothers to full participatory status.
8. **Scholarship** — Promotes academic excellence among undergraduate members; graduate chapters provide financial assistance to student members and non-members.
9. **Social Action** — Voter registration, Assault on Illiteracy, Habitat for Humanity, mentoring, and fundraisers for charitable organizations.
10. **STEM** — Getting students excited about science, technology, engineering, and mathematics.
11. **Talent Hunt** — Exposure, encouragement, and financial assistance to talented young people in the Performing Arts, with college scholarships awarded to winners.
12. **Voter Registration, Education and Mobilization** — Chapters facilitate activities that uplift communities through voting.

### Scholarships
- **Future Leaders Scholarship** — $2,500 · 3 recipients. Open to high school seniors planning to pursue a Bachelor's Degree at any accredited college or university.
- **Bro. Carl Reed Scholarship** — $3,000 · 1 recipient. Open to high school seniors planning to pursue a Bachelor's Degree at a historically Black college or university (HBCU).
- Applications accepted **1 February to 1 May** each year.
- (Application form: see `google-forms-spec.md` — embed the real Google Form here, don't rebuild a fake one.)

### Events — 50th Anniversary Gala
"Join the Brothers of Lambda Xi as we celebrate five decades of friendship, service, and leadership on the Korean Peninsula — commemorating our 1977 charter as the first Black Greek Letter Organization activated on the Korean Peninsula." Date: TBA.
- (RSVP form: see `google-forms-spec.md`.)

### News
Two real newsletter references exist on the live production site (`lambdaxi1911.com/news`) — no individual dated articles beyond these two:
- "Omega Year 2026 Newsletter (Nov 2025 – Oct 2026)"
- "Omega Year 2025 Newsletter (Nov 2024 – Oct 2025)"
Link both to `https://www.lambdaxi1911.com/news` until/unless real newsletter PDFs are hosted directly.

### Contact
Map coordinates for "Find Us": `36.95861337189751, 127.0427376735077` (Google Maps link: `https://maps.google.com/maps?q=36.95861337189751,127.0427376735077`)
- (Contact + Membership Interest form: see `google-forms-spec.md`.)

## 4. Asset Manifest (drag these into AI Studio directly — not included in this text file)

| File | Use |
|---|---|
| `video/hero-loop.mp4` | Hero background video |
| `images/shared/omega-psi-phi-crest.png` | Logo, used in header + hero |
| `images/executive-officers/*.jpg` (8 files) | Officer headshots |
| `images/history-of-lambda-xi/*.jpg` | Chapter history photo |
| `images/gallery/2022/*.jpg` (2 files) | 13th District Conference photos |
| `images/gallery/2023/*.jpg` (14 files) | MLK Day of Service + Boat Ride photos |

## 5. Forms Integration

Once the three Google Forms in `google-forms-spec.md` are built, embed their share links as `<iframe>`s (Google Forms supports this natively) in place of the custom HTML forms currently on the Scholarships, Gala, and Contact pages. Don't rebuild custom form UI + fake submit handlers in AI Studio — the whole point of the Forms approach is that officers get real submissions in a Sheet with zero backend code.
