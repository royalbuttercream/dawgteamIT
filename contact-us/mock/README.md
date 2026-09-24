# Contact mock

Standalone page, `contact-us/mock/contact-us-mock.html`. Replaces `/contact-us`. The live page carries a form, a captcha and a mobile-only map popup and prints no email, phone or address; this page adds the text contact details, the map as a link, and a plain description of the message form until it exists.

## What is real, what is inferred, what is sample

- The map coordinates and the four social links (Facebook, Instagram, YouTube, Messenger) are from the live page.
- The email address, `lambdaxi1911@gmail.com`, is the address printed on the chapter's scholarship PDFs. The live site publishes no email address. An earlier draft used a sample role address and an "address to confirm" placeholder; both are replaced with this address.
- The page head states the chapter is based in Pyeongtaek, which the map pin supports, and that a brother aims to reply within a week. The reply time is a service target, marked "reply time to confirm".

## Forms

The Google Form was created by the chapter on 24 September 2026 from `tooling/forms/create-contact-form.gs` and is embedded under "Send a message", with a button that opens it in its own tab and the email address as a second route. It asks name, email, topic (General enquiry, Scholarships, Membership interest, Events, Press), optional phone and message; no sign-in and no upload, so anyone can send one. Notifications go to the owning account. No custom submit handler, no localStorage, no fake success copy.

## Step counts

| Task | Live | Repo mock | This mock |
|---|---|---|---|
| Find an email address | not possible | not possible | 1 (Ways to reach us) |
| Find the chapter on a map | mobile 1 (Find Us), desktop not possible | not possible | 1 (map link) |
| Send a message | 9 (6 fields, phone code, captcha, submit) | email placeholder only, stores nothing | 1 (email link) until the form is live |
| Find the Instagram account | not on this page | not on this page | 1 (Follow the chapter list) |

## Everything the live page did, and where it is here

| Live capability | Here |
|---|---|
| Contact form (name, email, topic, phone, message) | Same fields listed as what the form will ask, with the email route standing in until it exists |
| hCaptcha | Not needed; Google Forms carries its own spam protection |
| Google Maps embed via mobile "Find Us" popup | A text link to the same coordinates, on all widths |
| No email, phone or address on the page | Email address added; no phone or postal address on the live page to carry over |

Social links appear twice: as a labelled text list in the body and as icons in the shared footer. The body list is kept because it is the only place the links have visible text.

## Verification

`verify.json`: axe-core zero violations at 320, 375, 768, 1280 and 1440 in light and dark; no horizontal overflow; every focus stop has a visible indicator; the topic dropdown opens, traps focus and closes on Escape; theme persists after reload and follows the OS.

Review gate: frontend-reviewer result recorded below.

### frontend-reviewer result, 24 September 2026

| Finding | Action |
|---|---|
| "Use the message form on this page" read as if a form already existed | Reworded to "the message form on this page when it is live" |
| General enquiries routed to a scholarship role address | Replaced with the chapter's general address |
| "Based around Camp Humphreys" was unsourced | Changed to Pyeongtaek, which the map pin supports |
| Reply-time claim in the page head was unqualified | Softened to "a brother aims to reply within a week", marked to confirm |
| Social list duplicated between body and footer | Kept; the body list is the only place the links carry visible text |
| No README | This file |
