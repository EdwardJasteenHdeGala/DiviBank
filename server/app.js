const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// -------------------- ROUTES --------------------
const usersRoutes = require('./routes/users');
const loansRoutes = require('./routes/loans');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// -------------------- DB Helper --------------------
const dbPath = path.join(__dirname, '../data/db.json');
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { users: [], loans: [], contact: [], transactions: [], balance: [] };
  }
}

// -------------------- Transactions --------------------
app.get('/api/transactions', (req, res) => {
  const db = readDB();
  res.json(db.transactions || []);
});

// -------------------- Balance --------------------
app.get('/api/balance', (req, res) => {
  const db = readDB();
  res.json(db.balance || {});
});

// -------------------- Mount Modular Routes --------------------
app.use('/api/users', usersRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// -------------------- LOGIN --------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// -------------------- ADMIN STATS --------------------
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();

  const totalLoans = db.loans ? db.loans.length : 0;
  const approvedLoans = db.loans ? db.loans.filter(l => l.status === 'Approved').length : 0;
  const activeUsers = db.users ? db.users.filter(u => u.verified === true).length : 0;
  const pendingMessages = db.contact ? db.contact.filter(m => m.status === 'pending').length : 0;

  res.json({ totalLoans, approvedLoans, activeUsers, pendingMessages });
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));