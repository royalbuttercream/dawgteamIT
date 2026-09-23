# Google Forms Spec — Lambda Xi Applications

Three forms to build by hand in Google Forms (forms.google.com), under whichever Google account should own them (your personal account, or a chapter Workspace account if one exists — see note at the end). Each takes about 10 minutes to set up. Field names below match the `type`/`payload` shape already used in `js/lambdaxi-data.js`, so nothing about the data model needs to change.

For each form: **Settings → Responses → "Create Spreadsheet"** links it to a Google Sheet automatically — that's what officers check to see submissions. No extra setup needed for that part.

---

## 1. Scholarship Application

**Form title:** Lambda Xi Chapter — Scholarship Application
**Description:** "Applications are accepted 1 February to 1 May. Two scholarships available: the Future Leaders Scholarship ($2,500, 3 recipients, open to any accredited college/university) and the Bro. Carl Reed Scholarship ($3,000, 1 recipient, HBCU-bound only)."

| Field | Type | Required | Options |
|---|---|---|---|
| Which scholarship are you applying for? | Multiple choice | Yes | Future Leaders Scholarship ($2,500) / Bro. Carl Reed Scholarship ($3,000, HBCU-bound) |
| First Name | Short answer | Yes | |
| Last Name | Short answer | Yes | |
| Email | Short answer (validate: email) | Yes | |
| Phone | Short answer | No | |
| High School | Short answer | Yes | |
| College or University You Plan to Attend | Short answer | Yes | |
| Briefly describe your community involvement and goals | Paragraph | Yes | |
| Transcript / supporting documents | File upload | No | enables auto Drive folder for attachments |

**After building:** Form → Send → click the link (`<>`) icon to get the embeddable `<iframe>` code, or just the share URL. Hand that to whoever is building the AI Studio site (see `migration-brief.md`) to place on the Scholarships page.

---

## 2. 50th Anniversary Gala RSVP

**Form title:** Lambda Xi 50th Anniversary Gala — RSVP
**Description:** "Join the Brothers of Lambda Xi as we celebrate five decades of friendship, service, and leadership on the Korean Peninsula. Date: TBA — RSVP now to get updates as details are confirmed."

| Field | Type | Required | Options |
|---|---|---|---|
| Full Name | Short answer | Yes | |
| Email | Short answer (validate: email) | Yes | |
| Number of Guests | Short answer (validate: number) | No | |
| Dietary needs or notes | Paragraph | No | |

---

## 3. Membership Interest

**Form title:** Lambda Xi Chapter — Membership Interest
**Description:** "Interested in Omega Psi Phi? Tell us a bit about yourself and a brother will follow up. For the official national intake process, visit msp.oppf.org."

| Field | Type | Required | Options |
|---|---|---|---|
| Full Name | Short answer | Yes | |
| Email | Short answer (validate: email) | Yes | |
| Message | Paragraph | Yes | |

Note: this can also just be a "Membership Interest" option inside a single general Contact form instead of a standalone one — the current site does it that way (one Contact form with a topic dropdown). Either structure works; a standalone form makes the Sheet cleaner to review, a shared Contact form means less to maintain. Your call.

---

## Who owns these

Forms/Sheets/Drive resources need to live under one Google account so officers know where to look. Options, in order of what's usually easiest for a volunteer organization:
1. **A chapter Google Workspace account**, if Lambda Xi already has one (check if `@lambdaxi1911.com`-style email addresses exist — Google Workspace for Nonprofits is free for registered 501(c) orgs).
2. **A shared/generic Google account** created for the chapter (e.g., a Gmail made specifically for this purpose, with the password known to the current and incoming Basileus/Keeper of Records) — avoids the forms being tied to one person who eventually leaves the chapter.
3. **A current officer's personal Google account** — works, but means ownership has to be manually transferred every time that office changes hands. Not recommended for anything meant to outlast the current term.

I can't create any of these accounts — that has to be done by you or the relevant officer, signed in as themselves.
