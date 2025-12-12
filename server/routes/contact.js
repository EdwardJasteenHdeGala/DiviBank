const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');

// Public route: submit a contact form message
router.post('/', contactController.submitMessage);

// Admin route: view all contact messages
// 🔐 Protect with requireAdmin middleware if you only want admins to see
router.get('/', contactController.getMessages);

module.exports = router;