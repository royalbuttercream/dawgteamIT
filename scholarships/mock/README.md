# Scholarships mock

One standalone page. `scholarships/mock/scholarships-mock.html` replaces `/scholarships` on the live site: two scholarship award cards with their PDF applications, a numbered "How to apply" list, and an application route while the chapter's Google Form is still unbuilt. Built from `tooling/mock-src/pages/scholarships.html` by `node tooling/build-mocks.mjs`; `tokens.css`, `mock.css` and `mock.js` come from `tooling/mock-src/`.

## What is real, what is inferred, what is sample

- Amounts, counts, eligibility and the 1 February to 1 May window match the live page.
- The two application PDFs are local copies of the chapter's published 2026 and 2025-2026 forms, under `documents/`.
- The email address for applications, lambdaxi1911@gmail.com, is the address printed on both PDFs. An earlier draft used a sample role address; that has been replaced.
- The field list under "What the online form asks" is the one the Google Form is built from (`tooling/forms/create-scholarship-form.gs`): the live form's questions plus college and community involvement, per the operator on 24 September 2026. The page states that the online form needs a Google account because of the file upload, and keeps the email route for anyone without one.
- The acknowledgement and notification steps in "What happens next" describe the intended process, not a confirmed one, and are marked "process to confirm".

## Forms

The Google Form does not exist yet. The page says so with a "sample: form to be created" badge. Until it exists, the page offers the email route above and a link to the old form on the live host, with a caveat that the old form's phone field defaults to a UK country code and gives no confirmation after submitting. Per CLAUDE.md's Forms rule, the page makes no unearned claim of delivery for a form that is not yet built.

## Step counts

| Task | Live | Repo mock | This mock |
|---|---|---|---|
| Find the amount | 1 (hero) | 1 | 1 (card eyebrow) |
| Find the deadline | 1 (hero, repeated 3 times) | not shown | 1 (page intro) |
| Download the application | 1, PDF opens in a new tab with no size or format stated | not present | 1, labelled with format, page count and size, local file |
| Apply online | 9: 8 fields, upload, hCaptcha, submit, with no instruction on PDF vs form | 9, different field set, saves to `localStorage`, false success message | not possible yet; email (1 step) or the flagged old-host form |

## Everything the live page did, and where it is here

| Live capability | Here |
|---|---|
| Hero photograph with two award winners | Dropped; the winners' names were visible on their cheques with no alt text (a minors' privacy concern) |
| Deadline repeated three times | Stated once, in the page intro |
| Two cards: amount, count, eligibility, PDF application | Kept, with the PDF links now labelled by format, page count and size |
| Two application routes with no instruction on which to use | Replaced with a numbered "How to apply" list |
| Online form, 8 fields, upload, hCaptcha | Google Form created by the chapter on 24 September 2026 from the committed script, linked from the "Apply online" button; requires a Google account because of the upload; the email route stays for anyone without one |
| No confirmation or next-step copy | "What happens next" section added, marked "process to confirm" |
| Heading order h1, h4, h2, h4, h2 (a price as heading), h2 | h1, intro paragraph, card titles as h2/h3, prices as eyebrow text, no price used as a heading |
| "historically black college or university" underlined but not a link | Written as plain text, "(HBCU)" added, no underline |

## Verification

`verify.json`: axe-core zero violations at 320, 375, 768, 1280 and 1440 in light and dark; zero horizontal overflow at every width; every focus stop has a visible indicator (13 stops below 1280, 20 at 1280 and 1440); the nav dropdown opens, keeps focus inside, and closes on Escape at every width; theme persists after reload and follows the OS.

### frontend-reviewer result, 24 September 2026

| Finding | Action |
|---|---|
| Page email did not match the PDFs | Changed to the address printed on both PDFs, lambdaxi1911@gmail.com |
| Field list was worded as final and contradicted `google-forms-spec.md` | Field list settled on 24 September 2026 as the live form's questions plus the spec's two extra items; badge removed |
| Copy referred to a button that did not exist | Removed |
| Link to the old form had no caveat about its known problems | Caveat added: UK-default phone field, no submission confirmation |
| No README | This file |

## Notes moved off the page, 24 September 2026

Amounts, counts, eligibility and the window are from the live page as captured on 23 September 2026; the PDFs under `documents/` are the chapter's published forms. The acknowledgement and notification steps on the page describe the intended process and should be confirmed by the Scholarship Committee.
