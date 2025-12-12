const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// -------------------- LOANS CONTROLLER --------------------
function getLoans(req, res) {
  const db = readDB();
  res.json(db.loans || []);
}

function getUserLoans(req, res) {
  const { userId } = req.params;
  const db = readDB();
  const loans = (db.loans || []).filter(l => String(l.userId) === String(userId));
  res.json(loans);
}

function applyLoan(req, res) {
  const { userId, amount } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id == userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.verified) {
    return res.status(403).json({ error: 'Account not verified. Cannot apply for loan.' });
  }

  const newLoan = {
    id: Date.now(),
    userId: Number(userId),
    amount: Number(amount),
    status: 'Pending'
  };

  db.loans.push(newLoan);
  writeDB(db);

  res.json({ message: 'Loan application submitted', loan: newLoan });
}

function updateLoanStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDB();

  const loan = db.loans.find(l => String(l.id) === String(id));
  if (!loan) return res.status(404).json({ error: 'Loan not found' });

  loan.status = status;
  writeDB(db);

  res.json({ message: `Loan #${id} updated to ${status}`, loan });
}

module.exports = { getLoans, getUserLoans, applyLoan, updateLoanStatus };