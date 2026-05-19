const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const EMAIL = process.env.ADMIN_EMAIL || 'iqbalsadia808@gmail.com';
const NEW_PASSWORD = process.argv[2] || 'Bagify123';

async function reset() {
  const dbPath = path.join(__dirname, 'db', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const hash = await bcrypt.hash(NEW_PASSWORD, 10);

  const user = db.users.find(
    (u) => u.email.toLowerCase() === EMAIL.toLowerCase()
  );

  if (!user) {
    console.error(`User not found: ${EMAIL}`);
    process.exit(1);
  }

  user.password = hash;
  user.updatedAt = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Password reset for ${EMAIL}`);
  console.log(`New password: ${NEW_PASSWORD}`);
}

reset();
