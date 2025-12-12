const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');

// -------------------- ADMIN ROUTES --------------------

// Users
router.get('/users', authenticate, requireAdmin, adminController.getUsers);
router.post('/users/:id/role', authenticate, requireAdmin, adminController.changeUserRole);

// Loans
router.get('/loans', authenticate, requireAdmin, adminController.getLoans);
router.post('/loans/:id/approve', authenticate, requireAdmin, adminController.approveLoan);
router.post('/loans/:id/reject', authenticate, requireAdmin, adminController.rejectLoan);

// Reports
router.get('/reports', authenticate, requireAdmin, adminController.getReports);

module.exports = router;