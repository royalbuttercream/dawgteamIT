// Placeholder data layer for applications (scholarship / event RSVP / membership interest)
// and gallery photos. Row shapes mirror the future Supabase tables (see repo plan doc) so
// swapping the function bodies below for real supabase-js calls won't require touching
// any page that calls these functions — only this file changes.
window.LambdaXiData = (function () {
  const APPLICATIONS_KEY = 'lambdaxi_applications';

  function readApplications() {
    return JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]');
  }

  function submitApplication(type, applicant) {
    // type: 'scholarship' | 'event_rsvp' | 'membership_interest'
    // applicant: { applicant_name, email, phone, payload }
    const row = {
      id: crypto.randomUUID(),
      type,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...applicant,
    };
    const all = readApplications();
    all.push(row);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(all));
    return Promise.resolve(row);
  }

  function listApplications(type) {
    const all = readApplications();
    return Promise.resolve(type ? all.filter((a) => a.type === type) : all);
  }

  return { submitApplication, listApplications };
})();
