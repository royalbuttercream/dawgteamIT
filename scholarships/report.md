# Scholarships: review

URL: https://www.lambdaxi1911.com/scholarships
Captures: `screenshots/` (`1440-form-late.png` and the re-captured `*-full.png` show the mounted form; the first pass, recorded in `tooling/digest-1.txt`, found the form area empty), `source/`

## Who comes here and why

High-school seniors in the Daegu, Osan and Humphreys school communities, their parents, school counsellors, and the Scholarship Committee (who send people here). They need eligibility, amounts, deadline, and one clear way to apply.

## What the page contains

Hero photograph of the chapter with two award winners; `h1` "Scholarship Opportunities", `h4` "Applications are accepted 1 February to 1 May". `h2` "Open to High School Seniors" with the same dates repeated. Two pricing cards: Future Leaders, awarded to three students, $2,500, "Application" button (PDF, opens new tab); Bro. Carl Reed Scholarship, awarded to one student, $3,000, "Application" (PDF, new tab), eligibility lines under each. `h2` "Submit Application" with an online form: Name (First, Last), School (select), Student Email, Parent Name, Parent Phone (country picker, default +44), Parent Email, File Upload (required, up to 20 MB), hCaptcha, Submit. All fields required.

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Find amount and deadline | 1 (close popup) | 0 | Both in the hero. Dates appear three times. |
| Apply | either 1 (open PDF) or 9 (8 fields, upload, captcha, submit) | 1 | Two routes with no instruction on which to use, or whether the PDF must be uploaded through the form. The form heading sits over blank space for several seconds after the page loads. |
| Know what happens next | not possible | 0 | No confirmation copy, no committee contact, no decision date. |
| Check eligibility for Carl Reed | 1 | 0 | "historically black college or university" is underlined like a link but is not one. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| SC1 | High | Two application routes, PDF and online form, with no statement of how they relate. The form requires an upload, so the intended flow is probably "download PDF, complete, upload", but nothing says so. | `source/content.txt`; `screenshots/1440-form-late.png` | Applicants guess; the committee gets mixed submissions. | A numbered "How to apply" list above the form: 1 download, 2 complete and sign, 3 upload here with the details below. |
| SC2 | High | The form mounts only after scrolling into view plus a delay; in the first capture the heading "Submit Application" stood over an empty section (`docH` 1,990 px, no inputs) and the mounted page is 2,822 px. | `tooling/digest-1.txt` (first pass) vs `source/inventory-1440.json` (re-capture); `screenshots/1440-form-late.png` | A visitor who arrives and sees a heading over nothing assumes the form is closed. | Server-rendered form. |
| SC3 | High | Phone country picker defaults to United Kingdom (+44). | `screenshots/375-full.png`, `1440-form-late.png` | Every Korean or US parent must change it; a missed change corrupts the number. | Default to +82 with +1 second, or a plain text field with `autocomplete="tel"`. |
| SC4 | Medium | "Application" buttons are white on gold (#cdb33a), 2.07:1; upload helper text 1.97:1 and 2.06:1. | axe `color-contrast` | | Dark text on gold or a darker gold. |
| SC5 | Medium | PDF links do not say PDF, size, or that they open a new tab; file names are 90-character CDN names. | inventory `links` | | "Future Leaders application (PDF, 2 pages)" with `download` attribute. |
| SC6 | Medium | Heading order: `h1`, `h4`, `h2`, `h4`, `h2` "$2,500" (a price as a heading), `h2`. | axe `heading-order` x2 | | Card titles as `h3`, prices as text. |
| SC7 | Medium | Required upload up to 20 MB with no accepted file types, no privacy note, and personal data (parent phone and email) collected with no statement of use. | form inventory | Students' and parents' data; 20 MB uploads fail on phones. | Accept PDF only, 5 MB, state who reads it and for how long. |
| SC8 | Low | The award winners in the hero photograph are holding cheques with their names visible; the image has no alt. | `screenshots/1440-fold.png` | Minors' names in a hero image. | Confirm consent or crop; add alt. |
| SC9 | Low | "historically black college or university" is underlined with no link. | screenshot | Looks like a link. | Link to a list, or remove underline. |

Site-wide: L2, L3, L4, L5, L6, L8, L10, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 (re-capture) | `color-contrast` x3, `heading-order` x2, `label` (phone search input), `landmark-one-main`, `meta-viewport-large`, `region` |
| axe 375 | `color-contrast` x8, `heading-order` x3, `label` x3 (critical), `label-title-only`, `list`, plus the above |
| Keyboard | form fields are reachable; visible labels present on this form; focus ring is the browser default |
| Overflow | none |

## Everything the page does (parity list)

Hero; deadline; two scholarship cards with amount, count, eligibility, PDF application; online application form with eight fields, file upload, hCaptcha; submit.

## For the repo mock

`scholarships.dc.html` has the two cards and a form with a different field set (scholarship choice, names, email, high school, college, essay) that writes to `localStorage` and then shows "Application Received". Align the field set with the committee (the live form, the mock, and `google-forms-spec.md` are three different forms), add the PDF downloads, add the "How to apply" steps, put a review step before submit, and post to a real destination. Fix the 375 px overflow caused by the two-column name grid, fix the 3.98:1 gold eyebrow, and label every field.
