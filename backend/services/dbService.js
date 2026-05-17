const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/db.json');

const readDb = () => {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeDb = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

const dbService = {
  // Generic Find
  find: (collection) => {
    return readDb()[collection];
  },

  // Find by ID
  findById: (collection, id) => {
    const data = readDb()[collection];
    return data.find(item => String(item.id) === String(id) || String(item._id) === String(id));
  },

  // Find One by criteria (simplified)
  findOne: (collection, criteria) => {
    const data = readDb()[collection];
    return data.find(item => {
      return Object.keys(criteria).every(key => item[key] === criteria[key]);
    });
  },

  // Create
  create: (collection, newItem) => {
    const db = readDb();
    const itemWithId = { ...newItem, _id: Date.now().toString(), id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
    db[collection].push(itemWithId);
    writeDb(db);
    return itemWithId;
  },

  // Update
  update: (collection, id, updates) => {
    const db = readDb();
    const index = db[collection].findIndex(item => String(item.id) === String(id) || String(item._id) === String(id));
    if (index !== -1) {
      db[collection][index] = { ...db[collection][index], ...updates, updatedAt: new Date() };
      writeDb(db);
      return db[collection][index];
    }
    return null;
  },

  // Delete
  delete: (collection, id) => {
    const db = readDb();
    const initialLength = db[collection].length;
    db[collection] = db[collection].filter(item => String(item.id) !== String(id) && String(item._id) !== String(id));
    const wasDeleted = db[collection].length < initialLength;
    writeDb(db);
    return wasDeleted;
  }
};

module.exports = dbService;
