# Contact Us: review

URL: https://www.lambdaxi1911.com/contact-us
Captures: `screenshots/`, `source/`

## Who comes here and why

Prospective members, parents with a scholarship or conference question, partner organisations, and brothers relocating to Korea. They want to reach a person quickly and to know where the chapter is.

## What the page contains

`h1` "Contact Us"; a form with First Name, Last Name, Email, a topic dropdown rendered as "Select..." (react-select combobox), Phone with a country-code picker defaulting to +44, Message, hCaptcha checkbox, gold "Submit" button. A hidden "Comment" honeypot field. No email address, phone number, postal address, meeting time or map on the page. The mobile bottom bar offers "Find Us" (Pyeongtaek map popup). Page title "Contact Info".

## Task flows

| Task | Steps | Wrong turns | Notes |
|---|---|---|---|
| Send a message | 1 (close popup) + 6 fields + captcha + submit = 9 | 1 (phone country code) | Works. No statement of who replies or when. |
| Email the chapter directly | not possible | 1 | No address on the page; the flyer elsewhere shows scholarship@lambdaxi1911.com. |
| Find the chapter's location | mobile 1 (Find Us); desktop not possible | 1 | |
| Ask about membership | 9, choosing a topic | 0 | Topic options are not in the markup until the control is opened; "Seeking" in the header goes to a national portal instead. |

## Page-specific findings

| ID | Severity | Finding | Evidence | Why it matters | Fix |
|---|---|---|---|---|---|
| CU1 | High | No contact details as text: no email, phone, address or meeting schedule. The form is the only channel. | `source/content.txt` | If the form or captcha fails, the visitor has nothing; screen reader and low-vision users often prefer email. | Email (role address), phone, mailing address or "meets at", office hours, map. |
| CU2 | High | Labels are placeholders at #bbbbbb (1.91:1) that vanish on typing; the topic combobox has no label (axe `label`, critical); the phone search input has no label. | axe 1440: `label` critical, `color-contrast` x6 | WCAG 1.3.1, 3.3.2, 1.4.3. | Visible labels above fields; label the topic select; text phone field. |
| CU3 | High | Phone country picker defaults to United Kingdom. | `screenshots/375-full.png` | Korea (+82) and United States (+1) are the audiences. | Default +82, then +1, or free text with `autocomplete="tel"`. |
| CU4 | Medium | Submit button white on gold 2.07:1; a loading spinner sits between Message and Submit while hCaptcha loads at 1440 (`1440-form-late.png`, first pass). | axe; screenshot | | Dark text on gold; reserve space for the captcha. |
| CU5 | Medium | At 375 the fixed bottom bar, the cookie banner and the hCaptcha widget overlap the Submit button. | `screenshots/375-full.png` | The primary action is covered. | Remove the bottom bar on form pages or pad the form above it; dismissable banner that does not cover controls. |
| CU6 | Medium | No confirmation copy, no privacy statement, no expected response time. | content.txt | | "We reply within a week" and a one-line data note. |
| CU7 | Low | Page title "Contact Info" vs heading "Contact Us"; empty `h4` in the flow. | inventory; axe `empty-heading` | | Match; remove. |

Site-wide: L2, L3, L4, L5, L6, L8, L10, L11, L12.

## Accessibility summary

| Check | Result |
|---|---|
| axe 1440 | `color-contrast` x6, `empty-heading`, `heading-order`, `label` (critical), `landmark-one-main`, `meta-viewport-large`, `region` x20 |
| axe 375 | `color-contrast` x9 plus the above |
| Keyboard | 13 stops at 1440; five fields with no visible focus indicator |
| Console | "bobcatPropTypes is undefined for PhoneCodePickerField" from the theme |

## Everything the page does (parity list)

Contact form: first name, last name, email, topic, phone with country code, message, captcha, submit; honeypot; map via mobile bar.

## For the repo mock

`contact-us.dc.html` has a similar form (no phone, no captcha) that stores nothing and then says "Message Sent". Add the text contact details, real labels, a topic list agreed with the chapter, a review step, spam protection, and a real destination. Add the map and address to the page rather than only the footer. The 375 px overflow in the mock's two-column name row also needs fixing.
