// server/controllers/users.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/db.json');

// Helpers
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// -------------------- USERS CONTROLLER --------------------
module.exports = {
  // Register new user
  registerUser: (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const db = readDB();

    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // ⚠️ In real apps, hash this!
      role: 'user',
      status: 'active',
      verified: false // 👈 default to not verified
    };

    db.users.push(newUser);
    writeDB(db);

    res.json({ message: 'User registered successfully', user: newUser });
  },

  // Login
  loginUser: (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
  },

  // Get all users (admin use)
  getUsers: (req, res) => {
    const db = readDB();
    res.json(db.users || []);
  },

  // Update user role/status
  updateUser: (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.id == id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (role) user.role = role;
    if (status) user.status = status;

    writeDB(db);
    res.json({ message: `User #${id} updated`, user });
  },

  // ✅ Verify user account
  verifyUser: (req, res) => {
    const { id } = req.params;
    const db = readDB();

    const user = db.users.find(u => u.id == id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.verified = true;
    writeDB(db);

    res.json({ message: `User ${user.name} verified successfully`, user });
  }
};