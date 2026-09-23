# Achievement Week: review

URL: https://www.lambdaxi1911.com/achievement-week
Captures: `screenshots/`, `source/`

## Who comes here and why

High-school seniors at Daegu, Osan and Humphreys high schools, their parents and teachers (the essay contest), and brothers and guests (the banquet). They need the topic, rules, prizes, deadline, and how to enter.

## What the page contains

Hero photograph (banquet, seven brothers) with `h1` "Achievement Week 2026" and `h4` "Achievement Week 2026 announcements."; `h1` "International High School Essay Contest"; a 1200 x 1697 flyer image containing: topic ("How can young people use leadership, service, and innovation to create positive change in their communities?"), rules (700 to 750 words, original, no AI, Word file by email, parental consent under 18, open to college-bound seniors at Daegu, Osan and Humphreys High Schools), awards ($500, $300, $200), deadline 15 October 2026 at 5 PM, email scholarship@lambdaxi1911.com, QR code; an "Application" button to /essay-contest-registration (new tab).

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Read the rules | 1 (close popup), then read a 1,129 px tall image | 0 | On a phone the flyer is 327 px wide; the rules are about 6 px tall. |
| Enter the contest | 2 (Application, then the Google Form) | 0 | The form returns a Google sign-in wall (L1). |
| Email the essay | copy an address out of an image | 1 | The email exists only as pixels. |
| Find the banquet date | not possible | 0 | The page title says "announcements" and lists none. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| AW1 | Critical | The only online entry route leads to a private Google Form (HTTP 401). | `../essay-contest-registration/source/requests-1440.json`; direct fetch | Nobody outside the form owner's Google organisation can register before the 15 October deadline. | Make the form public (L1). |
| AW2 | High | Every fact about the contest is inside an image with `alt=""`. | `source/content.txt` has two headings and one link | Unreadable on phones, invisible to screen readers and search, uncopyable email address. | Text block with the topic, rules as a list, awards, deadline in `<time>`, and a `mailto:` link; flyer as illustration. |
| AW3 | High | Two `h1`s on the page plus the hidden site `h1`. | inventory `headings` | | One `h1` "Achievement Week 2026", `h2` "International High School Essay Contest". |
| AW4 | Medium | "Application" button: white on gold 2.07:1; opens a new tab unannounced. | axe; inventory `links` | | L5, L11. |
| AW5 | Medium | The page promises "announcements" and has none beyond the contest; the banquet, awards ceremony and week schedule (visible in the 2023 and 2024 gallery albums) are absent. | content.txt | | Schedule block: dates, venue, ticket or RSVP route, past years' link to the gallery album. |
| AW6 | Low | The hero image is 1,200 px wide, 364 KB, loaded blurred then sharp; nav links sit over it. | requests; screenshot | | Sized image, header scrim. |

Site-wide: L2, L3, L4, L5, L6, L7, L8, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x1, `heading-order`, `landmark-one-main`, `meta-viewport-large`, `region` x16 |
| axe 375 | `color-contrast` x4, `heading-order`, `list`, plus the above |
| Keyboard | 7 stops |
| Images | flyer 1200 x 1697 shown at 1129 x 1596, `alt=""` |

## Everything the page does (parity list)

Hero; two headings; contest flyer; link to registration form. The flyer's content, transcribed above, is the parity requirement.

## For the repo mock

The mock has no Achievement Week page. Add it to the Events page with the transcribed contest details, the banquet block, a working public registration link (or the form embedded), and the flyer as an illustration. Use a role address (scholarship@lambdaxi1911.com is already the published one) rather than personal mail.
