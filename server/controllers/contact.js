// server/controllers/contact.js
const fs = require('fs');
const path = require('path');

// Path to db.json
const dbPath = path.join(__dirname, '../../data/db.json');

// Helpers to read/write db.json
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// -------------------- CONTACT CONTROLLER --------------------
module.exports = {
  // Handle new contact message
  submitMessage: (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const db = readDB();

    // Ensure contactMessages array exists
    if (!db.contactMessages) {
      db.contactMessages = [];
    }

    const newMessage = {
      id: Date.now(), // unique ID
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    db.contactMessages.push(newMessage);
    writeDB(db);

    res.json({ status: 'Message received! We will get back to you soon.', message: newMessage });
  },

  // Get all contact messages (admin use)
  getMessages: (req, res) => {
    const db = readDB();
    res.json(db.contactMessages || []);
  }
};