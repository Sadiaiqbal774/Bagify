/** Only the email in ADMIN_EMAIL may act as admin. */
const getRoleForEmail = (email) => {
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  if (!adminEmail || !email) return 'user';
  return email.toLowerCase().trim() === adminEmail ? 'admin' : 'user';
};

module.exports = { getRoleForEmail };
