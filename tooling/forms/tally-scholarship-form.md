# Scholarship application on Tally

Build sheet for the online scholarship application. Tally replaces the Google Form
because Tally accepts file uploads without asking the applicant to sign in.

## Account

Sign up at tally.so with the chapter Gmail, lambdaxi1911@gmail.com, so the form
and its responses belong to the chapter, not to a person. Free plan.

## Form settings

- Title: Lambda Xi Chapter Scholarship Application
- Description: Applications are accepted 1 February to 1 May. Future Leaders
  Scholarship: $2,500, three recipients, any accredited college or university.
  Bro. Carl Reed Scholarship: $3,000, one recipient, HBCU-bound. Download and
  complete the application form from the Scholarships page first; you will upload
  it at the end.
- Settings > General: turn on "Close form on a date" and set 1 May; reopen each
  1 February. Message when closed: "Applications closed on 1 May. The next window
  opens on 1 February."
- Settings > Notifications: email lambdaxi1911@gmail.com on every submission.
- Settings > Integrations: connect Google Sheets in the chapter account; one sheet,
  one row per application, upload links in the row.
- Thank-you page text: "Thank you. The Scholarship Committee has your application
  and will acknowledge it by email. Awards are announced after the 1 May close."

## Questions, in order

Page 1: Scholarship

1. Which scholarship are you applying for? Multiple choice, required.
   Options: Future Leaders Scholarship ($2,500); Bro. Carl Reed Scholarship
   ($3,000, HBCU-bound); Both.

Page 2: Student

2. Student first name. Short answer, required.
3. Student last name. Short answer, required.
4. Student email. Email, required.
5. Student phone (Korea +82 or US +1). Phone, optional.
6. High school. Multiple choice with "Other" allowed, required.
   Options: Daegu; Osan; Humphreys.
7. College or university you plan to attend. Short answer, required.
8. Briefly describe your community involvement and goals. Long answer, required.

Page 3: Parent or guardian

9. Parent or guardian name. Short answer, required.
10. Parent or guardian phone (Korea +82 or US +1). Phone, required.
11. Parent or guardian email. Email, required.

Page 4: Documents

12. Completed application form and transcript. File upload, required, PDF only,
    allow multiple files, 10 MB per file (the free plan's limit).

## After building

Click Share. Copy the form link (tally.so/r/xxxxxx) and send it. The page will use
the plain iframe embed (tally.so/embed/xxxxxx) so no Tally script runs on the site.
