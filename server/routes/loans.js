const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loans');

// Get all loans (admin only)
router.get('/', loansController.getLoans);

// Get loans for a specific user
router.get('/:userId', loansController.getUserLoans);

// Apply for loan (user must be verified)
router.post('/', loansController.applyLoan);

// Update loan status (admin only)
router.put('/:id', loansController.updateLoanStatus);

module.exports = router;