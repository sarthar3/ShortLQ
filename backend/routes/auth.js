const express = require('express');
const router = express.Router();
const { signup, login, deleteAccount } = require('../controllers/authController');
const { signupValidation, loginValidation, validate } = require('../middleware/validation');
const auth = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupValidation, validate, signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, validate, login);

// @route   DELETE /api/auth/account
// @desc    Permanently delete account + all data
// @access  Private
router.delete('/account', auth, deleteAccount);

module.exports = router;
