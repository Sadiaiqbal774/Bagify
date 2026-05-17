const fs = require('fs');
const bcrypt = require('bcryptjs');

async function reset() {
  const dbPath = './db/db.json';
  const db = JSON.parse(fs.readFileSync(dbPath));
  
  const h1 = await bcrypt.hash('admin123', 10);
  
  let found = false;
  for (let u of db.users) {
    if (u.role === 'admin') {
      u.password = h1;
      found = true;
    }
  }
  
  if (found) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('All admin passwords reset to: admin123');
  }
}

reset();
