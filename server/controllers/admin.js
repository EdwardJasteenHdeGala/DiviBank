// server/controllers/admin.js
const fs = require('fs');
const path = require('path');

// Path to db.json
const dbPath = path.join(__dirname, '../../data/db.json');

// Helper to read/write db.json
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// -------------------- ADMIN CONTROLLER --------------------
module.exports = {
  // Get all users
  getUsers: (req, res) => {
    const db = readDB();
    res.json(db.users);
  },

  // Change user role
  changeUserRole: (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.id == id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    writeDB(db);
    res.json({ message: `User ${user.name} role updated to ${role}`, user });
  },

  // Get all loans
  getLoans: (req, res) => {
    const db = readDB();
    res.json(db.loans);
  },

  // Approve loan
  approveLoan: (req, res) => {
    const { id } = req.params;
    const db = readDB();

    const loan = db.loans.find(l => l.id == id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    loan.status = 'Approved';
    writeDB(db);
    res.json({ message: `Loan #${id} approved`, loan });
  },

  // Reject loan
  rejectLoan: (req, res) => {
    const { id } = req.params;
    const db = readDB();

    const loan = db.loans.find(l => l.id == id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    loan.status = 'Rejected';
    writeDB(db);
    res.json({ message: `Loan #${id} rejected`, loan });
  },

  // Reports & Analytics
  getReports: (req, res) => {
    const db = readDB();
    const totalLoans = db.loans.length;
    const approvedLoans = db.loans.filter(l => l.status === 'Approved').length;
    const pendingLoans = db.loans.filter(l => l.status === 'Pending').length;
    const rejectedLoans = db.loans.filter(l => l.status === 'Rejected').length;
    const activeUsers = db.users.filter(u => u.status === 'active').length;

    res.json({
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      activeUsers
    });
  }
};