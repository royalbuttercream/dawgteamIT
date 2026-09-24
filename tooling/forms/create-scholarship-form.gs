/**
 * Creates the Lambda Xi scholarship application as a Google Form.
 *
 * Run once, signed in as the account that should own the form (the chapter
 * Gmail, lambdaxi1911@gmail.com):
 *   1. Open https://script.google.com and choose New project.
 *   2. Replace the editor contents with this file and click Run.
 *   3. Approve the permission prompt (the script only creates a form in your Drive).
 *   4. Open View > Logs. The log prints the edit URL and the public URL.
 *   5. In the form editor add one question by hand: "Completed application form
 *      and transcript", type File upload, PDF only, up to 10 MB, required.
 *      Apps Script cannot create file-upload questions.
 *   6. Send > link icon: copy the URL and paste it into the Scholarships page.
 *
 * Questions follow the chapter's current online application plus the two
 * items from google-forms-spec.md (college and community involvement).
 */
function createScholarshipForm() {
  var form = FormApp.create('Lambda Xi Chapter Scholarship Application');
  form.setDescription(
    'Applications are accepted 1 February to 1 May. Future Leaders Scholarship: $2,500, ' +
    'three recipients, any accredited college or university. Bro. Carl Reed Scholarship: ' +
    '$3,000, one recipient, HBCU-bound. Download and complete the application form from ' +
    'the Scholarships page first; you will upload it at the end.');
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);
  form.setConfirmationMessage(
    'Thank you. The Scholarship Committee has your application and will acknowledge it by ' +
    'email. Awards are announced after the 1 May close.');

  form.addMultipleChoiceItem()
    .setTitle('Which scholarship are you applying for?')
    .setChoiceValues(['Future Leaders Scholarship ($2,500)', 'Bro. Carl Reed Scholarship ($3,000, HBCU-bound)', 'Both'])
    .setRequired(true);

  form.addPageBreakItem().setTitle('Student');
  form.addTextItem().setTitle('Student first name').setRequired(true);
  form.addTextItem().setTitle('Student last name').setRequired(true);
  form.addTextItem().setTitle('Student email')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);
  form.addTextItem().setTitle('Student phone (Korea +82 or US +1)').setRequired(false);
  form.addMultipleChoiceItem()
    .setTitle('High school')
    .setChoiceValues(['Daegu', 'Osan', 'Humphreys'])
    .showOtherOption(true)
    .setRequired(true);
  form.addTextItem().setTitle('College or university you plan to attend').setRequired(true);
  form.addParagraphTextItem()
    .setTitle('Briefly describe your community involvement and goals')
    .setRequired(true);

  form.addPageBreakItem().setTitle('Parent or guardian');
  form.addTextItem().setTitle('Parent or guardian name').setRequired(true);
  form.addTextItem().setTitle('Parent or guardian phone (Korea +82 or US +1)').setRequired(true);
  form.addTextItem().setTitle('Parent or guardian email')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);

  form.addPageBreakItem()
    .setTitle('Documents')
    .setHelpText('Add the file-upload question here by hand: completed application form and transcript, PDF, up to 10 MB, required.');

  Logger.log('Edit URL:   ' + form.getEditUrl());
  Logger.log('Public URL: ' + form.getPublishedUrl());
}
