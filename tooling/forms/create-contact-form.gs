/**
 * Creates the Lambda Xi contact message form as a Google Form.
 *
 * Run once, signed in as the account that should own the form (the chapter
 * Gmail, lambdaxi1911@gmail.com):
 *   1. Open https://script.google.com and choose New project.
 *   2. Replace the editor contents with this file and click Run.
 *   3. Approve the permission prompt (the script only creates a form in your Drive).
 *   4. Open View > Logs. The log prints the edit URL and the public URL.
 *   5. Send > link icon: copy the URL and paste it into the Contact page.
 *
 * No file upload and no Google sign-in, so anyone can send a message.
 * Responses land in the owner's Drive; turn on email notifications in the
 * form's Responses tab so the Keeper of Records and Seal sees each one.
 */
function createContactForm() {
  var form = FormApp.create('Contact Lambda Xi Chapter');
  form.setDescription(
    'Send a message to Lambda Xi Chapter of Omega Psi Phi Fraternity, Inc. ' +
    'A brother aims to reply within a week.');
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setConfirmationMessage('Thank you. Your message has reached the chapter; a brother aims to reply within a week.');

  form.addTextItem().setTitle('First name').setRequired(true);
  form.addTextItem().setTitle('Last name').setRequired(true);
  form.addTextItem().setTitle('Email')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('Topic')
    .setChoiceValues(['General enquiry', 'Scholarships', 'Membership interest', 'Events', 'Press'])
    .setRequired(true);
  form.addTextItem().setTitle('Phone (Korea +82 or US +1), optional').setRequired(false);
  form.addParagraphTextItem().setTitle('Message').setRequired(true);

  Logger.log('Edit URL:   ' + form.getEditUrl());
  Logger.log('Public URL: ' + form.getPublishedUrl());
}
