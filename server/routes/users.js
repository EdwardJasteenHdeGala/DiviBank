const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// Register
router.post('/register', usersController.registerUser);

// Login
router.post('/login', usersController.loginUser);

// Get all users
router.get('/', usersController.getUsers);

// Update user (role/status)
router.put('/:id', usersController.updateUser);

// ✅ Verify user account
router.put('/:id/verify', usersController.verifyUser);

module.exports = router;